import React, { PropTypes } from 'react';
import { Modal, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import container from '../../modules/container';
import capitalize from '../../modules/capitalize';

const SendInvitationModal = ({ show, onClose, onSubmit, applicationRoles }) => (
  <div className="SendInvitationModal">
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Send an Invitation</Modal.Title>
      </Modal.Header>
      <form onSubmit={onSubmit}>
        <Modal.Body>
          <FormGroup>
            <ControlLabel>Email Address</ControlLabel>
            <input
              type="email"
              name="emailAddress"
              className="form-control"
              placeholder="doug@funnie.com"
            />
          </FormGroup>
          <ControlLabel>Role</ControlLabel>
          <select
            className="form-control"
            name="role"
          >
            {applicationRoles.map(({ name }) => (
              <option key={name} value={name}>{capitalize(name)}</option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>Nevermind</Button>
          <Button type="submit" bsStyle="success">Send Invitation</Button>
        </Modal.Footer>
      </form>
    </Modal>
  </div>
);

SendInvitationModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  applicationRoles: PropTypes.array,
};

export default container((props, onData) => {
  const subscription = Meteor.subscribe('users.roles');

  if (subscription.ready()) {
    const applicationRoles = Roles.getAllRoles().fetch();
    onData(null, { applicationRoles });
  }
}, SendInvitationModal);
