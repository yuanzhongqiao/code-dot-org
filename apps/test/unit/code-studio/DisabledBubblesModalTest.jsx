import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';

import {disabledBubblesSupportArticle} from '@cdo/apps/code-studio/disabledBubbles';
import DisabledBubblesModal from '@cdo/apps/code-studio/DisabledBubblesModal';
import BaseDialog from '@cdo/apps/templates/BaseDialog';
import i18n from '@cdo/locale';

import {expect} from '../../util/reconfiguredChai';

describe('DisabledBubblesModal', () => {
  it('is open to begin with', () => {
    const wrapper = shallow(<DisabledBubblesModal />);
    expect(
      wrapper.containsMatchingElement(
        <BaseDialog isOpen={true} uncloseable={true}>
          <div>
            <div>{i18n.disabledProgress1()}</div>
            <div>{i18n.disabledProgress2()}</div>
            <div>{i18n.disabledProgress3()}</div>
            <div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={disabledBubblesSupportArticle}
              >
                {i18n.learnMore()}
              </a>
            </div>
            <div>
              <button type="button" onClick={wrapper.instance().handleClose}>
                {i18n.dialogOK()}
              </button>
            </div>
          </div>
        </BaseDialog>
      )
    ).to.be.true;
  });

  it('closes when the button is clicked', () => {
    const wrapper = shallow(<DisabledBubblesModal />);
    expect(wrapper.find(BaseDialog).prop('isOpen')).to.be.true;

    wrapper.find('button').simulate('click');
    expect(wrapper.find(BaseDialog).prop('isOpen')).to.be.false;
  });
});
