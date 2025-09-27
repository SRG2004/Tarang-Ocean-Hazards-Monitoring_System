import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import '../styles/globals.css';

const DonationManagement = () => {
  const { donations, loadDonations } = useApp();

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <div className="page-container">
      <div className="main-card">
        <header className="page-header">
          <h1>Donation Management</h1>
          <p>Track and manage incoming donations.</p>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="card text-center">
            <h2>Total Donations</h2>
            <p className="text-2xl font-bold text-primary">${totalDonations.toLocaleString()}</p>
          </div>
          <div className="card text-center">
            <h2>Total Donors</h2>
            <p className="text-2xl font-bold">{donations.length}</p>
          </div>
        </div>

        <div className="card">
          <h2>Recent Donations</h2>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td className="border px-4 py-2">{donation.date}</td>
                  <td className="border px-4 py-2">{donation.name}</td>
                  <td className="border px-4 py-2">${donation.amount.toLocaleString()}</td>
                  <td className="border px-4 py-2">{donation.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonationManagement;
