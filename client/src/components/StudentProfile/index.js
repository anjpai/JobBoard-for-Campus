import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const StudentProfile = ({
  firstName,
  lastName,
  email,
  education,
  skills,
  resume,
  handleChange,
  handleSubmit,
  handleResumeUpload,
  isProcessing,
  error,
  dismissAlert,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onFileSelect = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onUploadResume = () => {
    if (selectedFile) {
      handleResumeUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <Container className="col-md-8">
      <Card className="my-4">
        <Card.Header as="h5">Student Profile</Card.Header>
        <Card.Body>
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={dismissAlert}
              className="mb-4"
            >
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Education</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    name="education.degree"
                    placeholder="Degree"
                    value={education?.degree || ''}
                    onChange={handleChange}
                    className="mb-2"
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    name="education.institution"
                    placeholder="Institution"
                    value={education?.institution || ''}
                    onChange={handleChange}
                    className="mb-2"
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="number"
                    name="education.graduationYear"
                    placeholder="Graduation Year"
                    value={education?.graduationYear || ''}
                    onChange={handleChange}
                    className="mb-2"
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="education.gpa"
                    placeholder="GPA"
                    value={education?.gpa || ''}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Skills (comma-separated)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="skills"
                value={skills?.join(', ') || ''}
                onChange={(e) => handleChange({
                  target: {
                    name: 'skills',
                    value: e.target.value.split(',').map(skill => skill.trim())
                  }
                })}
              />
            </Form.Group>

            <div className="mb-4">
              <Card className="bg-light">
                <Card.Body>
                  <h6 className="mb-3">Resume</h6>
                  {resume?.filename ? (
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Current Resume:</strong> {resume.filename}
                        <br />
                        <small className="text-muted">
                          Uploaded on: {new Date(resume.uploadDate).toLocaleDateString()}
                        </small>
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => window.open(`/api/students/resume/${resume._id}`, '_blank')}
                      >
                        View Resume
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted mb-3">No resume uploaded yet</p>
                  )}
                  
                  <div className="mt-3">
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={onFileSelect}
                      className="mb-2"
                    />
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={onUploadResume}
                      disabled={!selectedFile}
                    >
                      Upload New Resume
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>

            <div className="d-grid">
              <Button
                variant="success"
                type="submit"
                disabled={isProcessing}
              >
                {isProcessing ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentProfile; 