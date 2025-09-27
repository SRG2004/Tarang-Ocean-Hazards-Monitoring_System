import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './VolunteerRegistrationForm.css';

const VolunteerRegistrationForm = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    skills: '',
    availability: 'weekends',
    experience: 'beginner',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const postData = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()),
    };

    try {
      const response = await axios.post('/api/volunteers/register', postData);
      toast.success('Volunteer registration successful!');
      if (onRegistrationSuccess) {
        onRegistrationSuccess(response.data.volunteer);
      }
      // Reset form
      setFormData({
        skills: '',
        availability: 'weekends',
        experience: 'beginner',
      });
    } catch (error) {
      console.error('Failed to register volunteer:', error);
      toast.error(error.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="volunteer-registration-form-container">
      <h2 className="form-title">Register as a Volunteer</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="skills">Skills (comma-separated)</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="e.g., First Aid, Driving, Communication"
            required
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
            <option value="weekends">Weekends</option>
            <option value="weekdays">Weekdays</option>
            <option value="emergency_only">Emergency Only</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience Level</label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? 'Registering...' : 'Register Now'}
        </button>
      </form>
    </div>
  );
};

export default VolunteerRegistrationForm;
