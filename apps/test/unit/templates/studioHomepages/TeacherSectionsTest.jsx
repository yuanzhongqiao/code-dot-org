import {shallow} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';

import {UnconnectedTeacherSections as TeacherSections} from '@cdo/apps/templates/studioHomepages/TeacherSections';

import {expect} from '../../../util/reconfiguredChai';

describe('TeacherSections', () => {
  const defaultProps = {
    asyncLoadSectionData: () => {},
    asyncLoadCoteacherInvite: () => {},
    studentSectionIds: [],
    coteacherInvite: null,
    coteacherInviteForPl: null,
    plSectionIds: [],
    hiddenPlSectionIds: [],
    hiddenStudentSectionIds: [],
    asyncLoadComplete: true,
  };

  it('renders spinner if still loading', () => {
    const wrapper = shallow(
      <TeacherSections
        {...defaultProps}
        plSectionIds={null}
        studentSectionIds={null}
        asyncLoadComplete={false}
      />
    );
    expect(wrapper.find('Connect(ContentContainer)').length).to.equal(1);
    expect(wrapper.find('Spinner').length).to.equal(1);
    expect(wrapper.find('Connect(OwnedSections)').length).to.equal(0);
  });

  it('renders create section area if done loading', () => {
    const wrapper = shallow(<TeacherSections {...defaultProps} />);
    expect(wrapper.find('Connect(ContentContainer)').length).to.equal(1);
    expect(wrapper.find('Connect(SetUpSections)').length).to.equal(1);
    expect(wrapper.find('Connect(OwnedSections)').length).to.equal(0);
  });

  it('does not render sections tables if there are no section ids and no coteacher invite', () => {
    const wrapper = shallow(<TeacherSections {...defaultProps} />);
    expect(wrapper.find('Connect(ContentContainer)').length).to.equal(1);
    expect(wrapper.find('Connect(OwnedSections)').length).to.equal(0);
  });

  it('renders student sections area if coteacher invite', () => {
    const wrapper = shallow(
      <TeacherSections {...defaultProps} coteacherInvite={{id: 1}} />
    );
    expect(wrapper.find('Connect(ContentContainer)').length).to.equal(2);
    expect(wrapper.find('Connect(OwnedSections)').length).to.equal(1);
    expect(
      wrapper.find('Connect(OwnedSections)').props().isPlSections
    ).to.equal(undefined);
  });

  it('renders student sections area if there are student sections', () => {
    const wrapper = shallow(
      <TeacherSections {...defaultProps} studentSectionIds={[1]} />
    );
    expect(wrapper.find('Connect(ContentContainer)').length).to.equal(2);
    expect(wrapper.find('Connect(OwnedSections)').length).to.equal(1);
    expect(
      wrapper.find('Connect(OwnedSections)').props().isPlSections
    ).to.equal(undefined);
  });

  it('renders student sections area if there are student sections and coteacher invite', () => {
    const wrapper = shallow(
      <TeacherSections
        {...defaultProps}
        studentSectionIds={[1]}
        coteacherInvite={{id: 1}}
      />
    );
    expect(wrapper.find('Connect(ContentContainer)').length).to.equal(2);
    expect(wrapper.find('Connect(OwnedSections)').length).to.equal(1);
    expect(
      wrapper.find('Connect(OwnedSections)').props().isPlSections
    ).to.equal(undefined);
  });
});
