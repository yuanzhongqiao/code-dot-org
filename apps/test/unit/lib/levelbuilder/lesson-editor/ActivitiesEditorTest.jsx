import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';
import sinon from 'sinon';

import {UnconnectedActivitiesEditor as ActivitiesEditor} from '@cdo/apps/lib/levelbuilder/lesson-editor/ActivitiesEditor';

import {expect} from '../../../../util/reconfiguredChai';

import {sampleActivities} from './activitiesTestData';

describe('ActivitiesEditor', () => {
  let defaultProps, addActivity;
  beforeEach(() => {
    addActivity = sinon.spy();
    defaultProps = {
      activities: sampleActivities,
      hasLessonPlan: true,
      allowMajorCurriculumChanges: true,
      addActivity,
    };
  });

  it('renders default props', () => {
    const wrapper = shallow(<ActivitiesEditor {...defaultProps} />);
    expect(wrapper.find('button').length).to.equal(1);
    expect(wrapper.find('ActivityCardAndPreview').length).to.equal(1);

    const hiddenInputs = wrapper.find('input[type="hidden"]');
    expect(hiddenInputs.length, 'hidden input').to.equal(1);
  });

  it('renders without activity button if hasLessonPlan false', () => {
    const wrapper = shallow(
      <ActivitiesEditor {...defaultProps} hasLessonPlan={false} />
    );
    expect(wrapper.find('button').length).to.equal(0);
    expect(wrapper.find('ActivityCardAndPreview').length).to.equal(1);

    const hiddenInputs = wrapper.find('input[type="hidden"]');
    expect(hiddenInputs.length, 'hidden input').to.equal(1);
  });

  it('adds activity when activity button pressed', () => {
    const wrapper = shallow(<ActivitiesEditor {...defaultProps} />);
    expect(wrapper.find('button').length).to.equal(1);

    const button = wrapper.find('button').at(0);
    expect(button.text()).to.include('Activity');
    button.simulate('mouseDown');
    expect(addActivity).to.have.been.calledWith(
      1,
      'activity-2',
      'activitySection-1'
    );
  });
});
