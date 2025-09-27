import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Camera,
  AlertTriangle,
  FileText,
  Clock,
  Send,
  X,
  Upload,
  CheckCircle
} from 'lucide-react';

function FormButton({ children, variant = "primary", ...props }) {
  const className =
    variant === "primary"
      ? "button-form-primary button-press-effect"
      : "button-form-secondary button-press-effect";
  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
}

export default function ReportHazardForm({ onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    severity: '',
    description: '',
    location: {
      latitude: '',
      longitude: '',
      address: ''
    },
    contact: {
      name: '',
      phone: '',
      email: ''
    }
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [geoError, setGeoError] = useState("");
  const imageUrlsRef = useRef([]);

  const hazardTypes = [
    { value: 'cyclone', label: 'Cyclone/Storm', icon: '🌀' },
    { value: 'flood', label: 'Coastal Flooding', icon: '🌊' },
    { value: 'tsunami', label: 'Tsunami Warning', icon: '🌊' },
    { value: 'erosion', label: 'Coastal Erosion', icon: '🏔️' },
    { value: 'pollution', label: 'Ocean Pollution', icon: '🛢️' },
    { value: 'wildlife', label: 'Marine Wildlife Issue', icon: '🐟' },
    { value: 'navigation', label: 'Navigation Hazard', icon: '⚓' },
    { value: 'other', label: 'Other', icon: '❓' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800', description: 'Minor concern, no immediate danger' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Moderate risk, attention needed' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', description: 'Significant risk, urgent action required' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', description: 'Immediate danger to life/property' }
  ];

  const getCurrentLocation = () => {
    setUseCurrentLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString()
            }
          }));
          setUseCurrentLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setGeoError("Unable to retrieve your location. Please enter it manually.");
          setUseCurrentLocation(false);
        }
      );
    } else {
      setGeoError("Geolocation is not supported by this browser.");
      setUseCurrentLocation(false);
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 3 - images.length);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      imageUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const removeImage = idx => {
    URL.revokeObjectURL(imageUrlsRef.current[idx]);
    imageUrlsRef.current.splice(idx, 1);
    setImages(images => images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const report = {
        ...formData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        images: images.length,
        status: 'pending'
      };
      
      onSubmit?.(report);
      setIsSubmitting(false);
      onClose?.();
    }, 2000);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return !!(formData.type && formData.severity && formData.title.trim() && formData.description.trim());
      case 2:
        return !!(formData.location.latitude && formData.location.longitude);
      case 3:
        return !!(formData.contact.name.trim() && formData.contact.phone.trim());
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };
  
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <form className="form-card-enhanced" onSubmit={handleSubmit} aria-label="Report Ocean Hazard">
      {/* Progress bar */}
      {isSubmitting && <div className="progress-bar-animated mb-2" />}
      {/* Header */}
      <div className="form-header-gradient flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Report Ocean Hazard</h2>
          <p className="mt-1 text-white/80">Help keep your community safe by reporting hazards.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="button-form-secondary button-press-effect ml-4">
          &times;
        </button>
      </div>
      {/* Stepper */}
      <div className="form-step-indicator mb-6">
        {["Hazard Details", "Location & Media", "Contact Info"].map((label, idx) => (
          <div key={label} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                ${currentStep > idx ? "bg-gradient-form-success text-white" : currentStep === idx ? "bg-gradient-form-header text-white" : "bg-slate-200 text-slate-400"}
              `}
            >
              {idx + 1}
            </div>
            <span className={`mt-1 text-xs ${currentStep === idx ? "text-blue-700 font-semibold" : "text-slate-500"}`}>{label}</span>
          </div>
        ))}
      </div>
      {/* Feedback */}
      <div aria-live="polite" role="status">
        {submitError && <div className="feedback-error">{submitError}</div>}
        {submitSuccess && <div className="feedback-success">{submitSuccess}</div>}
      </div>
      {/* Step Content */}
      <div className="form-fade-in">
        {currentStep === 1 && (
          <section className="form-card-enhanced mb-4">
            <h3 className="font-semibold mb-2">Hazard Type</h3>
            <div role="radiogroup" aria-label="Hazard Type" className="flex gap-3 mb-4">
              {hazardTypes.map((type, idx) => (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={hazardType === type}
                  aria-label={type}
                  className={`input-enhanced px-4 py-2 ${hazardType === type ? "bg-gradient-form-header text-white" : ""}`}
                  onClick={() => setHazardType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <h3 className="font-semibold mb-2">Severity</h3>
            <div role="radiogroup" aria-label="Hazard Severity" className="flex gap-3 mb-4">
              {["Low", "Moderate", "High", "Critical"].map((level, idx) => (
                <label key={level} htmlFor={`severity-${level}`} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`severity-${level}`}
                    name="severity"
                    value={level}
                    checked={severity === level}
                    onChange={() => setSeverity(level)}
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brief Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Large waves causing coastal flooding"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed information about the hazard, including what you observed, when it started, and any impacts..."
                rows={6}
                className="input resize-none"
                required
              />
            </div>
            <FormButton variant="primary" onClick={nextStep}>Next</FormButton>
          </section>
        )}
        {currentStep === 2 && (
          <section className="form-card-enhanced mb-4">
            <h3 className="font-semibold mb-2">Location</h3>
            <div className="flex gap-2 mb-2">
              <FormButton variant="secondary" onClick={getCurrentLocation}>Use Current Location</FormButton>
              {geoError && <div className="feedback-error ml-2">{geoError}</div>}
            </div>
            <div className="flex gap-2 mb-4">
              <input
                className="input-enhanced"
                type="text"
                value={location.lat}
                onChange={e => setLocation({ ...location, lat: e.target.value })}
                placeholder="Latitude"
                aria-label="Latitude"
              />
              <input
                className="input-enhanced"
                type="text"
                value={location.lng}
                onChange={e => setLocation({ ...location, lng: e.target.value })}
                placeholder="Longitude"
                aria-label="Longitude"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address/Landmark
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, address: e.target.value }
                }))}
                placeholder="e.g., Marine Drive, Mumbai or nearest landmark"
                className="input"
              />
            </div>
            <h3 className="font-semibold mb-2">Upload Photo</h3>
            <input
              className="input-enhanced"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              aria-label="Upload hazard photo"
            />
            <div className="flex gap-2 mt-2">
              {images.map((img, idx) => {
                const url = URL.createObjectURL(img);
                imageUrlsRef.current[idx] = url;
                return (
                  <div key={idx} className="relative">
                    <img src={url} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
                    <button type="button" className="absolute top-1 right-1 text-white bg-red-500 rounded-full px-2 py-1" onClick={() => removeImage(idx)} aria-label="Remove image">&times;</button>
                  </div>
                );
              })}
            </div>
            <FormButton variant="primary" onClick={nextStep}>Next</FormButton>
            <FormButton variant="secondary" onClick={prevStep} className="ml-2">Back</FormButton>
          </section>
        )}
        {currentStep === 3 && (
          <section className="form-card-enhanced mb-4">
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <label htmlFor="contactName" className="block mb-2 font-medium">Name</label>
            <input
              className="input-enhanced mb-2"
              id="contactName"
              type="text"
              value={contact.name}
              onChange={e => setContact({ ...contact, name: e.target.value })}
              placeholder="Your Name"
              aria-label="Your Name"
            />
            <label htmlFor="contactPhone" className="block mb-2 font-medium">Phone</label>
            <input
              className="input-enhanced mb-2"
              id="contactPhone"
              type="tel"
              value={contact.phone}
              onChange={e => setContact({ ...contact, phone: e.target.value })}
              placeholder="Phone Number"
              aria-label="Phone Number"
            />
            <label htmlFor="contactEmail" className="block mb-2 font-medium">Email</label>
            <input
              className="input-enhanced mb-2"
              id="contactEmail"
              type="email"
              value={contact.email}
              onChange={e => setContact({ ...contact, email: e.target.value })}
              placeholder="Email Address"
              aria-label="Email Address"
            />
            <FormButton variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <span className="loading-form" /> : "Submit"}
            </FormButton>
            <FormButton variant="secondary" onClick={prevStep} className="ml-2">Back</FormButton>
          </section>
        )}
      </div>
    </form>
  );
}