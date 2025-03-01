@no_mobile
Feature: Using the teacher dashboard

  Scenario: Visiting student name URLs in teacher dashboard
    Given I create an authorized teacher-associated student named "Sally"
    And I complete the level on "http://studio.code.org/s/allthethings/lessons/2/levels/1"

    When I sign in as "Teacher_Sally" and go home
    And I get levelbuilder access
    When I click selector "a:contains(Untitled Section)" once I see it to load a new page
    And I wait until element "#uitest-teacher-dashboard-nav" is visible
    And check that the URL contains "/teacher_dashboard/sections/"
    And I wait until element "#uitest-course-dropdown" is visible
    And I select the "All the Things! *" option in dropdown "uitest-course-dropdown"
    And I wait until element "a:contains(Sally)" is visible
    When I click selector "a:contains(Sally)" to load a new page
    And I wait until element "#teacher-panel-container" is visible
    And check that the URL contains "/s/allthethings"
    And check that the URL contains "viewAs=Instructor"

  Scenario: Viewing a student
    Given I create an authorized teacher-associated student named "Sally"
    Given I am assigned to unit "allthethings"
    And I complete the level on "http://studio.code.org/s/allthethings/lessons/2/levels/1"
    And I complete the free response on "http://studio.code.org/s/allthethings/lessons/27/levels/1"
    And I submit the assessment on "http://studio.code.org/s/allthethings/lessons/33/levels/1"

    # Progress tab
    When I sign in as "Teacher_Sally" and go home
    And I get levelbuilder access
    And I wait until element "a:contains('Untitled Section')" is visible
    And I save the section id from row 0 of the section table
    Then I navigate to teacher dashboard for the section I saved
    Then I append "/?enableExperiments=section_progress_v2" to the URL
    Then I click selector "#ui-close-dialog"
    And I wait until element "#uitest-course-dropdown" is visible
    And I select the "All the Things! *" option in dropdown "uitest-course-dropdown"

    # Toggle to V2 progress view
    Then I click selector "#ui-test-toggle-progress-view"
    And I wait until element "h6:contains(Icon Key)" is visible
    And I wait until element "#ui-test-progress-table-v2" is visible
    Then I click selector "#ui-test-toggle-progress-view"
    And I wait until element "#uitest-course-dropdown" is visible

    # Stats tab
    And I click selector "#uitest-teacher-dashboard-nav a:contains(Stats)" once I see it
    And I wait until element "#uitest-stats-table" is visible
    And element "#uitest-stats-table tr:eq(1)" contains text "Sally"

    # Manage students tab
    And I click selector "#uitest-teacher-dashboard-nav a:contains(Manage Students)" once I see it
    And I wait until element "#uitest-manage-students-table" is visible
    And element "#uitest-manage-students-table tr:eq(1)" contains text "Sally"
    And I wait until element "#uitest-privacy-text" is visible
    And element "#uitest-privacy-text" contains text "We encourage you to share this letter"
    And I wait until element "#uitest-privacy-link" is visible
    And element "#uitest-privacy-link" contains text "Just looking for a letter"

    # Text responses tab
    And I click selector "#uitest-teacher-dashboard-nav a:contains(Text Responses)" once I see it
    And I wait until element "#uitest-course-dropdown" is visible
    And I select the "All the Things! *" option in dropdown "uitest-course-dropdown"
    And I wait until element "#text-responses-table" is visible
    And element "#text-responses-table tr:contains(Sally)" contains text "hello world"

    # Assessments/Surveys tab: anonymous survey
    And I click selector "#uitest-teacher-dashboard-nav a:contains(Assessments/Surveys)" once I see it
    And I wait until element "#uitest-course-dropdown" is visible
    And I select the "All the Things! *" option in dropdown "uitest-course-dropdown"
    And I wait until element "div:contains(no submissions for this assessment)" is visible
    And I wait until element "div:contains(this survey is anonymous)" is not visible
    And I select the "Lesson 30: Anonymous student survey" option in dropdown "assessment-selector"
    And I wait until element "div:contains(this survey is anonymous)" is visible
    And I wait until element "div:contains(no submissions for this assessment)" is not visible

    # Assessments/Surveys tab: assessment
    And I select the "Lesson 33: Single page assessment" option in dropdown "assessment-selector"
    And I wait until element "#uitest-submission-status-table" is visible
    And element "#uitest-submission-status-table tr:eq(1)" contains text "Sally"

  Scenario: Loading section projects
    Given I create a teacher-associated student named "Sally"
    And I am on "http://studio.code.org/projects/applab"

    # Make sure the initial save doesn't interfere with renaming the project
    And I wait for initial project save to complete

    # rename the project
    And I click selector ".project_edit" once I see it
    And I wait until element ".project_name.header_input" is visible
    And I type "thumb wars" into ".project_name.header_input"
    And I click selector ".project_save"

    And I wait until element ".project_edit" is visible
    Then element ".project_name.header_text" contains text "thumb wars"

    When I sign in as "Teacher_Sally" and go home
    And I wait until element "a:contains('Untitled Section')" is visible
    And I save the section id from row 0 of the section table
    Then I navigate to teacher dashboard for the section I saved
    And I click selector "#uitest-teacher-dashboard-nav a:contains(Projects)" once I see it
    And I wait until element "#uitest-projects-table" is visible
    And I click selector "a:contains('thumb wars')" once I see it to load a new tab
    And I wait until element ".project_name.header_text" is visible
    And element ".project_name.header_text" contains text "thumb wars"

  Scenario: Toggling student progress
    Given I create an authorized teacher-associated student named "Sally"
    And I complete the level on "http://studio.code.org/s/allthethings/lessons/2/levels/1"
    And I complete the free response on "http://studio.code.org/s/allthethings/lessons/27/levels/1"
    And I submit the assessment on "http://studio.code.org/s/allthethings/lessons/33/levels/1"

    # Progress tab
    When I sign in as "Teacher_Sally" and go home
    And I get levelbuilder access
    And I wait until element "a:contains('Untitled Section')" is visible
    And I save the section id from row 0 of the section table
    Then I navigate to teacher dashboard for the section I saved
    And I wait until element "#uitest-course-dropdown" is visible
    And I select the "All the Things! *" option in dropdown "uitest-course-dropdown"
    And I press the first ".uitest-summary-cell" element
    And I see ".uitest-detail-cell"

  @eyes
  Scenario: Eyes tests for section projects with thumbnails
    When I open my eyes to test "section projects with thumbnails"
    And I create a teacher-associated student named "Sally"

    # Create an applab project and generate a thumbnail

    When I am on "http://studio.code.org/projects/applab/new"
    And I wait for the page to fully load
    And I ensure droplet is in text mode
    And I append text to droplet "createCanvas('id', 320, 450);\nsetFillColor('red');\ncircle(160, 225, 160);"
    And I press "runButton"
    And I wait until element ".project_updated_at" contains text "Saved"
    And I wait until initial thumbnail capture is complete
    And I press "resetButton"
    And I click selector "#runButton" once I see it
    # Wait for the thumbnail URL to be sent to the server.
    And I wait until element ".project_updated_at" contains text "Saved"

    # Create a gamelab project and generate a thumbnail

    When I am on "http://studio.code.org/projects/gamelab/new"
    And I wait for the page to fully load
    And I ensure droplet is in text mode
    And I append text to droplet "\nfill('orange');\nellipse(200,200,400,400);"
    And I press "runButton"
    And I wait until element ".project_updated_at" contains text "Saved"
    And I wait until initial thumbnail capture is complete
    And I press "resetButton"
    And I click selector "#runButton" once I see it
    # Wait for the thumbnail URL to be sent to the server.
    And I wait until element ".project_updated_at" contains text "Saved"

    # Create an artist project and generate a thumbnail.
    #
    # Ensure the predraw layer is included in the thumbnail, and that a project
    # with that thumbnail appears in the projects list, by running and then
    # remixing a project-backed script level which has a predraw layer.
    #
    # We can't simply share the script level, because that doesn't make it
    # show up in the projects list. We can't just run the remixed project to
    # generate the thumbnail, because it will have lost the predraw layer.
    # Whether losing the predraw layer on remix is ok is a different issue, and
    # until it is resolved we want to make sure thumbnails include predraw.

    When I am on "http://studio.code.org/s/allthethings/lessons/3/levels/8"
    And I wait for the page to fully load
    And I press "runButton"
    And I wait until element ".project_updated_at" contains text "Saved"
    And I wait until initial thumbnail capture is complete
    And I press the first ".project_remix" element to load a new page
    And I wait for the page to fully load

    # Create a dance party project level and generate a thumbnail.

    # We don't want to have to write the code by dragging blocks, so just remix
    # an existing project-backed level, and then run the project.

    When I am on "http://studio.code.org/s/dance/lessons/1/levels/13"
    And I wait for the page to fully load
    And I wait for 3 seconds
    And I wait until I don't see selector "#p5_loading"
    And I click selector "#x-close" once I see it
    And I close the instructions overlay if it exists
    And I press the first ".project_remix" element to load a new page
    And I wait for the page to fully load
    And I press "runButton"
    And I wait until element ".project_updated_at" contains text "Saved"
    And I wait until initial thumbnail capture is complete
    And I press "resetButton"
    And I click selector "#runButton" once I see it
    # Wait for the thumbnail URL to be sent to the server.
    And I wait until element ".project_updated_at" contains text "Saved"

    # Load the section projects page

    When I sign in as "Teacher_Sally" and go home
    And I wait until element "a:contains('Untitled Section')" is visible
    And I save the section id from row 0 of the section table
    Then I navigate to teacher dashboard for the section I saved
    And I click selector "#uitest-teacher-dashboard-nav a:contains(Projects)" once I see it
    And I wait until element "#uitest-projects-table" is visible
    And I wait until the image within element "tr:eq(1)" has loaded
    And I wait until the image within element "tr:eq(2)" has loaded
    And I wait until the image within element "tr:eq(3)" has loaded
    And I wait until the image within element "tr:eq(4)" has loaded

    Then I see no difference for "projects list view"
    And I close my eyes

  Scenario: Attempt to join a section you own redirects to dashboard with error message
    Given I am a teacher
    And I create a new student section and go home
    And I attempt to join the section
    Then I wait until element "div.alert" is visible
    And element "div.alert" contains text matching "Sorry, you can't join your own section"

  Scenario: Attempt to join an invalid section through the homepage
    Given I am a teacher and go home
    And I wait until element "button.ui-test-join-section" is visible
    And I press keys "INVALID" for element "input.ui-test-join-section"
    And I click selector "button.ui-test-join-section"
    Then I wait until element ".announcement-notification" is visible
    And element ".announcement-notification" contains text matching "Section INVALID doesn't exist"

  Scenario: Attempt to join a section you own from teacher dashboard provides notification
    Given I am a teacher
    And I create a new student section and go home
    And I wait until element "button.ui-test-join-section" is visible
    And I enter the section code into "input.ui-test-join-section"
    And I click selector "button.ui-test-join-section"
    Then I wait until element ".announcement-notification" is visible
    And element ".announcement-notification" contains text matching "You are already an instructor for section"

  Scenario: Decline invitation to new progress view
    Given I create an authorized teacher-associated student named "Sally"
    Given I am assigned to unit "allthethings"
    And I complete the level on "http://studio.code.org/s/allthethings/lessons/2/levels/1"

    When I sign in as "Teacher_Sally" and go home
    And I get levelbuilder access
    And I wait until element "a:contains('Untitled Section')" is visible
    And I save the section id from row 0 of the section table
    Then I navigate to teacher dashboard for the section I saved
    Then I append "/?enableExperiments=section_progress_v2" to the URL
    Then I click selector "#ui-close-dialog"
    And I wait until element "#uitest-course-dropdown" is visible
    And I select the "All the Things! *" option in dropdown "uitest-course-dropdown"

  Scenario: Accept invitation to new progress view and see new view immediately. 
    Given I create an authorized teacher-associated student named "Sally"
    Given I am assigned to unit "allthethings"
    And I complete the level on "http://studio.code.org/s/allthethings/lessons/2/levels/1"

    When I sign in as "Teacher_Sally" and go home
    And I get levelbuilder access
    And I wait until element "a:contains('Untitled Section')" is visible
    And I save the section id from row 0 of the section table
    Then I navigate to teacher dashboard for the section I saved
    Then I append "/?enableExperiments=section_progress_v2" to the URL
    Then I click selector "#accept-invitation"
    And I wait until element "h6:contains(Icon Key)" is visible
    And I wait until element "#ui-test-progress-table-v2" is visible

  Scenario: Delay responding to invitation to new progress view and see old view immediately. 
    Given I create an authorized teacher-associated student named "Sally"
    Given I am assigned to unit "allthethings"
    And I complete the level on "http://studio.code.org/s/allthethings/lessons/2/levels/1"

    When I sign in as "Teacher_Sally" and go home
    And I get levelbuilder access
    And I wait until element "a:contains('Untitled Section')" is visible
    And I save the section id from row 0 of the section table
    Then I navigate to teacher dashboard for the section I saved
    Then I append "/?enableExperiments=section_progress_v2" to the URL
    Then I click selector "#remind-me-later-option"
    And I wait until element "#uitest-course-dropdown" is visible
    And I select the "All the Things! *" option in dropdown "uitest-course-dropdown"

  @eyes
  Scenario: Teacher can view more tiles when clicking on view more button
    When I open my eyes to test "teacher dashboard"
    Given I am a teacher and go home

    # Add new courses so new tiles are visible on the teacher dashboard
    And I create a new "Hour of Code" student section named "Section 1" assigned to "AI for Oceans"
    And I press keys ":escape"
    And I create a new "High School" student section named "Section 2" assigned to "Computer Science Principles" version "'17-'18"
    And I create a new "Hour of Code" student section named "Section 3" assigned to "Artist"
    And I create a new "Hour of Code" student section named "Section 4" assigned to "Classic Maze"
    And I create a new "Hour of Code" student section named "Section 5" assigned to "Flappy Code"
    And element ".ui-test-view-more-courses" is not visible
    And I see no difference for "5 course tiles"

    # Add one additional course so the View More button is visible
    And I create a new "Hour of Code" student section named "Section 6" assigned to "Disney Infinity Play Lab"
    And I see no difference for "view more button visible"

    And I click selector "button:contains(View more)"
    And I see no difference for "all tiles visible"
    And I close my eyes
    