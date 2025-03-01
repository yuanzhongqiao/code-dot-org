import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';

import EmbeddedBlock from '@cdo/apps/templates/codeDocs/EmbeddedBlock';

import {expect} from '../../../util/reconfiguredChai';

describe('EmbeddedBlock', () => {
  it('renders div for block wrapped with link', () => {
    const wrapper = shallow(
      <EmbeddedBlock link="/docs/spritelab/code" blockName="code_block" />
    );
    expect(wrapper.find('Link').length).to.equal(1);
    const link = wrapper.find('Link').first();
    expect(link.props().href).to.equal('/docs/spritelab/code');
    expect(link.find('#embedded-block-code_block').length).to.equal(1);
  });
});
