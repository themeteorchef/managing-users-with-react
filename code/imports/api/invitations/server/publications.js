import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Invitations from '../invitations';

Meteor.publish('invitations', () => Invitations.find());

Meteor.publish('invitations.accept', (invitationId) => {
  check(invitationId, String);
  return Invitations.find(invitationId);
});
