import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Base64 from 'base64-mongo-id';

import Protected from '../protected';
import UserLayout from '../nav/user-layout';
import { getWorkoutById, getScoresByWorkoutId } from '../../../utils/APIHelper';
import TimeResultCard from './result-cards/time-result-card';
import RepsResultCard from './result-cards/reps-result-card'
import LoadResultCard from './result-cards/load-result-card';
import CompletionResultCard from './result-cards/completion-result-card';

export default class Results extends Component {
  constructor() {
    super();
    this.state = {
      workout: null,
      scores: null,
      loaded: false
    }
    this.determineScoreType = this.determineScoreType.bind(this);
  }

  async componentDidMount() {
    const { match } = this.props;
    try {
      const workoutId = Base64.toHex(match.params.id);
      const result = await getWorkoutById(workoutId);
      if (result.data.ok) {
        const workout = result.data.workout;
        this.setState({ workout });
        const scoresResult = await getScoresByWorkoutId(workout._id, workout.score_type);
        if (scoresResult.data.ok) {
          this.setState({ scores: scoresResult.data.scores })
        }
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ loaded: true });
  }

  renderLabel() {
    const { workout } = this.state;
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

  determineScoreType(score) {
    const { workout } = this.state;
    if (workout.score_type === 1) return (
      <TimeResultCard score={score} />
    );
    if (workout.score_type === 2) return <RepsResultCard score={score} />;
    if (workout.score_type === 3) return <LoadResultCard score={score} />;
    if (workout.score_type === 4) return <CompletionResultCard score={score} />;
  }

  render() {
    const { loaded, scores, workout } = this.state;
    if (!loaded) return null;
    if (loaded && !scores) {
      return (<Redirect to="/athlete" />);
    }
    return (
      <Protected>
        <UserLayout showBackArrow>
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <span className="subtitle has-text-weight-semibold">{workout.title}</span>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                {this.renderLabel()}
              </div>
            </div>
          </div>
          <div>
            {scores.mensRx.length > 0 && (
              <div>
                <span className="heading">Men's RX</span>
                <div>
                  {scores.mensRx.map((score) => (
                    <Link to={`/athlete/score/${Base64.toBase64(score._id)}`}>
                      {this.determineScoreType(score)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {scores.mensScaled.length > 0 && (
              <div>
                <span className="heading">Men's Scaled</span>
                <div>
                  {scores.mensScaled.map((score) => (
                    <Link to={`/athlete/score/${Base64.toBase64(score._id)}`}>
                      {this.determineScoreType(score)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {scores.womensRx.length > 0 && (
              <div>
                <span className="heading">Women's RX</span>
                <div>
                  {scores.womensRx.map((score) => (
                    <Link to={`/athlete/score/${Base64.toBase64(score._id)}`}>
                      {this.determineScoreType(score)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {scores.womensScaled.length > 0 && (
              <div>
                <span className="heading">Women's Scaled</span>
                <div>
                  {scores.womensScaled.map((score) => (
                    <Link to={`/athlete/score/${Base64.toBase64(score._id)}`}>
                      {this.determineScoreType(score)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </UserLayout>
      </Protected>
    )
  }
}