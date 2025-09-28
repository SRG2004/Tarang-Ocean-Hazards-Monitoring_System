import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { User, Mail, Phone, MapPin, Building, Award, Settings, Save } from 'lucide-react';
import Navbar from './Navbar';

const Profile = ({ role }) => {
  const { user, updateProfile } = useApp();
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    organization: '',
    role: role,
    experience: ''
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load profile data - mock for now
    setFormData({
      fullName: user?.displayName || 'John Doe',
      email: user?.email || 'john@example.com',
      phone: '+91 98765 43210',
      address: 'Marina Beach, Chennai',
      organization: role === 'citizen' ? '' : 'Coastal Marine Institute',
      role: role,
      experience: role === 'citizen' ? '' : '5 years in marine research'
    });
  }, [user, role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setEditing(false);
      // Toast success
    } catch (error) {
      // Toast error
      console.error('Profile update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Profile</h1>
          <p className="text-text-secondary">Manage your personal and professional information</p>
        </div>

        <div className="card p-6">
          <div className="border-b border-border pb-6 mb-6">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Personal Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input w-full"
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input w-full"
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input w-full"
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input w-full"
                  disabled={!editing}
                />
              </div>
            </div>

            {role !== 'citizen' && (
              <>
                <div className="border-t border-border pt-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-2">Professional Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="input w-full"
                      disabled={!editing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Experience
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows="3"
                      className="input w-full"
                      disabled={!editing}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={toggleEdit}
                className="btn-secondary"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
              {editing && (
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
