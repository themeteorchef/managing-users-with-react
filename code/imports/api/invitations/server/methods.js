import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import Invitations from '../invitations';

Meteor.methods({
  'invitations.accept': function invitationsAccept(user) {
    check(user, {
      invitationId: String,
      emailAddress: String,
      password: Object, // Hashed object using Accounts._hashPassword() on client.
      profile: Object,
    });

    const userId = Accounts.createUser({
      email: user.emailAddress,
      password: user.password,
      profile: user.profile,
    });

    if (userId) Invitations.remove(user.invitationId);

    return userId;
  },
  'invitations.revoke': function invitationsRevoke(_id) {
    check(_id, String);
    if (Roles.userIsInRole(this.userId, 'admin')) Invitations.remove(_id);
  },
});
