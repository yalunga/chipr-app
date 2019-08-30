import React, { Component } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Protected from '../protected';
import UserLayout from '../user-layout';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AddWodModal from './add-wod/add-wod-modal';
import { getWorkouts } from '../../../utils/APIHelper';
import DayEvent from './day-event';

const localizer = momentLocalizer(moment);
const components = {
  day: {
    event: DayEvent
  }
}

export default class Calendar extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      workouts: [],
      selectedWorkout: null,
      view: 'month'
    }
    this.closeModal = this.closeModal.bind(this);
    this.addWorkout = this.addWorkout.bind(this);
    this.editWorkout = this.editWorkout.bind(this);
    this.removeWorkout = this.removeWorkout.bind(this);
    this.handleSelectEvent = this.handleSelectEvent.bind(this);
    this.eventStyles = this.eventStyles.bind(this);
    this.onView = this.onView.bind(this);
  }
  async componentDidMount() {
    try {
      const result = await getWorkouts();
      const data = result.data;
      if (data.ok) {
        const workouts = [];
        data.workouts.forEach(workout => {
          workouts.push({
            title: workout.title,
            start: workout.date,
            end: workout.date,
            allDay: true,
            resource: workout
          });
        });
        this.setState({ workouts });
      }
    } catch (err) {
      console.log(err);
    }
  }

  closeModal() {
    this.setState({ showModal: false, selectedWorkout: null });
  }

  addWorkout(workout) {
    const workouts = this.state.workouts;
    workouts.push({
      title: workout.title,
      start: workout.date,
      end: workout.date,
      allDay: true,
      resource: workout
    });
    this.setState({ workouts });
  }

  editWorkout(editedWorkout) {
    const workouts = this.state.workouts;
    workouts.forEach((workout) => {
      if (workout.resource._id === editedWorkout._id) {
        workout.title = editedWorkout.title;
        workout.start = editedWorkout.date;
        workout.end = editedWorkout.date;
        workout.resource = editedWorkout;
      }
    });
  }

  removeWorkout(id) {
    const workouts = this.state.workouts;
    for (let i = 0; i < workouts.length; i++) {
      if (workouts[i].resource._id === id) {
        workouts.splice(i, 1);
      }
    }
    this.setState({ workouts });
  }

  handleSelectEvent(e) {
    const workout = e.resource;
    this.setState({ showModal: true, selectedWorkout: workout });
  }

  eventStyles(e) {
    const workout = e.resource;
    let style = {};
    if (workout.score_type === 1) {
      style = {
        backgroundColor: '#EEEEFE',
        color: 'black',
        borderColor: '#968AFE'
      };
    } else if (workout.score_type === 2) {
      style = {
        backgroundColor: '#FFF2F2',
        color: 'black',
        borderColor: '#F17777'
      }
    } else if (workout.score_type === 3) {
      style = {
        backgroundColor: '#E5F8F8',
        color: 'black',
        borderColor: '#2CC8D7'
      }
    } else if (workout.score_type === 4) {
      style = {
        backgroundColor: '#FCF0E4',
        color: 'black',
        borderColor: '#F49F42'
      }
    }
    return {
      className: (this.state.view === 'day') ? 'event day-event' : 'event',
      style
    }
  }

  onView(view) {
    this.setState({ view });
  }

  render() {
    return (
      <Protected>
        <UserLayout page='wods'>
          <div className="height-80vh">
            <BigCalendar
              components={components}
              localizer={localizer}
              events={this.state.workouts}
              onSelectEvent={this.handleSelectEvent}
              startAccessor="start"
              endAccessor="end"
              views={['month', 'day', 'week']}
              popup
              eventPropGetter={this.eventStyles}
              step={60 * 240}
              onView={this.onView}
            />
            <a className="button is-pulled-right is-primary m-t-n circle raised is-large" onClick={() => this.setState({ showModal: true })}>
              <span className="icon">
                <FontAwesomeIcon icon="plus" />
              </span>
            </a>
          </div>
          <AddWodModal
            showModal={this.state.showModal}
            closeModal={this.closeModal}
            addWorkout={this.addWorkout}
            editWorkout={this.editWorkout}
            removeWorkout={this.removeWorkout}
            selectedWorkout={this.state.selectedWorkout}
          />
        </UserLayout>
      </Protected>
    );
  }
}