import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Base64 from 'base64-mongo-id';
import Avatar from 'react-avatar';

import Protected from '../../protected';
import UserLayout from '../../nav/user-layout';
import CommentCard from './comment-card';
import { getSingleScore, postComment } from '../../../../utils/APIHelper';

class ScoreDetails extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      score: null,
      athlete: null,
      comment: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitComment = this.submitComment.bind(this);
  }

  async componentDidMount() {
    const { match } = this.props;
    const scoreId = Base64.toHex(match.params.id);
    try {
      const result = await getSingleScore(scoreId);
      if (result.data.ok) {
        this.setState({
          score: result.data.score,
          athlete: result.data.athlete
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({ loaded: true });
  }

  formatScores() {
    const { score } = this.state;
    if (score.score_type === 1) {
      return `${score.scores[0].minutes}:${score.scores[0].seconds}`
    } else if (score.score_type === 2) {
      return `${score.scores[0].reps} reps`
    } else if (score.score_type === 3) {

    } else if (score.score_type === 4) {

    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async submitComment() {
    const { comment, score } = this.state;
    if (!comment) return;
    try {
      const results = await postComment(score._id, comment);
      if (results.data.ok) {
        this.setState({ comment: '', score: results.data.score });
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { loaded, score, athlete } = this.state;
    if (!loaded) return null;
    if (loaded && (!score || !athlete)) return (<Redirect to="/athlete" />);
    return (
      <Protected>
        <UserLayout showBackArrow paddingBottom>
          <div className="columns is-mobile is-vcentered">
            <div className="column is-narrow">
              <figure className="image is-64x64 column is-narrow is-paddingless">
                {!this.state.failedToLoadImage ? (
                  <img
                    onClick={this.openGallery}
                    className="is-rounded height-100"
                    src={`https://dxpcsvc7gdlhw.cloudfront.net/${athlete.id}.jpg`}
                    onError={() => this.setState({ failedToLoadImage: true })}
                  />
                ) : (
                    <Avatar name={athlete.name} size="64" />
                  )}
              </figure>
            </div>
            <div className="column">
              <p className="heading">{athlete.name}</p>
              <p className="title">{score.rx_or_scaled === 'rx' ? 'RX' : 'Scaled'} | {this.formatScores()}</p>
            </div>
          </div>
          <p className="heading">Notes:</p>
          <span>{score.notes ? score.notes : 'No notes.'}</span>
          <div style={{ width: '100%', borderBottomWidth: 1, borderBottomColor: 'lightgrey', borderStyle: 'solid', color: '#fff' }}></div>
          <div>
            {score.comments.map((comment) => (
              <CommentCard athlete_id={comment._id} comment={comment.comment} athlete_name={comment.name} />
            ))}
          </div>
          <div className="field has-addons" style={{ position: 'absolute', bottom: '1rem', left: '5%', width: '90%' }}>
            <div className="control width-100">
              <input
                className="input is-rounded"
                type="text"
                name="comment"
                value={this.state.comment}
                onChange={this.handleChange}
                placeholder="Comment"
              />
            </div>
            <div className="control">
              <button className="button is-primary is-rounded" onClick={this.submitComment}>
                Send
              </button>
            </div>
          </div>
        </UserLayout>
      </Protected >
    )
  }
}

export default withRouter(ScoreDetails);
