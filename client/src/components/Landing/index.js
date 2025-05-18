import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import * as ROUTES from '../../constants/routes';
import { FaUserGraduate, FaBuilding, FaHandshake } from 'react-icons/fa';

const Landing = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="my-5">
            <Card.Header as="h1" className="text-center">
              Campus Recruitment System
            </Card.Header>
            <Card.Body className="p-4">
              <Card.Title as="h2" className="text-center mb-4 section-title">
                Your Gateway to Professional Success
              </Card.Title>
              <Card.Text className="text-center mb-5" style={{ fontSize: '1.1rem', color: '#4a5568' }}>
                Connect with leading organizations and discover opportunities that align with your career goals.
              </Card.Text>
              
              <Row className="mb-5">
                <Col md={4} className="text-center mb-4">
                  <div className="hover-lift">
                    <FaUserGraduate size={36} color="#1e3c72" className="mb-3" />
                    <h5 style={{ color: '#2d3748' }}>For Students</h5>
                    <p style={{ color: '#4a5568', fontSize: '0.95rem' }}>Access career opportunities with top employers</p>
                  </div>
                </Col>
                <Col md={4} className="text-center mb-4">
                  <div className="hover-lift">
                    <FaBuilding size={36} color="#1e3c72" className="mb-3" />
                    <h5 style={{ color: '#2d3748' }}>For Companies</h5>
                    <p style={{ color: '#4a5568', fontSize: '0.95rem' }}>Recruit talented graduates for your organization</p>
                  </div>
                </Col>
                <Col md={4} className="text-center mb-4">
                  <div className="hover-lift">
                    <FaHandshake size={36} color="#1e3c72" className="mb-3" />
                    <h5 style={{ color: '#2d3748' }}>Partnerships</h5>
                    <p style={{ color: '#4a5568', fontSize: '0.95rem' }}>Build meaningful professional connections</p>
                  </div>
                </Col>
              </Row>

              <div className="d-grid gap-3 col-md-6 mx-auto">
                <LinkContainer to={ROUTES.SIGN_UP}>
                  <Button size="lg" className="btn-success">
                    Join Now
                  </Button>
                </LinkContainer>
                <LinkContainer to={ROUTES.LOG_IN}>
                  <Button variant="light" size="lg">
                    Sign In
                  </Button>
                </LinkContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Landing;
