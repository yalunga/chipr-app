import React, { Component } from 'react';
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";

export default class DayPicker extends Component {
  render() {
    return (
      <div className="customDatePickerWidth">
        <DatePicker
          {...this.props}
        />
      </div>
    );
  }
}