import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationManagement.css';

const DonationManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('donate');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationForm, setDonationForm] = useState({
    type: 'Monetary',
    amount: '500',
    description: 'Emergency relief donation of ₹500',
    anonymous: false,
    receipt: true
  });

  const stats = [
    { title: 'Total Raised (This Month)', value: '₹50,000.00', color: '#10b981' },
    { title: 'Total Donations', value: '2', color: '#3b82f6' },
    { title: 'Unique Donors', value: '2', color: '#f59e0b' },
    { title: 'Open Requests', value: '0', color: '#8b5cf6' }
  ];

  const quickAmounts = ['₹500', '₹1000', '₹2000', '₹5000'];

  const materialDonations = [
    {
      id: 'relief-supplies',
      title: 'Relief Supplies',
      description: 'Food, water, medicines',
      icon: '🏥',
      color: '#ec4899'
    },
    {
      id: 'equipment',
      title: 'Equipment',
      description: 'Rescue gear, communication devices',
      icon: '⚡',
      color: '#3b82f6'
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Transportation, technical support',
      icon: '🔧',
      color: '#8b5cf6'
    }
  ];

  const recentDonations = [
    {
      id: 1,
      donor: 'Rajesh Kumar',
      type: 'monetary',
      amount: '₹50,000.00',
      purpose: 'Emergency relief fund for cyclone victims',
      date: '8 Sept 2025, 02:04 pm',
      status: 'CONFIRMED'
    },
    {
      id: 2,
      donor: 'Priya Sharma',
      type: 'supplies',
      amount: 'SUPPLIES',
      purpose: 'Relief supplies for flood affected areas',
      date: '3 Sept 2025, 02:04 pm',
      status: 'ALLOCATED'
    }
  ];

  const activeRequests = [
    {
      id: 1,
      title: 'Urgent supplies needed for evacuation center at Marina Beach',
      location: 'Chennai Marina Beach Relief Center',
      deadline: '5 Sept 2025, 02:04 pm',
      status: 'CRITICAL',
      items: [
        { name: 'Life Jackets', needed: '50/200 pieces' },
        { name: 'Emergency Food Packets', needed: '300/1000 packets' }
      ]
    }
  ];

  const handleDonationSubmit = () => {
    console.log('Donation submitted:', donationForm);
    setShowDonationModal(false);
    // In a real app, this would submit to your backend
  };

  return (
    <div className="donation-management">
      {/* Header */}
      <header className="donation-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="page-title">💝 Donation & Resource Management</h1>
            <p className="page-subtitle">Support emergency response through donations and resource allocation</p>
          </div>
          <div className="header-actions">
            <button 
              className="header-button"
              onClick={() => navigate('/')}
            >
              🏠 Home
            </button>
            <button 
              className="make-donation-button"
              onClick={() => setShowDonationModal(true)}
            >
              💝 Make Donation
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="donation-nav">
        <div className="nav-container">
          <button 
            className={`nav-tab ${activeTab === 'donate' ? 'active' : ''}`}
            onClick={() => setActiveTab('donate')}
          >
            🎁 Donate
            <span className="tab-subtitle">Make a donation</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            📋 Requests
            <span className="tab-subtitle">Resource needs</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            🎯 Campaigns
            <span className="tab-subtitle">Active campaigns</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'management' ? 'active' : ''}`}
            onClick={() => setActiveTab('management')}
          >
            📊 Management
            <span className="tab-subtitle">Track donations</span>
          </button>
        </div>
      </nav>

      <main className="donation-main">
        {/* Stats Overview */}
        <section className="stats-overview">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="stat-title">{stat.title}</div>
              </div>
            ))}
          </div>
        </section>

        {activeTab === 'donate' && (
          <>
            {/* Quick Donation */}
            <section className="quick-donation-section">
              <div className="donation-grid">
                <div className="monetary-donations">
                  <h3 className="section-title">🔥 Quick Monetary Donation</h3>
                  <div className="amount-buttons">
                    {quickAmounts.map((amount) => (
                      <button key={amount} className="amount-button">
                        {amount}
                      </button>
                    ))}
                    <button className="custom-amount-button">Custom Amount</button>
                  </div>
                </div>

                <div className="material-donations">
                  <h3 className="section-title">📦 Material Donations</h3>
                  <div className="material-grid">
                    {materialDonations.map((item) => (
                      <div key={item.id} className="material-card">
                        <div 
                          className="material-icon"
                          style={{ color: item.color }}
                        >
                          {item.icon}
                        </div>
                        <div className="material-info">
                          <h4 className="material-title">{item.title}</h4>
                          <p className="material-description">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recent-donations">
                  <h3 className="section-title">🎉 Recent Donations</h3>
                  <div className="donations-list">
                    {recentDonations.map((donation) => (
                      <div key={donation.id} className="donation-item">
                        <div className="donation-content">
                          <div className="donor-name">{donation.donor}</div>
                          <div className="donation-purpose">{donation.purpose}</div>
                          <div className="donation-date">{donation.date}</div>
                        </div>
                        <div className="donation-amount">
                          {donation.amount}
                        </div>
                        <div className={`donation-status ${donation.status.toLowerCase()}`}>
                          {donation.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'requests' && (
          <section className="requests-tab">
            <h2 className="tab-title">📋 Active Resource Requests</h2>
            {activeRequests.length > 0 ? (
              <div className="requests-list">
                {activeRequests.map((request) => (
                  <div key={request.id} className="request-card">
                    <div className="request-header">
                      <div className={`request-status ${request.status.toLowerCase()}`}>
                        {request.status}
                      </div>
                      <div className="request-deadline">
                        Deadline: {request.deadline}
                      </div>
                    </div>
                    <h3 className="request-title">{request.title}</h3>
                    <div className="request-location">📍 {request.location}</div>
                    <div className="items-needed">
                      <h4>Items Needed:</h4>
                      <ul className="items-list">
                        {request.items.map((item, index) => (
                          <li key={index} className="item">
                            <span className="item-name">{item.name}</span>
                            <span className="item-progress">{item.needed}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="request-actions">
                      <button className="donate-to-request-button">💝 Donate</button>
                      <button className="contact-button">📞 Contact</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No active requests</h3>
                <p>There are currently no resource requests that need donations.</p>
              </div>
            )}
          </section>
        )}

        {activeTab === 'campaigns' && (
          <section className="campaigns-tab">
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h3>No active campaigns</h3>
              <p>There are currently no donation campaigns running.</p>
            </div>
          </section>
        )}

        {activeTab === 'management' && (
          <section className="management-tab">
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>Management Dashboard</h3>
              <p>Donation tracking and management features will be displayed here.</p>
            </div>
          </section>
        )}
      </main>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="modal-overlay" onClick={() => setShowDonationModal(false)}>
          <div className="donation-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💝 Make a Donation</h3>
              <button 
                className="close-button"
                onClick={() => setShowDonationModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Donation Type</label>
                <select 
                  value={donationForm.type}
                  onChange={(e) => setDonationForm({...donationForm, type: e.target.value})}
                >
                  <option>Monetary</option>
                  <option>Supplies</option>
                  <option>Services</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input 
                  type="text"
                  value={donationForm.amount}
                  onChange={(e) => setDonationForm({...donationForm, amount: e.target.value})}
                  placeholder="500"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={donationForm.description}
                  onChange={(e) => setDonationForm({...donationForm, description: e.target.value})}
                  placeholder="Emergency relief donation of ₹500"
                  rows="3"
                />
              </div>
              <div className="form-checkboxes">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={donationForm.anonymous}
                    onChange={(e) => setDonationForm({...donationForm, anonymous: e.target.checked})}
                  />
                  Make this donation anonymous
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={donationForm.receipt}
                    onChange={(e) => setDonationForm({...donationForm, receipt: e.target.checked})}
                  />
                  Request tax receipt
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowDonationModal(false)}
              >
                Cancel
              </button>
              <button 
                className="donate-now-button"
                onClick={handleDonationSubmit}
              >
                💝 Donate Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationManagement;