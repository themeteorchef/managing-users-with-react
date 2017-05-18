import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import PublicNavigation from './PublicNavigation.js';
import AuthenticatedNavigation from './AuthenticatedNavigation.js';
import container from '../../modules/container';

const renderNavigation = (hasUser, isAdminOrManager) =>
(hasUser ? <AuthenticatedNavigation isAdminOrManager={isAdminOrManager} /> : <PublicNavigation />);

const AppNavigation = ({ hasUser, isAdminOrManager }) => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">Folks</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      { renderNavigation(hasUser, isAdminOrManager) }
    </Navbar.Collapse>
  </Navbar>
);

AppNavigation.propTypes = {
  hasUser: PropTypes.object,
  isAdminOrManager: PropTypes.bool,
};

export default container((props, onData) => {
  if (Roles.subscription.ready()) {
    const user = Meteor.user();
    onData(null, {
      hasUser: user,
      isAdminOrManager: Roles.userIsInRole(user, ['admin', 'manager']),
    });
  }
}, AppNavigation);
