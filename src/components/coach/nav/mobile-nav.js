import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import onClickOutside from "react-onclickoutside";

class MobileNav extends Component {
  constructor() {
    super();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  handleClickOutside = (evt) => {
    // ..handling code goes here...
    this.props.hideNav();
  };
  render() {
    const { page } = this.props;
    return (
      <div className="column p-l-lg is-2 box absolute z-2">
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
    );
  }
}

export default onClickOutside(MobileNav);