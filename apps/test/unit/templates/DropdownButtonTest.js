import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';
import sinon from 'sinon';

import Button from '@cdo/apps/templates/Button';
import {DropdownButton} from '@cdo/apps/templates/DropdownButton';

import {assert} from '../../util/reconfiguredChai';

const clickSpy = sinon.spy();

const defaultProps = {
  text: 'Click me',
  color: Button.ButtonColor.brandSecondaryDefault,
  children: [<a href="foo">href</a>, <a onClick={clickSpy}>onclick</a>],
};

describe('DropdownButton', () => {
  beforeEach(() => clickSpy.resetHistory());

  it('is initially just a button', () => {
    const wrapper = shallow(<DropdownButton {...defaultProps} />);
    assert.strictEqual(wrapper.children().length, 1);
    assert.strictEqual(wrapper.childAt(0).name(), 'Button');
  });

  it('shows children when clicked', () => {
    const wrapper = shallow(<DropdownButton {...defaultProps} />);
    wrapper.find('Button').simulate('click');
    assert.strictEqual(wrapper.find('a').length, 2);
  });

  it('passes through href', () => {
    const wrapper = shallow(<DropdownButton {...defaultProps} />);
    wrapper.find('Button').simulate('click');
    assert.strictEqual(wrapper.find('a').at(0).props().href, 'foo');
  });

  it('passes through onClick and closes dropdown', () => {
    const wrapper = shallow(<DropdownButton {...defaultProps} />);
    wrapper.find('Button').simulate('click');
    assert(wrapper.find('a').at(1).props().onClick);
    wrapper.find('a').at(1).simulate('click');
    assert(clickSpy.calledOnce);

    // dropdown is closed
    assert.equal(wrapper.find('a').length, 0);
  });
});
