import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { registerAthlete, registerGym } from '../../utils/APIHelper';

export default class Register extends React.Component {
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
    this.clearErrors = this.clearErrors.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const signUpData = new FormData(e.target);
    const name = signUpData.get('name');
    const email = signUpData.get('email');
    const password = signUpData.get('password');
    const confirmPassword = signUpData.get('confirmPassword');
    const gymName = signUpData.get('gymName');
    if (!name) {
      this.setState({
        error: 'name',
        errorMsg: 'Name is required.'
      })
      return;
    }
    if (!email) {
      this.setState({
        error: 'email',
        errorMsg: 'Email is required.'
      })
      return;
    }
    if (!password) {
      this.setState({
        error: 'Password',
        errorMsg: 'Password is required.'
      })
      return;
    }
    if (!confirmPassword) {
      this.setState({
        error: 'confirmPassword',
        errorMsg: 'Please confirm your password.'
      })
      return;
    }
    if (confirmPassword !== password) {
      this.setState({
        error: 'confirmPassword',
        errorMsg: 'Passwords do not match.'
      })
      return;
    }
    if (this.state.isGym && !gymName) {
      this.setState({
        error: 'gymName',
        errorMsg: 'Gym is required.'
      })
      return;
    }
    try {
      let result;
      if (this.state.isGym) {
        result = await registerGym(name, gymName, email, password)
      } else {
        result = await registerAthlete(name, email, password);
      }
      if (result.data) {
        localStorage.setItem('token', result.data.token);
        if (this.state.isGym) {
          localStorage.setItem('admin', true);
          this.onLoginRedirectUrl = '/admin/dashboard';
        } else {
          this.onLoginRedirectUrl = '/athlete';
          localStorage.setItem('admin', false);
        }
        this.setState({ loggedIn: true });
      }
    } catch (err) {
      this.setState({ errorMsg: err.response.data.message });
    }

  }

  handleSwitch(isGym) {
    this.setState({ isGym });
  }

  clearErrors() {
    if (this.state.error || this.state.errorMsg) {
      this.setState({
        error: '',
        errorMsg: ''
      })
    }
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
        <p className="title has-text-centered p-t-lg">Register</p>
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
                  <label className="label" htmlFor="name">
                    <div className="control has-icons-left">
                      <input
                        id="name"
                        name="name"
                        className={`input is-rounded is-medium ${error === 'name' ? 'is-danger' : ''}`}
                        type="text"
                        placeholder="Name"
                        onFocus={() => this.clearErrors()}
                      />
                      <span className="icon is-left">
                        <FontAwesomeIcon icon="user" />
                      </span>
                    </div>
                  </label>
                </div>
                {isGym && (
                  <div className="field">
                    <label className="label" htmlFor="gymName">
                      <div className="control has-icons-left">
                        <input
                          id="gymName"
                          name="gymName"
                          className={`input is-rounded is-medium ${error === 'gymName' ? 'is-danger' : ''}`}
                          type="text"
                          placeholder="Gym"
                          onFocus={() => this.clearErrors()}
                        />
                        <span className="icon is-left">
                          <FontAwesomeIcon icon="dumbbell" />
                        </span>
                      </div>
                    </label>
                  </div>
                )}
                <div className="field">
                  <label className="label" htmlFor="email">
                    <div className="control has-icons-left">
                      <input
                        id="email"
                        name="email"
                        className={`input is-rounded is-medium ${error === 'email' ? 'is-danger' : ''}`}
                        type="email"
                        placeholder="Email"
                        onFocus={() => this.clearErrors()}
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
                        onFocus={() => this.clearErrors()}
                      />
                      <span className="icon is-left">
                        <FontAwesomeIcon icon="lock" />
                      </span>
                    </div>
                  </label>
                </div>
                <div className="field">
                  <label className="label" htmlFor="confirmPassword">
                    <div className="control has-icons-left">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        className={`input is-rounded is-medium ${error === 'confirmPassword' ? 'is-danger' : ''}`}
                        type="password"
                        placeholder="Confirm Password"
                        onFocus={() => this.clearErrors()}
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
                      Sign Up
                    </button>
                  </div>
                </div>
                {
                  errorMsg !== '' && (
                    <p className="help is-danger">
                      {errorMsg}
                    </p>
                  )
                }
              </form>
            </div>
            <div className="has-text-centered mt1">
              <Link to="/login">
                <a>Already have an account?</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
