import React, { Component } from 'react';
import Avatar from 'react-avatar';

export default class CommentCard extends Component {
  constructor() {
    super();
    this.state = {
      failedToLoadImage: false
    }
  }
  render() {
    const { athlete_name, athlete_id, comment } = this.props
    return (
      <div className="box" style={{ marginTop: '1rem', padding: '0.5rem', marginBottom: 0 }}>
        <div className="columns is-mobile">
          <div className="column is-narrow">
            <figure className="image is-48x48">
              {!this.state.failedToLoadImage ? (
                <img
                  className="is-rounded height-100"
                  src={`https://dxpcsvc7gdlhw.cloudfront.net/${athlete_id}.jpg`}
                  onError={() => this.setState({ failedToLoadImage: true })}
                />
              ) : (
                  <Avatar name={athlete_name} size="48" />
                )}
            </figure>
          </div>
          <div className="column" style={{ overflowX: 'auto' }}>
            <p className="heading">{athlete_name}</p>
            <p style={{ overflowWrap: 'break-word' }}>{comment}</p>
          </div>
        </div>
      </div>
    );
  }
}