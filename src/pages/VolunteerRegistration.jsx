import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';
import './VolunteerRegistration.css';

const VolunteerRegistration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState('');
  const { registerVolunteer } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerVolunteer({ name, email, skills });
      toast.success('Thank you for registering as a volunteer!');
      setName('');
      setEmail('');
      setSkills('');
    } catch (error) {
      toast.error(`Registration failed: ${error.message}`);
    }
  };

  return (
    <div className="volunteer-registration-page">
      <div className="registration-container">
        <header className="registration-header">
          <h1>Volunteer Registration</h1>
          <p>Join our team of dedicated volunteers and make a difference.</p>
        </header>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="skills">Skills and Experience</label>
            <textarea
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Let us know how you can help (e.g., medical, logistics, communication)"
              rows={4}
            />
          </div>
          <button type="submit" className="btn-register">Register to Volunteer</button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerRegistration;
