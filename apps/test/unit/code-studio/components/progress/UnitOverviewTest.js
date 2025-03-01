import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';

import {UnconnectedUnitOverview as UnitOverview} from '@cdo/apps/code-studio/components/progress/UnitOverview';
import {ViewType} from '@cdo/apps/code-studio/viewAsRedux';
import ProgressLegend from '@cdo/apps/templates/progress/ProgressLegend';
import ProgressTable from '@cdo/apps/templates/progress/ProgressTable';

import {assert} from '../../../../util/reconfiguredChai';

const defaultProps = {
  excludeCsfColumnInLegend: true,
  studentResources: [],
  isSignedIn: true,
  isVerifiedInstructor: true,
  hasVerifiedResources: true,
  perLevelResults: {},
  unitCompleted: false,
  unitData: {csf: false, isCsp: true, isCsd: false},
  scriptId: 123,
  scriptName: 'csp1',
  unitTitle: 'CSP 1',
  deeperLearningCourse: false,
  viewAs: ViewType.Instructor,
  isRtl: false,
  sectionsForDropdown: [],
  unitHasLockableLessons: false,
  unitAllowsHiddenLessons: false,
  publishedState: 'beta',
  versions: {},
  redirectScriptUrl: null,
  unitCalendarLessons: [],
  completedLessonNumber: undefined,
};

const setUp = (overrideProps = {}) => {
  const props = {...defaultProps, ...overrideProps};
  return shallow(<UnitOverview {...props} />);
};

describe('UnitOverview', () => {
  it('renders a EndOfLessonDialog if completedLessonNumber prop is present', () => {
    const wrapper = setUp({completedLessonNumber: '3'});
    assert.equal(wrapper.find('Connect(EndOfLessonDialog)').length, 1);
  });

  it('does not render a EndOfLessonDialog if completedLessonNumber is empty', () => {
    const wrapper = setUp();
    assert.equal(wrapper.find('Connect(EndOfLessonDialog)').length, 0);
  });

  it('renders a UnversionedScriptRedirectDialog if showUnversionedRedirectWarning and not displaying dialog', () => {
    const wrapper = setUp({showUnversionedRedirectWarning: true});
    assert.equal(wrapper.find('UnversionedScriptRedirectDialog').length, 1);
  });

  it('does not render a UnversionedScriptRedirectDialog if showUnversionedRedirectWarning is false', () => {
    const wrapper = setUp({showUnversionedRedirectWarning: false});
    assert.equal(wrapper.find('UnversionedScriptRedirectDialog').length, 0);
  });

  it('displays a course link if courseLink is present', () => {
    const wrapper = setUp({courseLink: '/some/link'});
    assert.equal(wrapper.find('.unit-breadcrumb').length, 1);
  });

  it('does not display a course link if courseLink is empty', () => {
    const wrapper = setUp({courseLink: null});
    assert.equal(wrapper.find('.unit-breadcrumb').length, 0);
  });

  it('renders a RedirectDialog if redirectScriptUrl is present', () => {
    const wrapper = setUp({redirectScriptUrl: '/some/link'});
    assert.equal(wrapper.find('RedirectDialog').length, 1);
  });

  it('does not render a RedirectDialog if redirectScriptUrl is empty', () => {
    const wrapper = setUp({redirectScriptUrl: null});
    assert.equal(wrapper.find('RedirectDialog').length, 0);
  });

  it('renders a UnitOverviewHeader', () => {
    const wrapper = setUp();
    assert.equal(wrapper.find('Connect(UnitOverviewHeader)').length, 1);
  });

  it('renders a UnitCalendar if viewAs is Instructor and showCalendar is true', () => {
    const wrapper = setUp({viewAs: ViewType.Instructor, showCalendar: true});
    assert.equal(wrapper.find('UnitCalendar').length, 1);
  });

  it('does not render a UnitCalendar if viewAs is not Instructor and showCalendar is true', () => {
    const wrapper = setUp({viewAs: ViewType.Participant, showCalendar: true});
    assert.equal(wrapper.find('UnitCalendar').length, 0);
  });

  it('does not render a UnitCalendar if viewAs is Instructor and showCalendar is false', () => {
    const wrapper = setUp({viewAs: ViewType.Instructor, showCalendar: false});
    assert.equal(wrapper.find('UnitCalendar').length, 0);
  });

  it('renders a UnitOverviewTopRow', () => {
    const wrapper = setUp();
    assert.equal(wrapper.find('Connect(UnitOverviewTopRow)').length, 1);
  });

  it('renders a ProgressTable', () => {
    const wrapper = setUp();
    assert.equal(wrapper.find(ProgressTable).length, 1);
  });

  it('renders a ProgressLegend', () => {
    const wrapper = setUp();
    assert.equal(wrapper.find(ProgressLegend).length, 1);
  });

  it('passes `includeReviewStates` to ProgressLegend when unit is CSP', () => {
    const wrapper = setUp({isCsdOrCsp: true});
    assert(wrapper.find(ProgressLegend).props().includeReviewStates);
  });
});
