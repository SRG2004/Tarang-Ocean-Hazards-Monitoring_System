import React, { useState, useEffect } from 'react';
import { hazardReportService } from '../services/hazardReportService';
import { useApp } from '../contexts/AppContext';
import './CreateReportForm.css';

const CreateReportForm = ({ onClose, onSuccess, initialLocation = null }) => {
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other',
    severity: 'medium',
    coordinates: initialLocation || null,
    locationAddress: '',
    mediaFiles: []
  });

  const hazardTypes = [
    { value: 'tsunami', label: 'Tsunami' },
    { value: 'high_waves', label: 'High Waves' },
    { value: 'storm', label: 'Storm/Cyclone' },
    { value: 'flood', label: 'Coastal Flood' },
    { value: 'erosion', label: 'Coastal Erosion' },
    { value: 'oil_spill', label: 'Oil Spill' },
    { value: 'debris', label: 'Marine Debris' },
    { value: 'pollution', label: 'Water Pollution' },
    { value: 'wildlife', label: 'Marine Wildlife Distress' },
    { value: 'other', label: 'Other' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low Risk', color: '#10b981' },
    { value: 'medium', label: 'Medium Risk', color: '#f59e0b' },
    { value: 'high', label: 'High Risk', color: '#ef4444' },
    { value: 'critical', label: 'Critical/Emergency', color: '#7c2d12' }
  ];

  // Get current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setFormData(prev => ({ ...prev, coordinates: coords }));
          
          // Try to get address from coordinates
          try {
            const response = await fetch(
              `https://api.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
            );
            const data = await response.json();
            if (data.display_name) {
              setFormData(prev => ({ ...prev, locationAddress: data.display_name }));
            }
          } catch (error) {
            console.log('Could not get address:', error);
          }
          
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enter location manually.');
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setLocationLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, mediaFiles: files }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.coordinates) {
      alert('Please provide location information.');
      return;
    }

    if (!formData.description.trim()) {
      alert('Please provide a description of the hazard.');
      return;
    }

    setLoading(true);

    try {
      const reportData = {
        ...formData,
        userId: user?.uid || 'anonymous',
        reporterName: user?.displayName || 'Anonymous User',
        reporterEmail: user?.email || '',
        reporterPhone: '', // You can add phone field if needed
        location: {
          latitude: formData.coordinates.lat,
          longitude: formData.coordinates.lng,
          address: formData.locationAddress,
          state: extractStateFromAddress(formData.locationAddress),
          district: extractDistrictFromAddress(formData.locationAddress)
        }
      };

      const result = await hazardReportService.submitReport(reportData);
      
      if (result.success) {
        alert('Report submitted successfully!');
        onSuccess && onSuccess(result);
        onClose && onClose();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to extract location info
  const extractStateFromAddress = (address) => {
    if (!address) return '';
    // Simple extraction - can be improved with proper geocoding
    const parts = address.split(',');
    return parts.length > 3 ? parts[parts.length - 2].trim() : '';
  };

  const extractDistrictFromAddress = (address) => {
    if (!address) return '';
    const parts = address.split(',');
    return parts.length > 2 ? parts[parts.length - 3].trim() : '';
  };

  return (
    <div className="create-report-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Report Ocean Hazard</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Report Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief title for the hazard"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Hazard Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                {hazardTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="severity">Severity Level *</label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                required
              >
                {severityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of what you observed..."
                rows={4}
                required
                maxLength={1000}
              />
              <small>{formData.description.length}/1000 characters</small>
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <h3>Location</h3>
            
            <div className="location-controls">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="location-button"
              >
                {locationLoading ? '📍 Getting Location...' : '📍 Use Current Location'}
              </button>
              
              {formData.coordinates && (
                <div className="coordinates-display">
                  <p>📍 Lat: {formData.coordinates.lat.toFixed(6)}, Lng: {formData.coordinates.lng.toFixed(6)}</p>
                  {formData.locationAddress && (
                    <p className="address">📍 {formData.locationAddress}</p>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="locationAddress">Location Details</label>
              <input
                type="text"
                id="locationAddress"
                name="locationAddress"
                value={formData.locationAddress}
                onChange={handleInputChange}
                placeholder="Describe the exact location (beach name, landmark, etc.)"
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="form-section">
            <h3>Photos/Videos (Optional)</h3>
            
            <div className="form-group">
              <label htmlFor="mediaFiles">Upload Images/Videos</label>
              <input
                type="file"
                id="mediaFiles"
                multiple
                accept="image/*,video/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <small>Supported formats: JPG, PNG, MP4, MOV (Max 5 files, 10MB each)</small>
              
              {formData.mediaFiles.length > 0 && (
                <div className="file-preview">
                  {Array.from(formData.mediaFiles).map((file, index) => (
                    <div key={index} className="file-item">
                      📷 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !formData.coordinates}
              className="submit-button"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReportForm;