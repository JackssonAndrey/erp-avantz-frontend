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
import UsersDetails from '../pages/Users/Details';
import EditUser from '../pages/Users/Edit';
import RegisterUser from '../pages/Users/Register';
import UserGroupDetails from '../pages/UserGroups/Details';
import EditUserGroup from '../pages/UserGroups/Edit';
import RegisterUserGroup from '../pages/UserGroups/Register';
import Persons from '../pages/Persons/index';

export default function Routes() {
  return (
    <Switch>
      <CustomRoute exact path="/" component={Login} />
      <CustomRoute exact path="/login" component={Login} />
      <CustomRoute exact path="/forgot-password" component={ForgotPassword} />
      <CustomRoute exact path="/reset-password/confirm" component={ResetPassword} />
      <CustomRoute isPrivate exact path="/dashboard" component={Dashboard} />
      <CustomRoute isPrivate exact path="/profile" component={Profile} />
      <CustomRoute isPrivate exact path="/settings" component={Settings} />

      <CustomRoute isPrivate exact path="/users" component={Users} />
      <CustomRoute isPrivate exact path="/users/details/:id" component={UsersDetails} />
      <CustomRoute isPrivate exact path="/users/edit/:id" component={EditUser} />
      <CustomRoute isPrivate exact path="/users/register" component={RegisterUser} />

      <CustomRoute isPrivate exact path="/groups/details/:id" component={UserGroupDetails} />
      <CustomRoute isPrivate exact path="/groups/edit/:id" component={EditUserGroup} />
      <CustomRoute isPrivate exact path="/groups/register" component={RegisterUserGroup} />

      <CustomRoute isPrivate exact path="/persons/" component={Persons} />
    </Switch>
  );
}
