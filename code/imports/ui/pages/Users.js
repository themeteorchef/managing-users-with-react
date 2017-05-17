import React from 'react';
import PropTypes from 'prop-types';
import { Table, Label } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Bert } from 'meteor/themeteorchef:bert';
import Invitations from '../components/Invitations';
import container from '../../modules/container';
import capitalize from '../../modules/capitalize';

class Users extends React.Component {
  checkIfCurrentUser(mappedUserId, currentUserId) {
    return mappedUserId === currentUserId;
  }

  handleChangeRole(_id, role) {
    Meteor.call('users.changeRole', { _id, role }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Role updated!', 'success');
      }
    });
  }

  render() {
    const { users, currentUser, applicationRoles } = this.props;
    return (<div className="Users">
      <h4 className="page-header">Users</h4>
      <Table bordered responsive>
        <thead>
          <tr>
            <th>Email Address</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ _id, emails, roles }) => {
            const isCurrentUser = this.checkIfCurrentUser(_id, currentUser._id);
            return (<tr key={_id}>
              <td className="vertical-align" width="40%">
                {isCurrentUser ? <Label bsStyle="success">You!</Label> : ''}
                {emails[0].address}
              </td>
              <td>
                <select
                  className="form-control"
                  value={roles[0]}
                  disabled={isCurrentUser}
                  onChange={(event) => { this.handleChangeRole(_id, event.target.value); }}
                >
                  {applicationRoles.map(({ name }) => (
                    <option key={name} value={name}>{capitalize(name)}</option>
                  ))}
                </select>
              </td>
            </tr>);
          })}
        </tbody>
      </Table>
      <Invitations />
    </div>);
  }
}

Users.propTypes = {
  users: PropTypes.array,
  currentUser: PropTypes.object,
  applicationRoles: PropTypes.array,
};

export default container((props, onData) => {
  const subscription = Meteor.subscribe('users');

  if (subscription.ready() && Roles.subscription.ready()) {
    const users = Meteor.users.find().fetch();
    const currentUser = Meteor.user();
    const applicationRoles = Roles.getAllRoles().fetch();
    onData(null, { users, currentUser, applicationRoles });
  }
}, Users);
