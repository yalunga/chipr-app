import React, { Component } from 'react';

export default class DayEvent extends Component {
  render() {
    const workout = this.props.event.resource;
    return (
      <div className="p-sm">
        <h3 className="is-size-5 has-text-weight-semibold">{workout.title}</h3>
        <div className="break-word">{workout.description}</div>
      </div>
    );
  }
}
