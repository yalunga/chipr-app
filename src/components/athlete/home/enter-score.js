import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Base64 from 'base64-mongo-id';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Protected from '../protected';
import UserLayout from '../nav/user-layout';
import { getWorkoutById, submitScore } from '../../../utils/APIHelper';

export default class EnterScore extends Component {
  constructor() {
    super()
    this.state = {
      loaded: false,
      workout: null,
      page: 0,
      rxOrScaled: null,
      score: [],
      notes: '',
      progressValue: 0
    }
    this.redirectUrl = '/athlete';
    this.setStateToValue = this.setStateToValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { match } = this.props;
    const workoutId = Base64.toHex(match.params.id);
    try {
      const result = await getWorkoutById(workoutId);
      if (result.data.ok) {
        this.setState({ workout: result.data.workout });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ loaded: true });
  }

  setStateToValue(e, value) {
    this.setState({ [e]: value });
  }

  handleChange(e) {
    const re = /^[0-9\b]+$/;
    if (!re.test(e.target.value) && e.target.value !== '') return;
    this.setState({ [e.target.name]: e.target.value })
  }

  async handleSubmit() {
    const { rxOrScaled, workout, notes } = this.state;
    const scores = [];
    if (workout.score_type === 1) {
      scores.push({
        minutes: this.state.minutes ? this.state.minutes : 0,
        seconds: this.state.seconds ? this.state.seconds : 0
      });
    } else if (workout.score_type === 2) {
      if (!this.state.reps) return;
      scores.push({
        reps: this.state.reps
      });
    } else if (workout.score_type === 3) {
      const { sets } = workout;
      for (let i = 1; i <= sets; i++) {
        if (!this.state[`set${i}`]) return;
        scores.push({
          [`set${i}`]: this.state[`set${i}`]
        })
      }
    } else if (workout.score_type === 4) {
      if (!this.state.completed) return;
      scores.push({
        completed: this.state.completed
      })
    }
    try {
      const result = await submitScore(
        workout._id,
        rxOrScaled,
        workout.score_type,
        workout.sets,
        notes,
        scores
      );
      if (result.data.ok) {
        this.redirectUrl = `/athlete/results/${this.props.match.params.id}`;
        this.setState({ workout: null });
      }
    } catch (error) {
      console.log(error);
    }
  }

