import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { hazardReportService } from '../services/hazardReportService';
import { MapPin, Image, Clock, Upload, X } from 'lucide-react';

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
    description: '',
    timeObserved: new Date().toISOString().slice(0, 16),
    contactInfo: user?.email || '',
    images: []
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          setError('Unable to get current location. Please enter manually.');
        }
      );
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hazardType || !formData.description || !formData.latitude || !formData.longitude) {
      setError('Please fill in all required fields.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const reportData = {
        userId: user.uid,
        hazardType: formData.hazardType,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        description: formData.description,
        timeObserved: new Date(formData.timeObserved),
        status: 'pending',
        images: formData.images
      };

      await hazardReportService.createReport(reportData);
      onReportSubmitted();
    } catch (err) {
      setError('Failed to submit report. Please try again.');
      console.error('Report submission error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Report Hazard</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Hazard Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span>Hazard Type *</span>
            </label>
            <select
              name="hazardType"
              value={formData.hazardType}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select hazard type</option>
              {hazardTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>Location *</span>
            </label>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="any"
                  required
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="any"
                  required
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleLocationChange}
                className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-3 py-2 rounded-md border border-blue-200"
              >
                <MapPin className="h-4 w-4" />
                <span>Use Current Location</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Describe the hazard in detail..."
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Time Observed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Time Observed</span>
            </label>
            <input
              type="datetime-local"
              name="timeObserved"
              value={formData.timeObserved}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <Image className="h-4 w-4 text-gray-500" />
              <span>Upload Photos (Optional)</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Information (Optional)
            </label>
            <input
              type="text"
              name="contactInfo"
              placeholder="Email or phone number"
              value={formData.contactInfo}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Your contact will not be shared publicly</p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{uploading ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReportForm;
