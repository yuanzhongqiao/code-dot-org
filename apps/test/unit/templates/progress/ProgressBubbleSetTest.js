import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';

import {UnconnectedProgressBubbleSet as ProgressBubbleSet} from '@cdo/apps/templates/progress/ProgressBubbleSet';
import {fakeLevels} from '@cdo/apps/templates/progress/progressTestHelpers';

import {assert} from '../../../util/reconfiguredChai';

const defaultProps = {
  levels: fakeLevels(5),
  disabled: false,
  lessonExtrasEnabled: true,
};

describe('ProgressBubbleSet', () => {
  it('we have a bubble for each level', () => {
    const wrapper = shallow(<ProgressBubbleSet {...defaultProps} />);
    assert.equal(
      wrapper.find('ProgressBubble').length,
      defaultProps.levels.length
    );
  });

  it('renders a disabled ProgressBubble if this.props.disabled is true', () => {
    const additionalProps = {
      levels: fakeLevels(1),
      disabled: true,
    };
    const wrapper = shallow(
      <ProgressBubbleSet {...defaultProps} {...additionalProps} />
    );
    assert.equal(wrapper.find('ProgressBubble').length, 1);
    const progressBubble = wrapper.find('ProgressBubble').at(0);
    assert.equal(progressBubble.prop('disabled'), true);
  });

  it('renders an enabled ProgressBubble if this.props.lessonExtrasEnabled is true and level is bonus', () => {
    let bonusLevel = fakeLevels(1)[0];
    bonusLevel.bonus = true;
    const wrapper = shallow(
      <ProgressBubbleSet {...defaultProps} levels={[bonusLevel]} />
    );
    assert.equal(wrapper.find('ProgressBubble').length, 1);
    const progressBubble = wrapper.find('ProgressBubble').at(0);
    assert.equal(progressBubble.prop('disabled'), false);
  });
});
