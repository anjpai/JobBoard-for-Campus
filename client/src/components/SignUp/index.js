import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useLocation } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignUp = ({
  firstName,
  lastName,
  email,
  password,
  companyName,
  companyEmail,
  companyPhone,
  handleChange,
  handleSubmit,
  isProcessing,
  error,
  dismissAlert,
}) => {
  const location = useLocation();
  const isCompany = location.pathname === ROUTES.SIGN_UP_COMPANY;

  return (
    <Container className="col-md-4">
      <Card className="shadow-sm">
        <Card.Header as="h2" className="text-center">
          Sign Up {isCompany ? 'as Company' : 'as Student'}
        </Card.Header>
        <Card.Body>
          <Alert
            variant="danger"
            show={error}
            dismissible
            onClose={dismissAlert}
          >
            {error}
          </Alert>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                required
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>
            <Form.Group controlId="lastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                required
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                disabled={isProcessing}
                placeholder="6-64 characters, letters and numbers only"
              />
            </Form.Group>
            {isCompany && (
              <>
                <Form.Group controlId="companyName" className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    value={companyName}
                    onChange={handleChange}
                    disabled={isProcessing}
                  />
                </Form.Group>
                <Form.Group controlId="companyEmail" className="mb-3">
                  <Form.Label>Company Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="companyEmail"
                    value={companyEmail}
                    onChange={handleChange}
                    disabled={isProcessing}
                  />
                </Form.Group>
                <Form.Group controlId="companyPhone" className="mb-3">
                  <Form.Label>Company Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="companyPhone"
                    value={companyPhone}
                    onChange={handleChange}
                    disabled={isProcessing}
                  />
                </Form.Group>
              </>
            )}
            <Button variant="success" type="submit" disabled={isProcessing}>
              {isProcessing ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-muted text-center">
          Already have an account? <Link to={ROUTES.LOG_IN}>Log In</Link>
        </Card.Footer>
      </Card>
    </Container>
  );
};

SignUp.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  companyName: PropTypes.string,
  companyEmail: PropTypes.string,
  companyPhone: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dismissAlert: PropTypes.func.isRequired,
};

export default SignUp;
