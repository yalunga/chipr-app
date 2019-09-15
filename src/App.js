import React from 'react';
import { HashRouter, BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faUser, faDumbbell, faEnvelope, faLock, faPlus, faArrowRight, faCheck, faTimes, faArrowLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import 'bulma/css/bulma.css';
import './App.css';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Dashboard from './components/coach/dashboard';
import Calendar from './components/coach/calendar/calendar';
import Register from './components/auth/register';
import Home from './components/athlete/home/home';
import EnterScore from './components/athlete/home/enter-score';
import Results from './components/athlete/home/results';
import ScoreDetails from './components/athlete/home/score-details/score-details';
import UserSettings from './components/athlete/user/user-settings';

library.add(fab, faUser, faDumbbell, faEnvelope, faLock, faPlus, faArrowRight, faCheck, faTimes, faArrowLeft, faSignOutAlt);

function RedirectToLogin() {
  return (<Redirect to="/login" />)
}

function App() {
  return (
    <div style={{ height: '100vh' }}>
      {window.cordova ? (
        <HashRouter>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Register} />
            <Route path="/logout" component={Logout} />
            <Route path="/admin/dashboard" component={Dashboard} />
            <Route path="/admin/wods" component={Calendar} />
            <Route path='/athlete' exact component={Home} />
            <Route path='/athlete/enterscore/:id' exact component={EnterScore} />
            <Route path='/athlete/results/:id' exact component={Results} />
            <Route path='/athlete/score/:id' exact component={ScoreDetails} />
            <Route path='/athlete/settings' exact component={UserSettings} />
            <Route component={RedirectToLogin} />
          </Switch>
        </HashRouter>
      ) : (
          <BrowserRouter>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Register} />
              <Route path="/logout" component={Logout} />
              <Route path="/admin/dashboard" component={Dashboard} />
              <Route path="/admin/wods" component={Calendar} />
              <Route path='/athlete' exact component={Home} />
              <Route path='/athlete/enterscore/:id' exact component={EnterScore} />
              <Route path='/athlete/results/:id' exact component={Results} />
              <Route path='/athlete/score/:id' exact component={ScoreDetails} />
              <Route path='/athlete/settings' exact component={UserSettings} />
              <Route component={RedirectToLogin} />
            </Switch>
          </BrowserRouter>
        )
      }
    </div>
  );
}

export default App;
