import {mount} from 'enzyme'; // eslint-disable-line no-restricted-imports
import React from 'react';

import ParametersTable from '@cdo/apps/templates/codeDocs/ParametersTable';

import {expect} from '../../../util/reconfiguredChai';

describe('ParametersTable', () => {
  let defaultParameters;

  beforeEach(() => {
    defaultParameters = [
      {
        name: 'param1',
        type: 'string',
        required: true,
        description: 'description',
      },
      {name: 'param2'},
    ];
  });

  it('shows a table with the correct number of rows', () => {
    const wrapper = mount(
      <ParametersTable
        parameters={defaultParameters}
        programmingEnvironmentLanguage="droplet"
      />
    );
    expect(wrapper.find('table').length).to.equal(1);
    expect(wrapper.find('tbody').find('tr').length).to.equal(2);
  });

  it('shows the correct data for a complete parameter in a non java environment', () => {
    const wrapper = mount(
      <ParametersTable
        parameters={defaultParameters}
        programmingEnvironmentLanguage="droplet"
      />
    );
    const firstRow = wrapper.find('tbody').find('tr').at(0);
    expect(firstRow.find('td').length).to.equal(4);
    expect(firstRow.find('td').at(0).text()).to.equal('param1');
    expect(firstRow.find('td').at(1).text()).to.equal('string');
    expect(firstRow.find('td').at(2).find('.fa-check').length).to.equal(1);
    expect(
      firstRow.find('td').at(3).find('EnhancedSafeMarkdown').props().markdown
    ).to.equal('description');
  });

  it('shows the correct data for a complete parameter in a java environment', () => {
    const wrapper = mount(
      <ParametersTable
        parameters={defaultParameters}
        programmingEnvironmentLanguage="java"
      />
    );
    const firstRow = wrapper.find('tbody').find('tr').at(0);
    expect(firstRow.find('td').length).to.equal(4);
    expect(firstRow.find('td').at(0).text()).to.equal('param1');
    expect(firstRow.find('td').at(1).text()).to.equal('string');
    expect(firstRow.find('td').at(2).props().style.display).to.equal('none');
    expect(
      firstRow.find('td').at(3).find('EnhancedSafeMarkdown').props().markdown
    ).to.equal('description');
  });

  it('shows the correct data for a parameter with fields missing', () => {
    const wrapper = mount(<ParametersTable parameters={defaultParameters} />);
    const secondRow = wrapper.find('tbody').find('tr').at(1);
    expect(secondRow.find('td').length).to.equal(4);
    expect(secondRow.find('td').at(0).text()).to.equal('param2');
    expect(secondRow.find('td').at(1).text()).to.equal('');
    expect(secondRow.find('td').at(2).find('.fa-check').length).to.equal(0);
    expect(
      secondRow.find('td').at(3).find('EnhancedSafeMarkdown').length
    ).to.equal(0);
  });
});
