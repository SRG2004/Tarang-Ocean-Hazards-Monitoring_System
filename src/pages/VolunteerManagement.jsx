import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import '../styles/globals.css';

const VolunteerManagement = () => {
  const { volunteers, loadVolunteers } = useApp();

  useEffect(() => {
    loadVolunteers();
  }, [loadVolunteers]);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Volunteer Management</h1>
        <p className="text-muted-foreground">Coordinate and manage registered volunteers.</p>
      </header>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Registered Volunteers ({volunteers.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Skills</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id} className="border-b">
                  <td className="p-3">{volunteer.name}</td>
                  <td className="p-3">{volunteer.email}</td>
                  <td className="p-3">{volunteer.skills}</td>
                  <td className="p-3">
                    <button className="btn-secondary btn-sm">Contact</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VolunteerManagement;
