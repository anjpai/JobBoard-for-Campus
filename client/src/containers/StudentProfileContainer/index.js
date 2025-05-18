import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setUser } from '../../actions';
import { withAPI } from '../../services/api';
import StudentProfile from '../../components/StudentProfile';

class StudentProfileContainer extends Component {
  state = {
    firstName: this.props.user?.firstName || '',
    lastName: this.props.user?.lastName || '',
    email: this.props.user?.email || '',
    education: this.props.user?.education || {},
    skills: this.props.user?.skills || [],
    resume: this.props.user?.resume || null,
    isProcessing: false,
    error: null,
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      this.setState(prevState => ({
        [parent]: {
          ...prevState[parent],
          [child]: value
        }
      }));
    } else {
      this.setState({ [name]: value });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isProcessing: true });

    const { api, setUser } = this.props;
    const { firstName, lastName, education, skills } = this.state;

    api.updateStudentProfile({ firstName, lastName, education, skills })
      .then(() => api.getProfile())
      .then(response => {
        setUser({ user: response.data });
        this.setState({ 
          isProcessing: false,
          error: null
        });
      })
      .catch(error => {
        this.setState({
          isProcessing: false,
          error: error.response?.data?.message || 'Error updating profile'
        });
      });
  };

  handleResumeUpload = (file) => {
    this.setState({ isProcessing: true });

    const { api, setUser } = this.props;

    api.uploadResume(file)
      .then(() => api.getProfile())
      .then(response => {
        setUser({ user: response.data });
        this.setState({ 
          isProcessing: false,
          error: null
        });
      })
      .catch(error => {
        this.setState({
          isProcessing: false,
          error: error.response?.data?.message || 'Error uploading resume'
        });
      });
  };

  dismissAlert = () => {
    this.setState({ error: null });
  };

  render() {
    return (
      <StudentProfile
        {...this.state}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        handleResumeUpload={this.handleResumeUpload}
        dismissAlert={this.dismissAlert}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

export default compose(
  connect(mapStateToProps, { setUser }),
  withAPI
)(StudentProfileContainer); 