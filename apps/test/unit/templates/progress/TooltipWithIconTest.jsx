import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';

import TooltipWithIcon from '@cdo/apps/templates/progress/TooltipWithIcon';

import {expect} from '../../../util/reconfiguredChai';

const DEFAULT_PROPS = {
  tooltipId: 'id',
  icon: 'desktop',
  text: 'Level Name',
  includeAssessmentIcon: false,
};

describe('TooltipWithIcon', () => {
  it('includes the check-circle icon if level is an assessment', () => {
    const wrapper = shallow(
      <TooltipWithIcon {...DEFAULT_PROPS} includeAssessmentIcon={true} />
    );
    expect(wrapper.find('FontAwesome').first().props().icon).to.equal(
      'check-circle'
    );
  });

  it('does not include the check-circle icon if level is not an assessment', () => {
    const wrapper = shallow(<TooltipWithIcon {...DEFAULT_PROPS} />);
    expect(wrapper.find('FontAwesome').first().props().icon).not.to.equal(
      'check-circle'
    );
  });
});
