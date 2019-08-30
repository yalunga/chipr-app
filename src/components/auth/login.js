import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { login } from '../../utils/APIHelper';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false,
      error: '',
      errorMsg: '',
      isGym: false
    };
    this.handleSwitch = this.handleSwitch.bind(this);
    this.onLoginRedirectUrl = '/admin/dashboard';
  }

  componentDidMount() {
    const isLoggedIn = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('admin');
    if (isAdmin) {
      this.onLoginRedirectUrl = '/admin/dashboard';
    }
    if (isLoggedIn) {
      this.setState({
        loaded: true,
        loggedIn: true,
      });
    } else {
      this.setState({
        loaded: true,
      });
    }
  }

  async handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const loginData = new FormData(e.target);
    const email = loginData.get('email');
    const password = loginData.get('password');
    try {
      const result = await login(email, password, this.state.isGym);
      if (result.data) {
        localStorage.setItem('token', result.data.token);
        if (this.state.isGym) {
          localStorage.setItem('admin', true);
          this.onLoginRedirectUrl = '/admin/dashboard';
        } else {
          localStorage.setItem('admin', false);
          this.onLoginRedirectUrl = '/athlete';
        }
        this.setState({ loggedIn: true });
      }
    } catch (err) {
      console.log(err.response);
    }

  }

  handleSwitch(isGym) {
    this.setState({ isGym });
  }

  render() {
    const {
      loggedIn,
      error,
      errorMsg,
      loaded,
      isGym
    } = this.state;
    if (!loaded) return null;
    if (loggedIn) {
      return <Redirect push={false} to={this.onLoginRedirectUrl} />;
    }
    return (
      <div className="auth-container">
        <div className="has-text-centered logo">
          <img alt="Chipr" src='' width='150' />
        </div>
        <div className="columns is-centered p-t-xl p-r-md p-l-md">
          <div className="column is-one-quarter">
            <div>
              <nav className="bd-tabs">
                <div className="tabs is-centered">
                  <ul>
                    <li className={!isGym ? "is-active" : ""}>
                      <a className="has-text-weight-bold is-size-5" onClick={() => this.handleSwitch(false)}>
                        Athlete
                      </a>
                    </li>
                    <li className={isGym ? "is-active" : ""}>
                      <a className="has-text-weight-bold is-size-5" onClick={() => this.handleSwitch(true)}>
                        Gym
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
              <form onSubmit={e => this.handleSubmit(e)}>
                <div className="field">
                  <label className="label" htmlFor="email">
                    <div className="control has-icons-left">
                      <input
                        id="email"
                        name="email"
                        className={`input is-rounded is-medium ${error === 'email' ? 'is-danger' : ''}`}
                        type="email"
                        placeholder="Email"
                      />
                      <span className="icon is-left">
                        <FontAwesomeIcon icon="envelope" />
                      </span>
                    </div>
                  </label>
                </div>
                <div className="field">
                  <label className="label" htmlFor="password">
                    <div className="control has-icons-left">
                      <input
                        id="password"
                        name="password"
                        className={`input is-rounded is-medium ${error === 'password' ? 'is-danger' : ''}`}
                        type="password"
                        placeholder="Password"
                      />
                      <span className="icon is-left">
                        <FontAwesomeIcon icon="lock" />
                      </span>
                    </div>
                  </label>
                </div>
                <div className="field is-grouped">
                  <div className="control width-100">
                    <button type="submit" className="button is-primary is-fullwidth is-rounded is-medium">
                      Login
                    </button>
                  </div>
                </div>
                {
                  error !== '' && (
                    <p className="help is-danger">
                      {errorMsg}
                    </p>
                  )
                }
              </form>
            </div>
            <div className="has-text-centered mt1">
              <Link to="/signup">
                <span>Don't have an account?</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
