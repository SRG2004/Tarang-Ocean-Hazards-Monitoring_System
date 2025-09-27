import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  MapPin,
  Upload,
  Send,
  Camera,
  X,
  CheckCircle
} from 'lucide-react';

const CreateReportForm = ({ onReportSubmitted }) => {
  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    media: [],
  });

  // Auto-detect user location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          toast.success('Location detected successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to detect location. Please enter manually.');
        }
      );
    }
  };
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, media: Array.from(e.target.files) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const reportData = new FormData();
    reportData.append('type', formData.type);
    reportData.append('severity', formData.severity);
    reportData.append('title', formData.title);
    reportData.append('description', formData.description);
    reportData.append('coordinates', JSON.stringify({ lat: formData.latitude, lng: formData.longitude }));

    for (let i = 0; i < formData.media.length; i++) {
      reportData.append('media', formData.media[i]);
    }

    try {
      const response = await axios.post('/api/hazards/report', reportData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Hazard report submitted successfully!');
      if (onReportSubmitted) {
        onReportSubmitted(response.data.report);
      }
      // Reset form
      setFormData({
        type: '',
        severity: '',
        title: '',
        description: '',
        latitude: '',
        longitude: '',
        media: [],
      });
    } catch (error) {
      console.error('Failed to submit hazard report:', error);
      toast.error(error.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800', description: 'Minor concern' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Moderate risk' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', description: 'Significant risk' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', description: 'Immediate danger' }
  ];

  const hazardTypes = [
    { value: 'tsunami', label: 'Tsunami', icon: '🌊' },
    { value: 'storm_surge', label: 'Storm Surge', icon: '🌀' },
    { value: 'high_tide', label: 'High Tide', icon: '🌊' },
    { value: 'rip_current', label: 'Rip Current', icon: '⚡' },
    { value: 'cyclone', label: 'Cyclone', icon: '🌀' },
    { value: 'flood', label: 'Coastal Flooding', icon: '🌊' },
    { value: 'erosion', label: 'Coastal Erosion', icon: '🏔️' },
    { value: 'pollution', label: 'Ocean Pollution', icon: '🛢️' },
    { value: 'other', label: 'Other', icon: '❓' }
  ];

  return (
    <div className="card-feature max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6 -m-8 mb-8 rounded-xl">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Report Ocean Hazard</h2>
            <p className="text-blue-100">Help protect coastal communities by reporting hazards</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="title">
            Hazard Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Tsunami Warning - Marina Beach"
            className="input"
            required
          />
        </div>

        {/* Hazard Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Hazard Type *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {hazardTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                className={`p-4 rounded-lg border-2 transition-all text-center hover:shadow-md ${
                  formData.type === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Severity Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Severity Level *
          </label>
          <div className="space-y-3">
            {severityLevels.map((level) => (
              <label
                key={level.value}
                className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.severity === level.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <input
                  type="radio"
                  name="severity"
                  value={level.value}
                  checked={formData.severity === level.value}
                  onChange={handleInputChange}
                  className="mt-1 mr-3"
                  required
                />
                <div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${level.color}`}>
                      {level.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">
            Detailed Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide detailed information about the hazard, including what you observed, when it started, and any impacts..."
            rows={5}
            className="input resize-none"
            required
          />
        </div>

        {/* Location */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-semibold">Location Information</h4>
          </div>
          
          <div className="space-y-4">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="btn-secondary flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Use Current Location</span>
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="latitude">
                  Latitude *
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="19.0760"
                  step="any"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="longitude">
                  Longitude *
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="72.8777"
                  step="any"
                  className="input"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Camera className="w-6 h-6 text-green-600" />
            <h4 className="text-lg font-semibold">Photo Evidence (Optional)</h4>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload photos or videos to help authorities assess the situation
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <input
                type="file"
                id="media"
                name="media"
                onChange={handleFileChange}
                multiple
                accept="image/*,video/*"
                className="hidden"
              />
              <label htmlFor="media" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Click to upload media</p>
                <p className="text-xs text-gray-500">Images and videos up to 10MB each</p>
              </label>
            </div>
            
            {formData.media.length > 0 && (
              <div className="text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 inline mr-2" />
                {formData.media.length} file(s) selected
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            * Required fields
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className={`btn-primary flex items-center space-x-2 px-8 py-3 ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitting && <div className="loading" />}
            <Send className="w-5 h-5" />
            <span>{submitting ? 'Submitting Report...' : 'Submit Hazard Report'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportForm;