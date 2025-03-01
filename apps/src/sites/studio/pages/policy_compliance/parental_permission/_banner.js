import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {getStore} from '@cdo/apps/redux';
import getScriptData from '@cdo/apps/util/getScriptData';
import ParentalPermissionBanner from '@cdo/apps/templates/policy_compliance/ParentalPermissionBanner';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={getStore()}>
      <ParentalPermissionBanner lockoutDate={getScriptData('lockoutDate')} />
    </Provider>,
    document.getElementById('parental-permission-banner-container')
  );
});
