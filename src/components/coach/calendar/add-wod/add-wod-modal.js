import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DayPicker from '../../../date-picker';
import { addOrEditWorkout, deleteWorkout } from '../../../../utils/APIHelper';

export default class AddWodModal extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      scoreType: '0',
      description: '',
      date: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.clearModal = this.clearModal.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { selectedWorkout: prevWorkout } = prevProps;
    const { selectedWorkout } = this.props;
    if (selectedWorkout && prevWorkout !== selectedWorkout) {
      this.setState({
        title: selectedWorkout.title,
        scoreType: selectedWorkout.score_type,
        description: selectedWorkout.description,
        date: new Date(selectedWorkout.date)
      });
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  handleDateSelect(e) {
    this.setState({ date: e });
  }
  async handleSave() {
    const { title, scoreType, description, date } = this.state;
    const { selectedWorkout } = this.props;
    if (!title || scoreType === 0 || !description || !date) {
      return;
    }
    try {
      const id = selectedWorkout ? selectedWorkout._id : null;
      const { data } = await addOrEditWorkout(title, scoreType, description, date, id);
      if (data) {
        if (data.ok) {
          this.setState({
            title: '',
            scoreType: '0',
            description: '',
            date: ''
          });
          if (selectedWorkout) {
            this.props.editWorkout(data.workout);
          } else {
            this.props.addWorkout(data.workout);
          }
          this.props.closeModal();
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async handleDelete() {
    const { selectedWorkout } = this.props;
    if (selectedWorkout) {
      try {
        const { data } = await deleteWorkout(selectedWorkout._id);
        if (data.ok) {
          this.props.removeWorkout(selectedWorkout._id);
          this.props.closeModal();
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  clearModal() {
    this.setState({
      title: '',
      scoreType: '0',
      description: '',
      date: ''
    });
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Add Workout</p>
            <button className="delete" aria-label="close" onClick={() => {
              this.props.closeModal();
              this.clearModal();
            }}></button>
          </header>
          <section className="modal-card-body">
            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field has-addons">
                  <p className="control is-expanded has-icons-left">
                    <input
                      name="title"
                      className="input"
                      type="text"
                      placeholder="Title"
                      value={this.state.title}
                      onChange={this.handleChange}
                      maxLength={50}
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon="dumbbell" />
                    </span>
                  </p>
                </div>
                <div className="control">
                  <div className="select">
                    <select name="scoreType" value={this.state.scoreType} onChange={this.handleChange}>
                      <option disabled defaultValue value="0">Score Type</option>
                      <option value="1">Time</option>
                      <option value="2">Reps</option>
                      <option value="3">Load</option>
                      <option value="4">Completion</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  <div className="control height-100">
                    <textarea
                      name="description"
                      className="textarea has-fixed-size height-100"
                      placeholder="Description"
                      value={this.state.description}
                      onChange={this.handleChange}
                    >
                    </textarea>
                  </div>
                </div>
                <div className="field">
                  <DayPicker
                    selected={this.state.date}
                    onChange={this.handleDateSelect}
                    inline
                  />
                </div>
              </div>

            </div>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-primary" onClick={() => this.handleSave()}>Save</button>
            {this.props.selectedWorkout && (
              <button className="button is-danger" onClick={() => this.handleDelete()}>Delete</button>
            )}
            <button className="button" onClick={() => {
              this.props.closeModal();
              this.clearModal();
            }}>
              Cancel
              </button>
          </footer>
        </div>
      </div>
    );
  }
}