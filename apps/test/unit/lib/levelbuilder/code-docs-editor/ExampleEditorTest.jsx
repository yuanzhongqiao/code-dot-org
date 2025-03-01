import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';
import sinon from 'sinon';

import ExampleEditor from '@cdo/apps/lib/levelbuilder/code-docs-editor/ExampleEditor';

import {expect} from '../../../../util/reconfiguredChai';

describe('ExampleEditor', () => {
  let defaultProps, updateSpy;

  beforeEach(() => {
    updateSpy = sinon.spy();
    defaultProps = {
      example: {
        name: 'example 1',
        description: 'this is the first example',
        code: 'return foo;',
        app: 'studio.code.org/p/spritelab',
        app_display_type: 'withCode',
        embed_app_with_code_height: '100',
      },
      updateExample: updateSpy,
    };
  });

  it('displays input for name field', () => {
    const wrapper = shallow(<ExampleEditor {...defaultProps} />);
    const nameField = wrapper.find('input').at(0);
    expect(nameField.props().value).to.equal('example 1');
  });

  it('calls update when name is updated', () => {
    const wrapper = shallow(<ExampleEditor {...defaultProps} />);
    const nameField = wrapper.find('input').at(0);
    nameField.simulate('change', {target: {value: 'new name'}});
    expect(updateSpy).to.be.calledOnce.and.calledWith('name', 'new name');
  });

  it('displays markdown editor for description', () => {
    const wrapper = shallow(<ExampleEditor {...defaultProps} />);
    const descriptionEditor = wrapper.find('TextareaWithMarkdownPreview').at(0);
    expect(descriptionEditor.props().markdown).to.equal(
      'this is the first example'
    );
  });

  it('displays markdown editor for code', () => {
    const wrapper = shallow(<ExampleEditor {...defaultProps} />);
    const codeEditor = wrapper.find('TextareaWithMarkdownPreview').at(1);
    expect(codeEditor.props().markdown).to.equal('return foo;');
  });

  it('displays input for app link', () => {
    const wrapper = shallow(<ExampleEditor {...defaultProps} />);
    const appField = wrapper.find('input').at(1);
    expect(appField.props().value).to.equal('studio.code.org/p/spritelab');
  });

  it('calls update when app is updated', () => {
    const wrapper = shallow(<ExampleEditor {...defaultProps} />);
    const appField = wrapper.find('input').at(1);
    appField.simulate('change', {target: {value: 'studio.code.org/p/applab'}});
    expect(updateSpy).to.be.calledOnce.and.calledWith(
      'app',
      'studio.code.org/p/applab'
    );
  });

  it('displays ImageInput for image', () => {
    const wrapper = shallow(<ExampleEditor {...defaultProps} />);
    expect(wrapper.find('ImageInput').length).to.equal(1);
  });

  it('displays a select for display type', () => {
    const wrapper = shallow(<ExampleEditor {...defaultProps} />);
    const displayTypeSelect = wrapper.find('select').at(0);
    expect(displayTypeSelect.props().value).to.equal('withCode');
    expect(displayTypeSelect.find('option').length).to.equal(2);
  });

  it('calls update when display type is updated', () => {
    const wrapper = shallow(<ExampleEditor {...defaultProps} />);
    const displayTypeSelect = wrapper.find('select').at(0);
    displayTypeSelect.simulate('change', {target: {value: 'directly'}});
    expect(updateSpy).to.be.calledOnce.and.calledWith(
      'app_display_type',
      'directly'
    );
  });

  it('displays input for app embed height link', () => {
    const wrapper = shallow(<ExampleEditor {...defaultProps} />);
    const appEmbedHeightField = wrapper.find('input').at(2);
    expect(appEmbedHeightField.props().value).to.equal('100');
  });

  it('calls update when app embed height is updated', () => {
    const wrapper = shallow(<ExampleEditor {...defaultProps} />);
    const appEmbedHeightField = wrapper.find('input').at(2);
    appEmbedHeightField.simulate('change', {target: {value: '250'}});
    expect(updateSpy).to.be.calledOnce.and.calledWith(
      'embed_app_with_code_height',
      '250'
    );
  });
});
