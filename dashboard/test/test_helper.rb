require 'test_reporter'

if defined? ActiveRecord
  ActiveRecord::Migration&.check_pending!
end

# This is a workaround for https://github.com/kern/minitest-reporters/issues/230
Minitest.load_plugins
Minitest.extensions.delete('rails')
Minitest.extensions.unshift('rails')

reporters = [CowReporter.new]
if ENV['CIRCLECI']
  reporters << Minitest::Reporters::JUnitReporter.new("#{ENV['CIRCLE_TEST_REPORTS']}/dashboard")
end
# Skip this if the tests are run in RubyMine
Minitest::Reporters.use! reporters unless ENV['RM_INFO']

ENV["UNIT_TEST"] = 'true'
ENV["RAILS_ENV"] = "test"
ENV["RACK_ENV"] = "test"
ENV['TZ'] = 'UTC'

# deal with some ordering issues -- sometimes environment is loaded
# before test_helper and sometimes after. The CDO stuff uses RACK_ENV,
# but running unit tests in the test env for developers only sets
# RAILS ENV. We fix it above but we need to reload some stuff...

require 'mocha/mini_test'

CDO.stubs(:rack_env).returns(:test) if defined? CDO
Rails.application&.reload_routes! if defined?(Rails) && defined?(Rails.application)

require File.expand_path('../../config/environment', __FILE__)
I18n.load_path += Dir[Rails.root.join('test', 'en.yml')]
I18n.backend.reload!
I18n.fallbacks[:'te-ST'] = [:'te-ST', :'en-US', :en]
CDO.stubs(override_pegasus: nil)
CDO.stubs(override_dashboard: nil)

Rails.application.routes.default_url_options[:host] = CDO.dashboard_hostname
Dashboard::Application.config.action_mailer.default_url_options = {host: CDO.canonical_hostname('studio.code.org'), protocol: 'https'}
Devise.mailer.default_url_options = Dashboard::Application.config.action_mailer.default_url_options

require 'rails/test_help'

# Raise exceptions instead of rendering exception templates.
Dashboard::Application.config.action_dispatch.show_exceptions = false

require 'dynamic_config/gatekeeper'
require 'dynamic_config/dcdo'
require 'testing/setup_all_and_teardown_all'
require 'testing/lock_thread'
require 'testing/transactional_test_case'
require 'testing/spec_syntax'
require 'testing/capture_queries'
require 'testing/rspec_mocks'

require 'parallel_tests/test/runtime_logger'

