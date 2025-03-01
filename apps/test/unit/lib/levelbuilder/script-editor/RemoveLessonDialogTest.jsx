import {mount} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';
import sinon from 'sinon';

import {UnconnectedRemoveLessonDialog as RemoveLessonDialog} from '@cdo/apps/lib/levelbuilder/unit-editor/RemoveLessonDialog';

import {expect} from '../../../../util/reconfiguredChai';

describe('RemoveLessonDialog', () => {
  let handleClose, removeLesson, props;
  beforeEach(() => {
    handleClose = sinon.spy();
    removeLesson = sinon.spy();
    props = {
      lessonGroupPosition: 1,
      lessonPosToRemove: 2,
      lessonName: 'Lesson Name',
      handleClose,
      removeLesson,
    };
  });

  it('is initially closed', () => {
    props.lessonPosToRemove = null;
    const wrapper = mount(<RemoveLessonDialog {...props} />);
    expect(wrapper.find('.modal-body')).to.have.lengthOf(0);
  });
  it('is open when lesson is specified', () => {
    const wrapper = mount(<RemoveLessonDialog {...props} />);
    expect(wrapper.find('.modal-body')).to.have.lengthOf(1);
  });
  it('removes lesson on confirm', () => {
    const wrapper = mount(<RemoveLessonDialog {...props} />);
    expect(wrapper.find('.modal-body')).to.have.lengthOf(1);

    const body = wrapper.find('.modal-body');
    const deleteButton = body.find('button').at(2);
    expect(deleteButton.text()).to.include('Delete');
    deleteButton.simulate('click');
    expect(removeLesson).to.have.been.calledWith(1, 2);
    expect(handleClose).to.have.been.calledOnce;
  });
  it('does not remove lesson on cancel', () => {
    const wrapper = mount(<RemoveLessonDialog {...props} />);
    expect(wrapper.find('.modal-body')).to.have.lengthOf(1);

    const body = wrapper.find('.modal-body');
    const cancelButton = body.find('button').at(1);
    expect(cancelButton.text()).to.include('Cancel');
    cancelButton.simulate('click');
    expect(removeLesson).not.to.have.been.called;
    expect(handleClose).to.have.been.calledOnce;
  });
});
