import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import './UserRegistration.css';

const UserRegistration = () => {
  const navigate = useNavigate();
  const { register } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'citizen',
    location: {
      state: '',
      district: '',
      coastalArea: ''
    },
    preferences: {
      alerts: true,
      newsletter: true,
      smsNotifications: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const indianStates = [
    'Andhra Pradesh', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 
    'Odisha', 'Tamil Nadu', 'West Bengal', 'Goa', 'Puducherry'
  ];

  const userRoles = [
    { value: 'citizen', label: 'Citizen', description: 'Report hazards and receive alerts' },
    { value: 'official', label: 'Government Official', description: 'Emergency response coordination' },
    { value: 'analyst', label: 'Data Analyst', description: 'Data analysis and research' },
    { value: 'researcher', label: 'Researcher', description: 'Ocean safety research' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location.state) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        ...formData,
        userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        registrationDate: new Date().toISOString(),
        status: 'active'
      });
      
      // Redirect based on role
      switch (formData.role) {
        case 'analyst':
          navigate('/analyst');
          break;
        case 'official':
          navigate('/login'); // Officials need approval
          break;
        default:
          navigate('/citizen');
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-registration-page">
      <div className="registration-container">
        <div className="registration-header">
          <h1>🌊 Join Taranga Ocean Safety Network</h1>
          <p>Create your account to access ocean hazard monitoring and reporting features</p>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <section className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.fullName ? 'error' : ''}
                required
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={errors.phone ? 'error' : ''}
                required
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </section>

          {/* Security */}
          <section className="form-section">
            <h3>Security</h3>
            
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password (min. 6 characters)"
                className={errors.password ? 'error' : ''}
                required
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
                required
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </section>

          {/* Role Selection */}
          <section className="form-section">
            <h3>Account Type</h3>
            
            <div className="role-selection">
              {userRoles.map((role) => (
                <label key={role.value} className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleInputChange}
                  />
                  <div className="role-info">
                    <span className="role-label">{role.label}</span>
                    <span className="role-description">{role.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Location */}
          <section className="form-section">
            <h3>Location Information</h3>
            
            <div className="form-group">
              <label htmlFor="state">State/Union Territory *</label>
              <select
                id="state"
                name="location.state"
                value={formData.location.state}
                onChange={handleInputChange}
                className={errors.state ? 'error' : ''}
                required
              >
                <option value="">Select your state</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="district">District</label>
              <input
                type="text"
                id="district"
                name="location.district"
                value={formData.location.district}
                onChange={handleInputChange}
                placeholder="Enter your district"
              />
            </div>

            <div className="form-group">
              <label htmlFor="coastalArea">Coastal Area/City</label>
              <input
                type="text"
                id="coastalArea"
                name="location.coastalArea"
                value={formData.location.coastalArea}
                onChange={handleInputChange}
                placeholder="Enter your coastal area or city"
              />
            </div>
          </section>

          {/* Preferences */}
          <section className="form-section">
            <h3>Notification Preferences</h3>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="preferences.alerts"
                  checked={formData.preferences.alerts}
                  onChange={handleInputChange}
                />
                <span>Receive emergency alerts and hazard notifications</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="preferences.newsletter"
                  checked={formData.preferences.newsletter}
                  onChange={handleInputChange}
                />
                <span>Subscribe to newsletter and updates</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="preferences.smsNotifications"
                  checked={formData.preferences.smsNotifications}
                  onChange={handleInputChange}
                />
                <span>Enable SMS notifications for critical alerts</span>
              </label>
            </div>
          </section>

          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign In
            </button>
            
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;