class ActiveSupport::TestCase
  ActiveRecord::Migration.check_pending!

  setup do
    AWS::S3.stubs(:upload_to_bucket).raises("Don't actually upload anything to S3 in tests... mock it if you want to test it")
    AWS::S3.stubs(:download_from_bucket).raises("Don't actually download anything to S3 in tests... mock it if you want to test it")

    Cdo::Metrics.client ||= Aws::CloudWatch::Client.new(stub_responses: true)

    CDO.stubs(override_pegasus: nil)
    CDO.stubs(override_dashboard: nil)

    set_env :test

    # how come this doesn't work:
    Dashboard::Application.config.action_controller.perform_caching = false
    # as in, I still need to clear the cache even though we are not 'performing' caching
    Rails.cache.clear

    # clear log of 'delivered' mails
    ActionMailer::Base.deliveries.clear

    Gatekeeper.clear
    DCDO.clear

    Rails.application.config.stubs(:levelbuilder_mode).returns false

    # Ensure that AssetHelper#webpack_asset_path does not raise an exception
    # when called from unit tests. See comments on that method for details.
    CDO.stubs(:optimize_webpack_assets).returns(false)
    CDO.stubs(:use_my_apps).returns(true)

    # Don't attempt to make actual AWS API calls, either, for the same reason
    AWS::S3.stubs(:cached_exists_in_bucket?).returns(true)
    AWS::S3.stubs(:exists_in_bucket).returns(true)
  end

  teardown do
    Dashboard::Application.config.action_controller.perform_caching = false
    I18n.locale = I18n.default_locale
    set_env :test
  end

  def after_teardown
    super
  ensure
    # Ensures the time for the next tests is unfrozen.
    Timecop.return if Timecop.frozen?
  end

  def panda_panda
    # this is the panda face emoji which is a 4 byte utf8 character
    # (some of our db tables can't handle these)
    "Panda\u{1F43C}"
  end

  def set_env(env)
    Rails.env = env.to_s
    CDO.stubs(rack_env: env)
  end

  # some s3 helpers/mocks
  def expect_s3_upload
    CDO.stubs(disable_s3_image_uploads: false)
    AWS::S3.expects(:upload_to_bucket).returns(true)
  end

  def expect_s3_upload_failure
    CDO.stubs(disable_s3_image_uploads: false)
    AWS::S3.expects(:upload_to_bucket).returns(nil)
  end

  def expect_no_s3_upload
    CDO.stubs(disable_s3_image_uploads: false)
    AWS::S3.expects(:upload_to_bucket).never
  end

  # Add more helper methods to be used by all tests here...
  include FactoryBot::Syntax::Methods
  include ActiveSupport::Testing::SetupAllAndTeardownAll
  include ActiveSupport::Testing::TransactionalTestCase
  include ActiveSupport::Testing::SpecSyntax
  include CaptureQueries

  def seed_deprecated_unit_fixtures
    # Some of the functionality we're testing here relies on Scripts with
    # certain hardcoded names. In the old fixture-based model, this data was
    # all provided; in the new factory-based model, we need to do a little
    # prep.
    #
    # NOTE for any future developers: please DO NOT add new scripts to this
    # list. This exists to provide backwards compatibility to old tests which
    # are dependent on factory-provided content. If you are writing new tests,
    # please make sure that they are instead relying on factory-provided
    # content.
    tested_script_names = [
      'ECSPD',
      'allthethings',
      Unit::COURSE1_NAME,
      Unit::COURSE4_NAME,
      Unit::FLAPPY_NAME,
      Unit::FROZEN_NAME,
      Unit::HOC_NAME,
      Unit::PLAYLAB_NAME,
      Unit::TWENTY_HOUR_NAME
    ]

    tested_script_names.each do |script_name|
      # create a placeholder factory-provided Unit if we don't already have a
      # fixture-provided one.
      # Specify skip_name_format_validation because 'ECSPD' will fail to be
      # created otherwise, because upper case letters are not allowed.
      script = Unit.find_by_name(script_name) ||
        create(:script, :with_levels, levels_count: 5, name: script_name, skip_name_format_validation: true)

      # make sure that all the Unit's ScriptLevels have associated Levels.
      # This is expected during the interim period where we are no longer
      # generating Levels from fixtures, but are still generating Scripts
      script.script_levels.each do |script_level|
        next unless script_level.levels.empty?
        script_level.levels = [create(:level)]
      end
    end
  end

  def assert_creates(*args, &block)
    assert_difference(args.collect(&:to_s).collect {|class_name| "#{class_name}.count"}, &block)
  end

  def assert_does_not_create(*args, &block)
    assert_no_difference(args.collect(&:to_s).collect {|class_name| "#{class_name}.count"}, &block)
  end
  alias refute_creates assert_does_not_create
  alias refute_creates_or_destroys assert_does_not_create

  def assert_destroys(*args, &block)
    assert_difference(args.collect(&:to_s).collect {|class_name| "#{class_name}.count"}, -1, &block)
  end

  def assert_does_not_destroy(*args, &block)
    assert_no_difference(args.collect(&:to_s).collect {|class_name| "#{class_name}.count"}, &block)
  end

  #
  # Given an object and a hash mapping method or attribute names to expected
  # values, checks that each attribute has the expected value.
  #
  # Attribute names should all be symbols.  They can refer to attributes,
  # attr_readers, or methods that don't require arguments on the object.
  #
  # Expected values can be any literal object.  There are also some special
  # expected values that may be passed:
  #
  # :not_nil - refutes .nil? on the attribute.
  # :empty - asserts .empty? on the attribute.
  # :not_empty - refutes .empty? on the attribute.
  #
  def assert_attributes(obj, expected_values)
    expected_values.each do |attribute, expected_value|
      actual_value =
        if obj.respond_to? attribute
          obj.send attribute
        else
          obj[attribute]
        end
      failure_message = "Expected #{attribute} to be " \
        "#{expected_value.inspect} but was #{actual_value.inspect}"
      if expected_value == :not_nil
        refute_nil actual_value, failure_message
      elsif expected_value == :empty
        assert_empty actual_value, failure_message
      elsif expected_value == :not_empty
        refute_empty actual_value, failure_message
      elsif expected_value.nil?
        assert_nil actual_value, failure_message
      else
        assert_equal expected_value, actual_value, failure_message
      end
    end
  end

  #
  # Assert a set of attributes about an authentication option.
  # See assert_attributes for details.
  # Has special handling for :data
  #
  def assert_authentication_option(actual_option, expected_values)
    refute_nil actual_option
    asserts_data = expected_values.key? :data
    expected_data = expected_values.delete(:data)

    assert_attributes actual_option, expected_values

    return unless asserts_data
    if expected_data.nil?
      assert_nil actual_option.data
    elsif expected_data
      actual_data = JSON.parse(actual_option.data).symbolize_keys
      assert_attributes actual_data, expected_data
    end
  end

  def with_default_locale(locale)
    original_locale = I18n.default_locale
    request.env['cdo.locale'] = I18n.default_locale = locale
    yield
  ensure
    request.env['cdo.locale'] = I18n.default_locale = original_locale
  end

  # Based on assert_difference http://api.rubyonrails.org/classes/ActiveSupport/Testing/Assertions.html#method-i-assert_difference
  # just checks using not_equal instead of a numeric difference so you can compare non-numeric things
  def assert_change(expressions, message = nil, &block)
    expressions = Array(expressions)

    exps = expressions.map do |e|
      # rubocop:disable Security/Eval
      e.respond_to?(:call) ? e : lambda {eval(e, block.binding)}
      # rubocop:enable Security/Eval
    end
    before = exps.map(&:call)

    yield

    expressions.zip(exps).each_with_index do |(code, e), i|
      error  = "#{code.inspect} didn't change"
      error  = "#{message}.\n#{error}" if message
      refute_equal(before[i], e.call, error)
    end
  end

  # Based on assert_difference http://api.rubyonrails.org/classes/ActiveSupport/Testing/Assertions.html#method-i-assert_difference
  # just checks using equal instead of a numeric difference so you can compare non-numeric things
  def assert_no_change(expressions, message = nil, &block)
    expressions = Array(expressions)

    exps = expressions.map do |e|
      # rubocop:disable Security/Eval
      e.respond_to?(:call) ? e : lambda {eval(e, block.binding)}
      # rubocop:enable Security/Eval
    end
    before = exps.map(&:call)

    yield

    expressions.zip(exps).each_with_index do |(code, e), i|
      error  = "#{code.inspect} didn't change"
      error  = "#{message}.\n#{error}" if message
      assert_equal(before[i], e.call, error)
    end
  end

  # Given two hashes, ensure that they have the same set of keys in both
  # directions, collecting up errors so we can pretty-print them all in one go
  # if any errors are found.
  def assert_same_keys(a, b, a_name = 'A', b_name = 'B', message = "Keys don't match")
    assert_equal a.keys, b.keys, %(#{message}
  Found in #{a_name} but not #{b_name}: #{(a.keys - b.keys).join(', ')}
  Found in #{b_name} but not #{a_name}: #{(b.keys - a.keys).join(', ')})
  end

  # Given a regular expression and a block, ensure that the block raises an
  # exception with a message matching the regular expression.
  def assert_raises_matching(matcher)
    assert_raises do
      yield
    rescue => exception
      assert_match matcher, exception.message
      raise exception
    end
  end

  # Asserts that each expected directive is contained in the cache-control header,
  # delimited by commas and optional whitespace
  def assert_cache_control_match(expected_directives, cache_control_header)
    expected_directives.each do |directive|
      assert_match(/(^|,)\s*#{directive}\s*(,|$)/, cache_control_header)
    end
  end

  def assert_caching_disabled(cache_control_header)
    expected_directives = ['no-store']
    assert_cache_control_match expected_directives, cache_control_header
  end

  def assert_caching_enabled(cache_control_header, max_age, proxy_max_age)
    expected_directives = [
      'public',
      "max-age=#{max_age}",
      "s-maxage=#{proxy_max_age}"
    ]
    assert_cache_control_match expected_directives, cache_control_header
  end

  # Freeze time for the each test case to 9am, or the specified time
  # To use, declare anywhere in the test class:
  #   class MyTest < ActiveSupport::TestCase
  #     freeze_time
  #     #...
  def self.freeze_time(time = nil)
    time ||= Time.now.utc.to_date + 9.hours
    setup do
      Timecop.freeze time
    end
    teardown do
      Timecop.return
    end
  end

  def no_database
    Rails.logger.info '--------------'
    Rails.logger.info 'DISCONNECTING DATABASE'
    Rails.logger.info '--------------'
    ActiveRecord::Base.stubs(:connection).raises 'Database disconnected'
  end

  def setup_script_cache
    Unit.stubs(:should_cache?).returns true
    Unit.clear_cache
    # turn on the cache (off by default in test env so tests don't confuse each other)
    Rails.application.config.action_controller.perform_caching = true
    Rails.application.config.cache_store = :memory_store, {size: 64.megabytes}

    Rails.cache.clear
  end
end

# Helpers for all controller test cases
class ActionController::TestCase
  include Devise::Test::ControllerHelpers

  setup do
    ActionDispatch::Cookies::CookieJar.always_write_cookie = true
    request.env["devise.mapping"] = Devise.mappings[:user]
    request.env['cdo.locale'] = 'en-US'
  end

  # As `current_user` is not accessible from controller tests (only from within the controller),
  # the signed in user is only accessible from the session.
  # @returns [Integer, nil] The ID of the signed in user, nil if no user is signed in.
  def signed_in_user_id
    session['warden.user.user.key'].try(:first).try(:first)
  end

  # override default html document to ask it to raise errors on invalid html
  def html_document
    @html_document ||= if @response.content_type == Mime[:xml]
                         Nokogiri::XML::Document.parse(@response.body, &:strict)
                       else
                         # TODO: Enable strict parsing after fixing html errors (FND-1573)
                         Nokogiri::HTML::Document.parse(@response.body)
                       end
  end

  def assert_redirected_to_sign_in
    assert_response :redirect
    assert_redirected_to "http://test.host/users/sign_in"
  end

  def self.generate_admin_only_tests_for(action, params = {})
    test_user_gets_response_for action, user: :admin, params: params
    test_user_gets_response_for action, user: :user, response: :forbidden, params: params
    test_redirect_to_sign_in_for action, params: params
  end

  # Generates a test case ensuring redirect to sign in for not signed in users
  # @param action [String] the controller action to test
  # @param method [Symbol, String] http method with which to perform the action (default :get)
  # @param params [Hash, Proc] params to pass to the action. It can be a direct hash,
  #   or a proc that generates a hash at runtime in the context of the test case.
  def self.test_redirect_to_sign_in_for(action, method: :get, params: {})
    test_user_gets_response_for(
      action,
      name: "not signed in #{method} #{action} redirects to sign in",
      method: method,
      params: params,
      response: :redirect
    ) do
      assert_redirected_to_sign_in
    end
  end

  # Generates a basic response validation test case for a user, logged-in or not.
  # @param action [String] the controller action to test
  # @param method [Symbol, String] http method with which to perform the action (default :get)
  # @param response [Symbol, String, Number] expected response (default :success)
  # @param user [Symbol, String, Proc] user to log in, or nil to test as a not-logged-in user (default: nil)
  #   It can be a factory name to be passed to FactoryBot.create,
  #   or a proc that runs in the context of the test case and returns a user.
  # @param params [Hash, Proc] params to pass to the action. It can be a direct hash,
  #   or a proc that generates a hash at runtime in the context of the test case.
  # @param name [String] optional name of the test case.
  #   Otherwise it will be generated based on parameter values.
  #   Note: It is recommended to supply a name when varying params or user procs,
  #     as the default generated names may be ambiguous and may conflict.
  # @param queries [Number] optional number of expected ActiveRecord database queries.
  # @yield runs an optional block of additional test logic after asserting the response
  #   Note: name is required when providing a block.
  #
  # @example simple: 'user calling get index should receive success'
  #   test_user_gets_response_for :index, user: :user
  #
  # @example more complex: 'supplied user calling post destroy should receive not_found'
  #   test_user_gets_response_for(
  #     :destroy,
  #     method: :post,
  #     user: -> {@existing_user},
  #     params: {id: 1},
  #     response: :not_found
  #   )
  #
  # @example with title and block
  #   test_user_gets_response_for(
  #     :show,
  #     name: 'user calling show with id gets expected result and admin permission'
  #     user: :admin
  #     :params: {id: 1},
  #   ) do
  #     assert_equal :admin, assigns(:permission)
  #   end
  def self.test_user_gets_response_for(action, method: :get, response: :success,
    user: nil, params: {}, name: nil, queries: nil, redirected_to: nil, &block)

    if name.blank?
      raise 'name is required when a block is provided' if block
      user_display_name =
        if user.is_a?(Proc)
          'supplied user'
        else
          user.presence || 'not logged-in user'
        end

      name = "#{user_display_name} calling #{method} #{action} should receive #{response}"
      name += " to #{redirected_to}"
    end

    test name do
      # params can be a hash, or a proc that returns a hash at runtime
      refute_nil params, "params in controller tests cannot be nil"
      params = instance_exec(&params) if params.is_a? Proc

      if user
        # user can be a symbol or string for FactoryBot creation,
        # or a proc that returns a user object at runtime
        actual_user = user.is_a?(Proc) ? instance_exec(&user) : create(user)
        sign_in actual_user
      else
        sign_out :user
      end

      assert_queries queries do
        send method, action, params: params
        assert_response response
      end

      assert_redirected_to redirected_to if redirected_to

      # Run additional test logic, if supplied
      instance_exec(&block) if block
    end
  end

  def css(selector)
    Nokogiri::HTML(@response.body).css(selector)
  end

  def assert_signed_in_as(user)
    signed_in_user_id = session['warden.user.user.key'].try(:first).try(:first)
    if user
      assert signed_in_user_id, 'No signed in user'
      assert_equal user.id, signed_in_user_id
    else
      assert_nil signed_in_user_id, "Expected no signed in user"
    end
  end

  def assert_sharing_meta_tags(opts = {})
    # example:
    # <meta content="500177453358606" property="fb:app_id" />
    # <meta content="article" property="og:type" />
    # <meta content="Code.org" property="og:site_name" />
    # <meta content="Check out what I made" property="og:title" />
    # <meta content="I wrote the code myself with Code.org" property="og:description" />
    # <meta content="http://localhost:3000/assets/sharing_drawing.png" property="og:image" />
    # <meta content="https://www.facebook.com/Code.org" property="article:publisher" />
    # <meta content="http://localhost:3000/p/artist" property="og:url" />
    # <meta content="Check out what I made" name="twitter:title" />
    # <meta content="I wrote the code myself with Code.org" name="twitter:description" />
    # <meta content="@codeorg" name="twitter:site" />
    # <meta content="photo" name="twitter:card" />
    # <meta content="http://localhost:3000/assets/sharing_drawing.png" name="twitter:image" />
    # <meta content="http://localhost:3000/p/artist" name="twitter:url" />
    # <meta content="500" property="og:image:width" />
    # <meta content="261" property="og:image:height" />
    # <meta content="500" name="twitter:image:width" />
    # <meta content="261" name="twitter:image:height" />

    # if this test is breaking and you don't know what's going on, you
    # can print the meta tags like this:

    # puts css_select('meta').collect(&:to_s).join("\n")

    # constants
    assert_select 'meta[property="fb:app_id"][content="500177453358606"]'
    assert_select 'meta[content="Code.org"][property="og:site_name"]'
    assert_select 'meta[content="article"][property="og:type"]'
    assert_select 'meta[content="https://www.facebook.com/Code.org"][property="article:publisher"]'

    assert_select 'meta[content="@codeorg"][name="twitter:site"]'

    {og: 'property', twitter: 'name'}.each do |namespace, attr|
      # descriptions
      assert_select "meta[content='Check out what I made'][#{attr}='#{namespace}:title']"

      # url
      assert_select "meta[content='#{opts[:url]}'][#{attr}='#{namespace}:url']" if opts[:url]

      # image
      assert_select "meta[content='#{opts[:image_url]}'][#{attr}='#{namespace}:image']" if opts[:image_url]
      assert_select "meta[content='#{opts[:image_width]}'][#{attr}='#{namespace}:image:width']" if opts[:image_width]
      assert_select "meta[content='#{opts[:image_height]}'][#{attr}='#{namespace}:image:height']" if opts[:image_height]
    end

    if opts[:small_thumbnail]
      assert_select 'meta[content="summary"][name="twitter:card"]'
    else
      assert_select 'meta[content="photo"][name="twitter:card"]'
    end

    if opts[:apple_mobile_web_app]
      # ios icons
      assert_select 'meta[content="yes"][name="apple-mobile-web-app-capable"]'
      assert_select 'meta[content="black-translucent"][name="apple-mobile-web-app-status-bar-style"]'
    end
  end
end

class ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper
  include Devise::Test::IntegrationHelpers

  setup do
    https!
    host! CDO.canonical_hostname('studio.code.org')
  end

  def signed_in_user_id
    session['warden.user.user.key'].try(:first).try(:first)
  end
end

# Evaluates the given block temporarily setting the global locale to the specified locale.
def with_locale(locale)
  old_locale = I18n.locale
  begin
    I18n.locale = locale
    yield
  ensure
    I18n.locale = old_locale
  end
end

def stub_storage_id_for_user_id(user_id)
  storage_id = fake_storage_id_for_user_id(user_id)
  stubs(:storage_id_for_user_id).with(user_id).returns(storage_id)
end

def stub_get_storage_id(user_id)
  fake_storage_id = fake_storage_id_for_user_id(user_id)
  stubs(:get_storage_id).returns fake_storage_id
end

def fake_storage_id_for_user_id(user_id)
  Random.new(user_id.to_i).rand(1_000_000)
end

def json_response
  JSON.parse @response.body
end

# helper method for mailers to test whether urls in an email are partial paths
# first parameter is an email, ex: Pd::WorkshopMailer.detail_change_notification(enrollment)
# allowed_urls is an optional array of strings that are not complete urls to allow anyway
def links_are_complete_urls?(email, allowed_urls: nil)
  html = Nokogiri::HTML(email.body.to_s)
  urls = html.css('a').map {|link| link['href']}
  urls.all? do |url|
    url.starts_with?('mailto') || url.starts_with?('http') || allowed_urls.include?(url)
  end
end
