import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';

const defaultRoles = ['admin', 'manager', 'employee']; // This could be tied to its own admin :)

defaultRoles.forEach((role) => {
  const existingRoles = _.pluck(Roles.getAllRoles().fetch(), 'name');
  const roleExists = existingRoles.indexOf(role) > -1;
  if (!roleExists) Roles.createRole(role);
});
