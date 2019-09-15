import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

export default class Protected extends React.Component {
  redirectUrl = '/login';

  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      allow: false,
    };
  }

  componentDidMount() {
    const isLoggedIn = Cookies.get('token');
    const isAdmin = Cookies.get('admin');
    if (!isLoggedIn || !isAdmin) {
      this.setState({
        initialized: true,
        allow: false,
      });
    } else {
      this.setState({
        initialized: true,
        allow: true,
      });
    }
  }

  render() {
    const { initialized, allow } = this.state;
    // eslint-disable-next-line
    const { children } = this.props;
    if (!initialized) {
      return null;
    }
    if (allow) {
      return children;
    }
    return (
      <Route render={({ staticContext }) => {
        // eslint-disable-next-line
        if (staticContext) staticContext.status = 403;
        return <Redirect to={this.redirectUrl} />;
      }}
      />
    );
  }
}
