import { Accounts } from 'meteor/accounts-base';
import './email-templates';

Accounts.config({
  forbidClientAccountCreation: true,
});
