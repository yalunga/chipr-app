import React, { Component } from 'react';
import Avatar from 'react-avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class CompletionResultCard extends Component {
  constructor() {
    super();
    this.state = {
      failedToLoadImage: false
    }
  }

  render() {
    const { score } = this.props;
    const completed = score.score[0].completed;
    return (
      <div className="box" style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
        <div className="level is-mobile">
          <div className="level-left" style={{ flexShrink: 1, overflowX: 'hidden' }}>
            <div className="level-item" >
              <figure className="image is-48x48">
                {!this.state.failedToLoadImage ? (
                  <img
                    className="is-rounded height-100"
                    src={`https://dxpcsvc7gdlhw.cloudfront.net/${score.athlete_id}.jpg`}
                    onError={() => this.setState({ failedToLoadImage: true })}
                  />
                ) : (
                    <Avatar name={score.athlete_name} size="48" />
                  )}
              </figure>
            </div>
            <div className="level-item" style={{ display: 'inline-grid' }}>
              <span className="has-text-weight-semibold">{score.athlete_name}</span>
              <span className="has-text-weight-light is-size-7 has-text-grey">{score.notes}</span>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              {completed === 'yes' ? (
                <span className="has-text-weight-semibold has-text-primary">
                  <FontAwesomeIcon icon="check" />
                </span>
              ) : (
                  <span className="has-text-weight-semibold has-text-danger">
                    <FontAwesomeIcon icon="times" />
                  </span>
                )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}