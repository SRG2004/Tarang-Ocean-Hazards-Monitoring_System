import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { hazardReportService } from '../services/hazardReportService';
import { AlertCircle, MapPin, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

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
  
  const handleHazardTypeChange = (value) => {
    setFormData(prev => ({ ...prev, hazardType: value }));
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full relative animate-in zoom-in-95">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Report a New Hazard</CardTitle>
            <CardDescription>
              Your report helps keep the community safe. Please provide as much detail as possible.
            </CardDescription>
          </CardHeader>
          <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4"
            >
              <X className="h-4 w-4" />
            </Button>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="hazardType">Hazard Type *</Label>
              <Select 
                name="hazardType" 
                value={formData.hazardType} 
                onValueChange={handleHazardTypeChange}
                required
              >
                <SelectTrigger id="hazardType">
                  <SelectValue placeholder="Select a hazard type" />
                </SelectTrigger>
                <SelectContent>
                  {hazardTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location (Coordinates) *</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  type="number"
                  step="any"
                  required
                />
                <Input
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  type="number"
                  step="any"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the hazard in detail (e.g., what you saw, when, severity)."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateReportForm; 
