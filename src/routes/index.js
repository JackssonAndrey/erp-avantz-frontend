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
import LegalPersons from '../pages/LegalPersons/index';
import PhysicalPersons from '../pages/PhysicalPersons/index';
import LegalPersonDetails from '../pages/LegalPersons/Details';
import PhysicalPersonDetails from '../pages/PhysicalPersons/Details';

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

      <CustomRoute isPrivate exact path="/legal/persons/" component={LegalPersons} />
      <CustomRoute isPrivate exact path="/legal/person/details/:id" component={LegalPersonDetails} />

      <CustomRoute isPrivate exact path="/physical/persons/" component={PhysicalPersons} />
      <CustomRoute isPrivate exact path="/physical/person/details/:id" component={PhysicalPersonDetails} />
    </Switch>
  );
}
