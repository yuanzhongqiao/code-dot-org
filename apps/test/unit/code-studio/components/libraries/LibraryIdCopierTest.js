import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';

import LibraryIdCopier from '@cdo/apps/code-studio/components/libraries/LibraryIdCopier.jsx';

import {expect} from '../../../../util/reconfiguredChai';

describe('LibraryIdCopier', () => {
  const CHANNEL_ID_SELECTOR = 'input[type="text"]';
  const channelId = '123';
  it('displays the channel id', () => {
    let wrapper = shallow(
      <LibraryIdCopier libraryName="name" channelId={channelId} />
    );

    expect(wrapper.find(CHANNEL_ID_SELECTOR).props().value).to.equal(channelId);
  });
});
