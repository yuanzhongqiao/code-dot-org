import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';

import {UnconnectedShareDialog as ShareDialog} from '@cdo/apps/code-studio/components/ShareDialog';
import {SignInState} from '@cdo/apps/templates/currentUserRedux';

import {assert} from '../../../util/reconfiguredChai';

describe('ShareDialog', () => {
  it('renders our signed in version when signed in', () => {
    const wrapper = shallow(
      <ShareDialog
        signInState={SignInState.SignedIn}
        isProjectLevel={false}
        appType={'applab'}
      />
    );
    const dialog = wrapper.find('Connect(ShareAllowedDialog)');
    assert.equal(dialog.length, 1);
    // Make sure props get passed through
    assert.equal(wrapper.props().appType, 'applab');
  });

  it('renders our signed in version when signed out on project page', () => {
    const wrapper = shallow(
      <ShareDialog
        signInState={SignInState.SignedOut}
        isProjectLevel={true}
        appType={'applab'}
      />
    );
    const dialog = wrapper.find('Connect(ShareAllowedDialog)');
    assert.equal(dialog.length, 1);
    // Make sure props get passed through
    assert.equal(wrapper.props().appType, 'applab');
  });

  it('renders our signed out version when signed out', () => {
    const wrapper = shallow(
      <ShareDialog
        signInState={SignInState.SignedOut}
        isProjectLevel={false}
        appType={'applab'}
      />
    );
    const dialog = wrapper.find('Connect(ShareDisallowedDialog)');
    assert.equal(dialog.length, 1);
  });
});