  rxOrScaledPage() {
    const { rxOrScaled, page } = this.state;
    return (
      <div style={{ marginTop: '1rem' }}>
        <span className="heading p-0">Did you complete this workout rx or scaled?</span>
        <div className="box columns is-mobile p-0" style={{ marginTop: '1rem' }}>
          <div
            className={rxOrScaled === 'rx' ? "column has-text-centered has-background-light" : "column has-text-centered"}
            style={{ borderRight: '1px lightgray solid', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
            onClick={() => {
              this.setState({ rxOrScaled: 'rx', progressValue: 50 })
            }}
          >
            <span>RX</span>
          </div>
          <div
            className={rxOrScaled === 'scaled' ? "column has-text-centered has-background-light" : "column has-text-centered"}
            style={{ borderTopRightRadius: 6, borderBottomRightRadius: 6 }}
            onClick={() => {
              this.setState({ rxOrScaled: 'scaled', progressValue: 50 })
            }}
          >
            <span>Scaled</span>
          </div>
        </div>
        <button
          className="button is-primary is-fullwidth mt1 is-rounded is-medium"
          style={{ marginTop: '5rem' }}
          onClick={() => {
            if (rxOrScaled !== null) this.setState({ page: page + 1 })
          }}
        >
          <FontAwesomeIcon icon="arrow-right" />
        </button>
      </div>
    )
  }

  scorePage() {
    const { page, workout } = this.state;
    if (workout.score_type === 1) {
      return (
        <div style={{ marginTop: '1rem' }}>
          <span className="heading p-0">Score</span>
          <div className="columns is-mobile p-0 is-vcentered">
            <div className="column">
              <input
                className="input is-large"
                type="number"
                placeholder="Minutes"
                name="minutes"
                value={this.state.minutes}
                onChange={(e) => {
                  if (e.target.value < 0) return;
                  this.handleChange(e);
                }}
                min={0}
              />
            </div>
            <div className="column is-narrow">
              <span className="is-size-1">:</span>
            </div>
            <div className="column">
              <input
                className="input is-large"
                type="number"
                placeholder="Seconds"
                max={59}
                min={0}
                name="seconds"
                value={this.state.seconds}
                onChange={(e) => {
                  if (e.target.value < 0 || e.target.value > 59) return;
                  this.handleChange(e);
                }}
              />
            </div>
          </div>
          <button
            className="button is-primary is-fullwidth mt1 is-rounded is-medium"
            style={{ marginTop: '5rem' }}
            onClick={() => this.setState({ page: page + 1, progressValue: 100 })}
          >
            <FontAwesomeIcon icon="arrow-right" />
          </button>
        </div>
      )
    } else if (workout.score_type === 2) {
      return (
        <div style={{ marginTop: '1rem' }}>
          <span className="heading p-0">Score</span>
          <div className="columns is-mobile p-0">
            <div className="column">
              <input
                className="input is-large"
                type="number"
                placeholder="Reps"
                min={0}
                name="reps"
                value={this.state.reps}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <button
            className="button is-primary is-fullwidth mt1 is-rounded is-medium"
            style={{ marginTop: '5rem' }}
            onClick={() => this.setState({ page: page + 1, progressValue: 100 })}
          >
            <FontAwesomeIcon icon="arrow-right" />
          </button>
        </div>
      )
    } else if (workout.score_type === 3) {
      const scores = []
      for (let i = 0; i < workout.sets; i++) {
        scores.push({
          set: i + 1,
          score: null
        });
      }
      return (
        <div style={{ marginTop: '1rem' }}>
          {scores.map((obj) => (
            <div>
              <span className="heading p-0 mt-0-5">Set {obj.set}</span>
              <div className="field">
                <div className="control">
                  <input
                    className="input is-medium"
                    type="number"
                    placeholder="lbs"
                    min={0}
                    name={`set${obj.set}`}
                    value={this.state[`set${obj.set}`]}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            className="button is-primary is-fullwidth mt1 is-rounded is-medium"
            style={{ marginTop: '5rem' }}
            onClick={() => this.setState({ page: page + 1, progressValue: 100 })}
          >
            <FontAwesomeIcon icon="arrow-right" />
          </button>
        </div>
      );
    } else if (workout.score_type === 4) {
      const { completed } = this.state;
      return (
        <div style={{ marginTop: '1rem' }}>
          <span className="heading p-0">Did you complete this workout?</span>
          <div className="box columns is-mobile p-0" style={{ marginTop: '1rem' }}>
            <div
              className={completed === 'yes' ? "column has-text-centered has-background-light" : "column has-text-centered"}
              style={{ borderRight: '1px lightgray solid', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
              onClick={() => this.setStateToValue('completed', 'yes')}
            >
              <span>Yes</span>
            </div>
            <div
              className={completed === 'no' ? "column has-text-centered has-background-light" : "column has-text-centered"}
              style={{ borderTopRightRadius: 6, borderBottomRightRadius: 6 }}
              onClick={() => this.setStateToValue('completed', 'no')}
            >
              <span>No</span>
            </div>
          </div>
          <button
            className="button is-primary is-fullwidth mt1 is-rounded is-medium"
            style={{ marginTop: '5rem' }}
            onClick={() => this.setState({ page: page + 1, progressValue: 100 })}
          >
            <FontAwesomeIcon icon="arrow-right" />
          </button>
        </div >
      );
    }
  }

  notesPage() {
    return (
      <div style={{ marginTop: '1rem' }}>
        <span className="heading p-0">Additional Notes (Optional)</span>
        <div className="control">
          <textarea
            className="textarea has-fixed-size"
            placeholder="Notes"
            name="notes"
            value={this.state.notes}
            onChange={this.handleChange}
            maxLength="200"
          >
          </textarea>
        </div>
        <button
          className="button is-primary is-fullwidth mt1 is-rounded is-medium"
          style={{ marginTop: '5rem' }}
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </div>
    )
  }

  render() {
    const { loaded, workout, page } = this.state;
    if (!loaded) {
      return null;
    }
    if (loaded && !workout) {
      return (<Redirect to={this.redirectUrl} />)
    }
    return (
      <Protected>
        <UserLayout showBackArrow>
          <progress className="progress is-success" value={this.state.progressValue} max="100">15%</progress>
          <span className="has-text-weight-medium is-size-4">{workout.title}</span>
          <p className="break-word">{workout.description}</p>
          {page === 0 && (
            this.rxOrScaledPage()
          )}
          {page === 1 && (
            this.scorePage()
          )}
          {page === 2 && (
            this.notesPage()
          )}
          <button
            className="button is-fullwidth is-rounded is-medium mt1"
            onClick={() => {
              this.setState({ workout: null })
            }}
          >
            Cancel
          </button>
        </UserLayout>
      </Protected >
    )
  }
}