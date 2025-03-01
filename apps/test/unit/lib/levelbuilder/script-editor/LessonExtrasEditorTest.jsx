import {expect} from 'chai';
import {mount} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';
import sinon from 'sinon';

import LessonExtrasEditor from '@cdo/apps/lib/levelbuilder/unit-editor/LessonExtrasEditor';

describe('LessonExtrasEditor', () => {
  let defaultProps,
    updateLessonExtrasAvailable,
    updateProjectWidgetVisible,
    updateProjectWidgetTypes;

  beforeEach(() => {
    updateLessonExtrasAvailable = sinon.spy();
    updateProjectWidgetVisible = sinon.spy();
    updateProjectWidgetTypes = sinon.spy();
    defaultProps = {
      projectWidgetVisible: false,
      projectWidgetTypes: [],
      lessonExtrasAvailable: false,
      updateLessonExtrasAvailable,
      updateProjectWidgetVisible,
      updateProjectWidgetTypes,
    };
  });
  it('project settings are not visible when lesson extras is not checked', () => {
    const wrapper = mount(<LessonExtrasEditor {...defaultProps} />);
    expect(wrapper.find('input')).to.have.length(1);
    expect(wrapper.find('select')).to.have.length(0);
  });

  it('project settings are visible when lesson extras is checked', () => {
    const wrapper = mount(
      <LessonExtrasEditor {...defaultProps} lessonExtrasAvailable={true} />
    );

    expect(wrapper.find('input')).to.have.length(2);
    expect(wrapper.find('select')).to.have.length(1);
  });
});
