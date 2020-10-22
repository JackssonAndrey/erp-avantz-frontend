import React from 'react';
import { Switch } from 'react-router-dom';

import CustomRoute from './CustomRoutes';

import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import ResetPassword from '../pages/ResetPassword';
import Users from '../pages/Users';

export default function Routes() {
  return (
    <Switch>
      <CustomRoute exact path="/login" component={Login} />
      <CustomRoute exact path="/" component={Login} />
      <CustomRoute exact path="/forgot-password" component={ForgotPassword} />
      <CustomRoute exact path="/reset-password/confirm" component={ResetPassword} />
      <CustomRoute isPrivate exact path="/dashboard" component={Dashboard} />
      <CustomRoute isPrivate exact path="/profile" component={Profile} />
      <CustomRoute isPrivate exact path="/settings" component={Settings} />
      <CustomRoute isPrivate exact path="/users" component={Users} />
    </Switch>
  );
}
