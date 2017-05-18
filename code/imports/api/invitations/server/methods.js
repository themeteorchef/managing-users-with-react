import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Email } from 'meteor/email';
import Invitations from '../invitations';

Meteor.methods({
  'invitations.send': function invitationsSend(invitation) {
    check(invitation, {
      emailAddress: String,
      role: String,
    });

    if (Roles.userIsInRole(this.userId, 'admin')) {
      const { emailAddress } = invitation;
      const invitationExists = Invitations.findOne({ emailAddress }) || Meteor.users.findOne({ 'emails.address': emailAddress });

      if (!invitationExists) {
        const invitationId = Invitations.insert(invitation);
        Meteor.defer(() => {
          Email.send({
            to: emailAddress,
            from: 'The Meteor Chef <demo@themeteorchef.com>',
            replyTo: 'The Meteor Chef <demo@themeteorchef.com>',
            subject: 'You\'ve been invited to Folks!',
            html: `
              <p>Hi there!</p>
              <p>We'd like to invite you to join Folks, an application for managing...folks!</p>
              <p>To claim your invitation and join us, click the link below:</p>
              <p><a href="${Meteor.absoluteUrl(`accept/${invitationId}`)}">Claim Invitation</a></p>
            `,
          });
        });
      } else {
        throw new Meteor.Error('500', `Easy, cowpoke. ${emailAddress} has already been invited.`);
      }
    } else {
      throw new Meteor.Error('500', 'Well, shucks! You\'re not allowed to do that.');
    }
  },
  'invitations.accept': function invitationsAccept(userToCreate) {
    check(userToCreate, {
      invitationId: String,
      user: {
        email: String,
        password: Object, // Hash object using Accounts._hashPassword() on client.
        profile: Object,
      },
    });

    const invitation = Invitations.findOne(userToCreate.invitationId);
    const userId = Accounts.createUser(userToCreate.user);

    if (userId) {
      Roles.addUsersToRoles(userId, invitation.role);
      Invitations.remove(userToCreate.invitationId);
    }

    return userId;
  },
  'invitations.revoke': function invitationsRevoke(_id) {
    check(_id, String);
    if (Roles.userIsInRole(this.userId, 'admin')) Invitations.remove(_id);
  },
});
