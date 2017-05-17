import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  const userToInsert = user;
  userToInsert.roles = options.roles || ['employee'];
  if (options.profile) userToInsert.profile = options.profile;
  return userToInsert;
});
