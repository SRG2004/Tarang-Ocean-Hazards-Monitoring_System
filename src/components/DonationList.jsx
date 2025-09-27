import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/globals.css';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('/api/donations');
        setDonations(response.data.donations || []);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load donations');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading donations...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Donor</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Campaign</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id} className="border-b">
                <td className="p-3">{donation.donor.anonymous ? 'Anonymous' : donation.donor.name}</td>
                <td className="p-3">{donation.amount} {donation.currency}</td>
                <td className="p-3">{donation.campaignId}</td>
                <td className="p-3">{new Date(donation.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationList;
