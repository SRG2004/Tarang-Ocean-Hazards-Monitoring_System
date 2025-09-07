import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VolunteerRegistration.css';

const VolunteerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    skills: '',
    availability: 'Weekends'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration submitted:', formData);
    // In a real app, this would submit to your backend
    navigate('/citizen');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="volunteer-registration">
      <div className="registration-container">
        <div className="registration-card">
          <div className="registration-header">
            <button 
              className="back-button"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </button>
            <h1 className="registration-title">Citizen Registration</h1>
            <p className="registration-subtitle">
              Join our community of ocean hazard response volunteers
            </p>
          </div>

          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="skills">Skills & Expertise</label>
                <textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., First Aid, Swimming, Communication, etc."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label htmlFor="availability">Availability</label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                >
                  <option value="Weekends">Weekends</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Emergency Only">Emergency Only</option>
                </select>
              </div>
            </div>

            <button type="submit" className="register-button">
              Register as Citizen
            </button>
          </form>

          <div className="registration-footer">
            <p>Already registered? <button onClick={() => navigate('/login')} className="sign-in-link">Sign In</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegistration;