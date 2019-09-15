import React, { Component } from 'react';
import Avatar from 'react-avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import Protected from '../protected';
import UserLayout from '../nav/user-layout';
import { getAthlete } from '../../../utils/APIHelper';
export default class UserSettings extends Component {
  constructor() {
    super();
    this.state = {
      failedToLoadImage: false,
      user: null,
      loaded: false
    }
  }

  async componentDidMount() {
    try {
      const result = await getAthlete();
      this.setState({ user: result.data.user });
    } catch (error) {

    }
    this.setState({ loaded: true });
  }

  render() {
    const { user, loaded } = this.state;
    if (!loaded) return null;
    console.log(this.state.user);
    return (
      <Protected>
        <UserLayout page="settings">
          <div className="columns is-mobile is-centered">
            <figure className="image is-96x96 column is-narrow is-paddingless">
              {!this.state.failedToLoadImage ? (
                <img
                  onClick={this.openGallery}
                  className="is-rounded height-100"
                  src={`https://dxpcsvc7gdlhw.cloudfront.net/${user.id}.jpg`}
                  onError={() => this.setState({ failedToLoadImage: true })}
                />
              ) : (
                  <Avatar name={user.name} />
                )}
            </figure>
          </div>
          <div className="has-text-centered" style={{ marginTop: '1rem' }}>
            <span className="title">{user.name}</span>
          </div>
          <div className="box" style={{ marginTop: '3rem', paddingTop: 0, paddingBottom: 0 }}>
            <div style={{ padding: '1rem', borderBottom: 'solid 1px lightgrey' }}>
              <Link style={{ color: '#4a4a4a' }}>
                <FontAwesomeIcon icon="user" />
                <span style={{ marginLeft: '1rem' }}>Edit Account</span>
              </Link>
            </div>
            <div style={{ padding: '1rem', borderBottom: 'solid 1px lightgrey' }}>
              <Link style={{ color: '#4a4a4a' }}>
                <FontAwesomeIcon icon="dumbbell" />
                <span style={{ marginLeft: '1rem' }}>Change Gyms</span>
              </Link>
            </div>
            <div style={{ padding: '1rem', borderBottom: 'solid 1px lightgrey' }}>
              <Link style={{ color: '#4a4a4a' }}>
                <FontAwesomeIcon icon="lock" />
                <span style={{ marginLeft: '1rem' }}>Change Password</span>
              </Link>
            </div>
            <div style={{ padding: '1rem' }}>
              <Link to="/logout">
                <FontAwesomeIcon icon="sign-out-alt" />
                <span style={{ marginLeft: '1rem' }}>Logout</span>
              </Link>
            </div>
          </div>
        </UserLayout>
      </Protected>
    )
  }
};
