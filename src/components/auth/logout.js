import React from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

export default class Logout extends React.Component {
  onLogoutRedirectUrl = '/login';

  constructor(props) {
    super(props);
    this.state = {
      logout: false,
    };
  }

  componentDidMount() {
    Cookies.set('token', '');
    this.setState({
      logout: true,
    });
  }

  render() {
    const { logout } = this.state;
    if (logout) {
      return <Redirect to={this.onLogoutRedirectUrl} />;
    }
    return null;
  }
}
