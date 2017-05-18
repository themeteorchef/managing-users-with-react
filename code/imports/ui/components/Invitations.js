import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Alert } from 'react-bootstrap';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import container from '../../modules/container';
import InvitationsCollection from '../../api/invitations/invitations';
import SendInvitationModal from './SendInvitationModal';

class Invitations extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
    this.revokeInvitation = this.revokeInvitation.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSendInvitation = this.handleSendInvitation.bind(this);
  }

  revokeInvitation(event, _id) {
    event.preventDefault();
    if (confirm('Are you sure? This is permanent.')) {
      Meteor.call('invitations.revoke', _id, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Invitation revoked!', 'success');
        }
      });
    }
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleSendInvitation(event) {
    event.preventDefault();

    Meteor.call('invitations.send', {
      emailAddress: document.querySelector('[name="emailAddress"]').value,
      role: document.querySelector('[name="role"]').value,
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.handleCloseModal();
        Bert.alert('Invitation sent!', 'success');
      }
    });
  }

  render() {
    const { invitations } = this.props;
    return (<div className="Invitations">
      <div className="page-header clearfix">
        <h4 className="pull-left">Invitations</h4>
        <Button
          className="pull-right"
          bsStyle="success"
          onClick={() => {
            this.setState({ showModal: true });
          }}
        >Send Invitation</Button>
      </div>
      {invitations.length ? <Table bordered responsive>
        <thead>
          <tr>
            <th>Email Address</th>
            <th>Role</th>
            <th>Sent</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invitations.map(({ _id, emailAddress, role, sent }) => (
            <tr key={_id}>
              <td className="vertical-align" width="40%">{emailAddress}</td>
              <td className="vertical-align" width="40%">{role}</td>
              <td className="vertical-align" width="40%">{moment(sent).format('MMMM Do, YYYY [at] hh:mm a')}</td>
              <td className="vertical-align" width="40%">
                <Button
                  onClick={event => this.revokeInvitation(event, _id)}
                  bsStyle="danger"
                >Revoke</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <Alert bsStyle="warning">No invitations sent yet.</Alert>}
      <SendInvitationModal
        show={this.state.showModal}
        onClose={this.handleCloseModal}
        onSubmit={this.handleSendInvitation}
      />
    </div>);
  }
}

Invitations.propTypes = {
  invitations: PropTypes.array,
};

export default container((props, onData) => {
  const subscription = Meteor.subscribe('invitations');

  if (subscription.ready()) {
    const invitations = InvitationsCollection.find().fetch();
    onData(null, { invitations });
  }
}, Invitations);
