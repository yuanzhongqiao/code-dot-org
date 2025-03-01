import React from 'react';
import reactBootstrapStoryDecorator from '../reactBootstrapStoryDecorator';
import {WorkshopsTable} from './EnrolledWorkshops';

const workshops = [
  // Have all required and non-required data
  {
    id: 1,
    sessions: [],
    location_name: 'My house',
    location_address: '123 Fake Street',
    on_map: false,
    funded: false,
    course: 'course',
    subject: 'subject',
    enrolled_teacher_count: 10,
    capacity: 15,
    facilitators: [],
    organizer: {name: 'organizer_name', email: 'organizer_email'},
    enrollment_code: 'code1',
  },
  // Non required data is null
  {
    id: 2,
    sessions: [],
    location_name: 'My house',
    location_address: null,
    on_map: false,
    funded: false,
    course: 'course',
    subject: null,
    enrolled_teacher_count: 10,
    capacity: 15,
    facilitators: [],
    organizer: {name: null, email: null},
    enrollment_code: null,
  },
];

export default {
  component: WorkshopsTable,
  decorators: [reactBootstrapStoryDecorator],
};

const Template = args => {
  return <WorkshopsTable {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  workshops: workshops,
};
