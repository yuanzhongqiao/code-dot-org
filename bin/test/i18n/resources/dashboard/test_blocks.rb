require_relative '../../../test_helper'
require_relative '../../../../i18n/resources/dashboard/blocks'

describe I18n::Resources::Dashboard::Blocks do
  let(:described_class) {I18n::Resources::Dashboard::Blocks}

  describe '.sync_in' do
    it 'sync-in Blocks resource' do
      described_class::SyncIn.expects(:perform).once
      described_class.sync_in
    end
  end

  describe '.sync_up' do
    it 'sync-up Blocks resource' do
      described_class::SyncUp.expects(:perform).once
      described_class.sync_up
    end
  end

  describe '.sync_down' do
    it 'sync-down Blocks resource' do
      described_class::SyncDown.expects(:perform).once
      described_class.sync_down
    end
  end

  describe '.sync_out' do
    it 'sync-out Blocks resource' do
      described_class::SyncOut.expects(:perform).once
      described_class.sync_out
    end
  end
end
