/* eslint-disable no-underscore-dangle */

import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Alert, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { Link, browserHistory } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import container from '../../modules/container';
import Invitations from '../../api/invitations/invitations';

class AcceptInvitation extends React.Component {
  handleSubmit(event) {
    event.preventDefault();

    const rawPassword = document.querySelector('[name="password"]').value;
    const userToCreate = {
      invitationId: document.querySelector('[name="invitationId"]').value,
      user: {
        email: document.querySelector('[name="emailAddress"]').value,
        password: Accounts._hashPassword(rawPassword),
        profile: {
          name: {
            first: document.querySelector('[name="firstName"]').value,
            last: document.querySelector('[name="lastName"]').value,
          },
        },
      },
    };

    Meteor.call('invitations.accept', userToCreate, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Meteor.loginWithPassword(userToCreate.user.email, rawPassword, (loginError) => {
          if (loginError) {
            Bert.alert(loginError.reason, 'danger');
          } else {
            browserHistory.push('/documents');
            Bert.alert('Welcome!', 'success');
          }
        });
      }
    });
  }

  render() {
    const { invitation } = this.props;
    return invitation ? (<div className="AcceptInvitation">
      <Row>
        <Col xs={ 12 } sm={ 6 } md={ 4 }>
          <h4 className="page-header">Accept Invitation</h4>
          <form
            ref={form => (this.acceptInvitationForm = form)}
            onSubmit={this.handleSubmit}
          >
            <Row>
              <Col xs={ 6 } sm={ 6 }>
                <FormGroup>
                  <ControlLabel>First Name</ControlLabel>
                  <FormControl
                    type="text"
                    ref="firstName"
                    name="firstName"
                    placeholder="First Name"
                  />
                </FormGroup>
              </Col>
              <Col xs={ 6 } sm={ 6 }>
                <FormGroup>
                  <ControlLabel>Last Name</ControlLabel>
                  <FormControl
                    type="text"
                    ref="lastName"
                    name="lastName"
                    placeholder="Last Name"
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <ControlLabel>Email Address</ControlLabel>
              <FormControl
                type="text"
                ref="emailAddress"
                name="emailAddress"
                placeholder="Email Address"
                defaultValue={invitation.emailAddress}
                disabled
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <FormControl
                type="password"
                ref="password"
                name="password"
                placeholder="Password"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Invitation Token</ControlLabel>
              <FormControl
                type="text"
                ref="invitationId"
                name="invitationId"
                placeholder="Invitation Token"
                defaultValue={invitation._id}
                disabled
              />
            </FormGroup>
            <Button type="submit" bsStyle="success">Create Account</Button>
          </form>
          <p>Already have an account? <Link to="/login">Log In</Link>.</p>
        </Col>
      </Row>
    </div>) : (<Alert bsStyle="warning">
      Sorry, this invitation doesn't exist or has already been accepted.
    </Alert>);
  }
}

AcceptInvitation.propTypes = {
  invitation: PropTypes.object,
};

export default container(({ params }, onData) => {
  const invitationId = params.token;
  const subscription = Meteor.subscribe('invitations.accept', invitationId);

  if (subscription.ready()) {
    const invitation = Invitations.findOne(invitationId);
    onData(null, { invitation });
  }
}, AcceptInvitation);
