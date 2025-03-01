import {mount} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';
import sinon from 'sinon';

import SoundLibrary from '@cdo/apps/code-studio/components/SoundLibrary';

import {expect} from '../../../util/reconfiguredChai';

describe('SoundListEntry', () => {
  it('stops playing sound when user chooses a sound', () => {
    const wrapper = mount(<SoundLibrary assetChosen={() => true} />);
    wrapper.setState({
      category: 'Animals',
      search: 'b',
      selectedSound: {},
    });
    let sounds = wrapper.instance().sounds;
    sinon.stub(sounds, 'stopAllAudio');
    wrapper.find('.primary').simulate('click');
    expect(sounds.stopAllAudio).to.have.been.calledOnce;
    sounds.stopAllAudio.restore();
    wrapper.unmount();
  });
});
