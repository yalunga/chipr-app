import React from 'react';
import { Link } from 'react-router-dom';
import MobileNav from './nav/mobile-nav';

export default class GuestLayout extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      showMenu: false
    };
  }
  render() {
    // eslint-disable-next-line
    const { children, page } = this.props;
    return (
      <div className="background-light-grey min-height-100vh">
        <nav className="navbar box is-paddingless" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" onClick={() => this.setState({ showMenu: true })}>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
            <p className="navbar-item has-text-centered">
              Chipr
            </p>
          </div>
          {this.state.showMenu && (
            <MobileNav hideNav={() => this.setState({ showMenu: false })} page={page} />
          )}
        </nav>
        <div className="columns height-90vh width-100">
          <div className="column p-l-md is-2 is-hidden-touch box">
            <aside className="menu">
              <p className="menu-label">
                General
            </p>
              <ul className="menu-list">
                <li>
                  <Link to="/admin/dashboard">
                    <a className={page === 'dashboard' ? 'is-active' : ''}>
                      Dashboard
                    </a>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/wods">
                    <a className={page === 'wods' ? 'is-active' : ''}>
                      WODs
                    </a>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/wods">
                    <a className={page === 'athletes' ? 'is-active' : ''}>
                      Athletes
                    </a>
                  </Link>
                </li>
              </ul>
              <ul className="menu-list">
                <li>
                  <Link to="/logout">
                    Logout
                  </Link>
                </li>
              </ul>
            </aside>
          </div>
          <div className="column width-100">
            <div className="columns p-l-1 height-100">
              <main className="column box">
                <div>
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div >
    );
  }
}
