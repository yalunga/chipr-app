import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class GuestLayout extends React.PureComponent {
  constructor() {
    super();
    document.body.classList.add('min-height-100vh');
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack()
  }

  render() {
    // eslint-disable-next-line
    const { children, page, showBackArrow, paddingBottom } = this.props;
    return (
      <div className="background-white">
        <nav className="navbar box is-paddingless is-fixed-top" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            {showBackArrow && (
              <p className="navbar-item" style={{ marginLeft: '1rem' }} onClick={this.goBack}>
                <FontAwesomeIcon icon="arrow-left" />
              </p>
            )}
            <p className="navbar-item has-text-centered">
              onewod
            </p>
          </div>
        </nav>
        {!showBackArrow && (
          <nav className="navbar box is-fixed-bottom is-marginless is-hidden-desktop" role="navigation" aria-label="main navigation">
            <div className="columns is-mobile height-100">
              <div className="column has-text-centered">
                <Link to="/athlete" className="has-text-grey-light">
                  <div className="background-light-purple br-4">
                    <span className="heading has-text-centered">Pro</span>
                  </div>
                </Link>
              </div>
              <div className="column has-text-centered">
                <Link to="/athlete" className={page === "athlete" ? "has-text-primary nav-selected" : "has-text-grey-light"}>
                  <FontAwesomeIcon icon="dumbbell" />
                </Link>
              </div>
              <div className="column has-text-centered">
                <Link to="/athlete/settings" className={page === "settings" ? "has-text-primary nav-selected" : "has-text-grey-light"}>
                  <FontAwesomeIcon icon="user" />
                </Link>
              </div>
            </div>
          </nav>
        )}
        <div className="columns width-100 is-marginless height-100">
          <div className="column height-100" style={{
            paddingBottom: (!showBackArrow || paddingBottom) ? '4rem' : '0rem',
            paddingTop: '4rem'
          }}>
            <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '1rem' }}>
              {children}
            </div>
          </div>
        </div>
      </div >
    );
  }
};

export default withRouter(GuestLayout);
