import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';

import {ProjectNotFoundAlert} from '@cdo/apps/code-studio/initApp/renderProjectNotFound';

import {expect} from '../../../util/reconfiguredChai';

describe('ProjectNotFoundAlert', () => {
  it('renders AlertExclamation with message', () => {
    const wrapper = shallow(<ProjectNotFoundAlert />);
    expect(wrapper.find('AlertExclamation').length).to.equal(1);
    expect(wrapper.find('a').text()).to.include('Go to Code Studio');
  });
});
