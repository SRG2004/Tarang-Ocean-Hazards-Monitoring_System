import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';
import '../styles/globals.css';

const Donation = () => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { processDonation } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    try {
      await processDonation({ amount: parseFloat(amount), name, email });
      toast.success('Thank you for your generous donation!');
      setAmount('');
      setName('');
      setEmail('');
    } catch (error) {
      toast.error(`Donation failed: ${error.message}`);
    }
  };

  return (
    <div className="page-container">
      <div className="main-card">
        <h2>Make a Donation</h2>
        <p>Your support helps us respond to emergencies effectively.</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount (USD)</label>
            <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" required />
          </div>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="(Optional)" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="(Optional) for a receipt" />
          </div>
          <button type="submit" className="btn-primary">Donate Now</button>
        </form>
      </div>
    </div>
  );
};

export default Donation;
