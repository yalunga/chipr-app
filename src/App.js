import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faUser, faDumbbell, faEnvelope, faLock, faPlus } from '@fortawesome/free-solid-svg-icons';
import 'bulma/css/bulma.css';
import './App.css';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Dashboard from './components/coach/dashboard';
import Calendar from './components/coach/calendar/calendar';
import Register from './components/auth/register';
import Home from './components/athlete/home/home';

library.add(fab, faUser, faDumbbell, faEnvelope, faLock, faPlus);

function App() {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Register} />
      <Route path="/logout" component={Logout} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/wods" component={Calendar} />
      <Route path='/athlete' exact component={Home} />
    </Router>
  );
}

export default App;
