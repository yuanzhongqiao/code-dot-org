import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';
import sinon from 'sinon';

import CloneLessonDialog from '@cdo/apps/lib/levelbuilder/unit-editor/CloneLessonDialog';

import {expect} from '../../../../util/reconfiguredChai';

describe('CloneLessonDialog', () => {
  let defaultProps, handleCloseSpy, fetchSpy;

  beforeEach(() => {
    handleCloseSpy = sinon.spy();
    fetchSpy = sinon.stub(window, 'fetch');
    defaultProps = {
      lessonId: 1,
      lessonName: 'lesson-1',
      handleClose: handleCloseSpy,
    };
  });

  afterEach(() => {
    fetchSpy.restore();
  });

  it('disables clone button while saving', () => {
    let returnData = {
      editLessonUrl: '/lessons/1/edit',
      editScriptUrl: '/s/test-script/edit',
    };

    fetchSpy
      .withArgs('/lessons/1/clone')
      .returns(Promise.resolve({ok: true, json: () => returnData}));

    const wrapper = shallow(<CloneLessonDialog {...defaultProps} />);
    wrapper.find('Button').at(1).simulate('click');
    expect(wrapper.find('Button').at(1).props().disabled).to.be.true;
  });

  it('can display success message on clone', () => {
    const wrapper = shallow(<CloneLessonDialog {...defaultProps} />);
    let returnData = {
      editLessonUrl: '/lessons/1/edit',
      editScriptUrl: '/s/test-script/edit',
    };
    fetchSpy
      .withArgs('/lessons/1/clone')
      .returns(Promise.resolve({ok: true, json: () => returnData}));
    return wrapper
      .instance()
      .onCloneClick()
      .then(() => {
        const successMessage = wrapper.find('span');
        expect(successMessage.text().includes('Clone succeeded!')).to.be.true;
        expect(
          successMessage
            .find('a')
            .map(a => a.props().href)
            .sort()
        ).to.eql(['/lessons/1/edit', '/s/test-script/edit'].sort());
      });
  });

  it('displays error message on failed clone', () => {
    const wrapper = shallow(<CloneLessonDialog {...defaultProps} />);
    let returnData = {
      error: 'Error message.',
    };
    fetchSpy
      .withArgs('/lessons/1/clone')
      .returns(Promise.resolve({ok: false, json: () => returnData}));
    return wrapper
      .instance()
      .onCloneClick()
      .then(() => {
        const errorMessage = wrapper.find('span');
        expect(errorMessage.text().includes('Error message.')).to.be.true;
      });
  });

  it('disables clone button initially', () => {
    const wrapper = shallow(<CloneLessonDialog {...defaultProps} />);
    const cloneButton = wrapper.find('Button[id="clone-lesson-button"]');
    expect(cloneButton.prop('disabled')).to.be.true;
  });

  it('enables clone button with unit name and level name suffix', () => {
    const wrapper = shallow(<CloneLessonDialog {...defaultProps} />);
    const unitNameInput = wrapper.find('input').first();
    unitNameInput.simulate('change', {target: {value: 'my-script'}});
    const suffixInput = wrapper.find('input').last();
    suffixInput.simulate('change', {target: {value: '2099'}});
    const cloneButton = wrapper.find('Button[id="clone-lesson-button"]');
    expect(cloneButton.prop('disabled')).to.be.false;
  });

  it('enables clone button with unit name and shallow copy', () => {
    const wrapper = shallow(<CloneLessonDialog {...defaultProps} />);
    const unitNameInput = wrapper.find('input').first();
    unitNameInput.simulate('change', {target: {value: 'my-script'}});
    const cloneTypeSelector = wrapper.find('select').first();
    cloneTypeSelector.simulate('change', {target: {value: 'shallowCopy'}});
    const cloneButton = wrapper.find('Button[id="clone-lesson-button"]');
    expect(cloneButton.prop('disabled')).to.be.false;
  });

  it('disables clone button without unit name', () => {
    const wrapper = shallow(<CloneLessonDialog {...defaultProps} />);
    const cloneTypeSelector = wrapper.find('select').first();
    cloneTypeSelector.simulate('change', {target: {value: 'shallowCopy'}});
    const cloneButton = wrapper.find('Button[id="clone-lesson-button"]');
    expect(cloneButton.prop('disabled')).to.be.true;
  });

  it('disables clone button without level name suffix', () => {
    const wrapper = shallow(<CloneLessonDialog {...defaultProps} />);
    const unitNameInput = wrapper.find('input').first();
    unitNameInput.simulate('change', {target: {value: 'my-script'}});
    const cloneButton = wrapper.find('Button[id="clone-lesson-button"]');
    expect(cloneButton.prop('disabled')).to.be.true;
  });

  it('sends level name suffix on deep copy', () => {
    const wrapper = shallow(<CloneLessonDialog {...defaultProps} />);
    const unitNameInput = wrapper.find('input').first();
    unitNameInput.simulate('change', {target: {value: 'my-script'}});
    const suffixInput = wrapper.find('input').last();
    suffixInput.simulate('change', {target: {value: '2099'}});

    let returnData = {
      editLessonUrl: '/lessons/1/edit',
      editScriptUrl: '/s/test-script/edit',
    };
    fetchSpy
      .withArgs('/lessons/1/clone')
      .returns(Promise.resolve({ok: false, json: () => returnData}));

    const cloneButton = wrapper.find('Button[id="clone-lesson-button"]');
    cloneButton.simulate('click');

    const params = JSON.parse(fetchSpy.getCalls()[0].args[1].body);
    expect(params.destinationUnitName).to.equal('my-script');
    expect(params.newLevelSuffix).to.equal('2099');
  });

  it('does not send level name suffix on shallow copy', () => {
    const wrapper = shallow(<CloneLessonDialog {...defaultProps} />);
    const unitNameInput = wrapper.find('input').first();
    unitNameInput.simulate('change', {target: {value: 'my-script'}});
    const suffixInput = wrapper.find('input').last();
    suffixInput.simulate('change', {target: {value: '2099'}});
    const cloneTypeSelector = wrapper.find('select').first();
    cloneTypeSelector.simulate('change', {target: {value: 'shallowCopy'}});

    let returnData = {
      editLessonUrl: '/lessons/1/edit',
      editScriptUrl: '/s/test-script/edit',
    };
    fetchSpy
      .withArgs('/lessons/1/clone')
      .returns(Promise.resolve({ok: false, json: () => returnData}));

    const cloneButton = wrapper.find('Button[id="clone-lesson-button"]');
    cloneButton.simulate('click');

    const params = JSON.parse(fetchSpy.getCalls()[0].args[1].body);
    expect(params.destinationUnitName).to.equal('my-script');
    expect(!!params.newLevelSuffix).to.be.false;
  });
});
