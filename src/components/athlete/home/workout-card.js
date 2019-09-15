import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Base64 from 'base64-mongo-id';
import { hasScores } from '../../../utils/APIHelper';

export default class WorkoutCard extends Component {
  constructor() {
    super();
    this.state = {
      scores: []
    }
  }

  async componentDidMount() {
    try {
      const results = await hasScores([this.props.workout._id]);
      this.setState({ scores: results.data.scores })
    } catch (error) {
      console.log(error);
    }
  }

  renderLabel() {
    const { workout } = this.props;
    if (workout.score_type === 1) {
      return (
        <div className="level-item br-4 background-light-purple p-sm">
          <p className="heading mb-0">For Time</p>
        </div>
      );
    } else if (workout.score_type === 2) {
      return (
        <div className="level-item br-4 background-light-red p-sm">
          <p className="heading mb-0">For Reps</p>
        </div>
      );
    } else if (workout.score_type === 3) {
      return (
        <div className="level-item br-4 background-light-blue p-sm">
          <p className="heading mb-0">For Load</p>
        </div>
      );
    } else if (workout.score_type === 4) {
      return (
        <div className="level-item br-4 background-light-yellow p-sm">
          <p className="heading mb-0">Completion</p>
        </div>
      );
    }
  }

  render() {
    console.log(this.state);
    const { workout } = this.props;
    return (
      <div className="column is-one-third">
        <div className="box">
          <div className="level is-mobile mb-0-5">
            <div className="level-left">
              <div className="level-item">
                <p className="is-size-5 has-text-weight-semibold">{workout.title}</p>
              </div>
            </div>
            <div className="level-right">
              {this.renderLabel()}
            </div>
          </div>
          <div className="heading mb-0-5 break-word">{workout.description}</div>
          <Link to={`/athlete/results/${Base64.toBase64(workout._id)}`}>
            <button className="button is-fullwidth mb-0-5">Results</button>
          </Link>
          {!this.state.scores.length > 0 ?
            <Link to={`/athlete/enterscore/${Base64.toBase64(workout._id)}`}>
              <button className="button is-fullwidth is-primary">Enter Score</button>
            </Link>
            :
            <Link to={`/athlete/score/${Base64.toBase64(this.state.scores[0]._id)}`}>
              <button className="button is-fullwidth is-primary">View Score</button>
            </Link>
          }
        </div>
      </div >
    )
  }
}