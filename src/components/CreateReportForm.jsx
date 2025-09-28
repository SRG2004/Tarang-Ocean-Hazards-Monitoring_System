import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { hazardReportService } from '../services/hazardReportService';
import { AlertCircle, MapPin, X } from 'lucide-react';

const hazardTypes = [
  'Storm Surge',
  'Coastal Flooding',
  'High Waves',
  'Rip Currents',
  'Erosion',
  'Marine Hazards',
  'Other'
];

const CreateReportForm = ({ onReportSubmitted, onClose }) => {
  const { user } = useApp();
  const [formData, setFormData] = useState({
    hazardType: '',
    latitude: '',
    longitude: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hazardType || !formData.description || !formData.latitude || !formData.longitude) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const reportData = {
        userId: user.uid,
        hazardType: formData.hazardType,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        description: formData.description,
        status: 'pending'
      };

      await hazardReportService.createReport(reportData);
      onReportSubmitted();
      onClose();
    } catch (err) {
      setError('Failed to submit report. Please try again.');
      console.error('Report submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">Report Hazard</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger text-danger px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Hazard Type */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-danger" />
              <span>Hazard Type *</span>
            </label>
            <select
              name="hazardType"
              value={formData.hazardType}
              onChange={handleInputChange}
              required
              className="input w-full"
            >
              <option value="">Select hazard type</option>
              {hazardTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2 flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Location *</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                step="any"
                required
                className="input"
              />
              <input
                type="number"
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                step="any"
                required
                className="input"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Describe the hazard in detail (what, when, severity, etc.)"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
              className="input resize-none"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
              disabled={submitting}
            >
              <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { CreateReportForm };
