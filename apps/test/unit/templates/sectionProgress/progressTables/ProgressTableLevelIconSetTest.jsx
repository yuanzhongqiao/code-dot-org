import {mount} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';

import FontAwesome from '@cdo/apps/templates/FontAwesome';
import {
  bubbleContainerWidths,
  BubbleSize,
} from '@cdo/apps/templates/progress/BubbleFactory';
import {fakeLevels} from '@cdo/apps/templates/progress/progressTestHelpers';
import ProgressTableLevelIconSet from '@cdo/apps/templates/sectionProgress/progressTables/ProgressTableLevelIconSet';
import {unitTestExports} from '@cdo/apps/templates/sectionProgress/progressTables/ProgressTableLevelSpacer';

import {expect} from '../../../../util/reconfiguredChai';

const levelWithSublevels = {
  id: '123',
  levelNumber: 1,
  sublevels: [{id: '1'}, {id: '2'}],
  kind: 'assessment',
};
const otherLevels = fakeLevels(2);

const DEFAULT_PROPS = {
  levels: [levelWithSublevels, ...otherLevels],
};

describe('ProgressTableLevelIconSet', () => {
  it('renders icon for each level', () => {
    const wrapper = mount(<ProgressTableLevelIconSet {...DEFAULT_PROPS} />);
    expect(wrapper.find(FontAwesome)).to.have.length(3);
  });

  it('renders extra space for sublevels', () => {
    const wrapper = mount(<ProgressTableLevelIconSet {...DEFAULT_PROPS} />);
    const sublevelSpacer = wrapper.find(unitTestExports.SublevelSpacer);
    expect(sublevelSpacer.childAt(0).props().style.width).to.equal(
      2 * bubbleContainerWidths[BubbleSize.letter]
    );
  });
});
