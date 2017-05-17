import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Alert, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import container from '../../modules/container';
import Invitations from '../../api/invitations/invitations';

class AcceptInvitation extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {};
    // this.thing = this.thing.bind(this);
  }

  render() {
    const { invitation } = this.props;
    return invitation ? (<div className="AcceptInvitation">
      <Row>
        <Col xs={ 12 } sm={ 6 } md={ 4 }>
          <h4 className="page-header">Accept Invitation</h4>
          <form
            ref={ form => (this.signupForm = form) }
            onSubmit={ this.handleSubmit }
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
                type="password"
                ref="password"
                name="password"
                placeholder="Password"
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
