import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Heart,
  CreditCard,
  User,
  Mail,
  DollarSign,
  Shield,
  CheckCircle,
  Send
} from 'lucide-react';

const DonationForm = ({ onDonationSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    donorEmail: '',
    anonymous: false,
  });
  const [submitting, setSubmitting] = useState(false);

  // Reset form fields when anonymous is toggled
  const handleAnonymousChange = (e) => {
    const { checked } = e.target;
    if (checked) {
      setFormData(prev => ({
        ...prev,
        anonymous: true,
        donorName: '',
        donorEmail: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, anonymous: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'anonymous') {
      handleAnonymousChange(e);
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post('/api/donations/process', formData);
      toast.success('Donation processed successfully!');
      if (onDonationSuccess) {
        onDonationSuccess(response.data.donation);
      }
      // Reset form
      setFormData({
        amount: '',
        donorName: '',
        donorEmail: '',
        anonymous: false,
      });
    } catch (error) {
      console.error('Failed to process donation:', error);
      toast.error(error.response?.data?.error || 'Failed to process donation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const suggestedAmounts = [500, 1000, 2500, 5000, 10000];

  return (
    <div className="card-feature max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 -m-8 mb-8 rounded-xl">
        <div className="flex items-center space-x-3">
          <Heart className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Support Relief Efforts</h2>
            <p className="text-green-100">Help coastal communities stay safe with your donation</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Donation Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Donation Amount (INR) *
          </label>
          
          {/* Suggested Amounts */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
            {suggestedAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                className={`p-3 rounded-lg border-2 transition-all text-center hover:shadow-md ${
                  formData.amount === amount.toString()
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <DollarSign className="w-4 h-4 mx-auto mb-1" />
                <div className="text-sm font-semibold">₹{amount.toLocaleString()}</div>
              </button>
            ))}
          </div>
          
          {/* Custom Amount */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter custom amount"
              className="input pl-12"
              min="1"
              required
            />
          </div>
        </div>

        {/* Donor Information */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-semibold">Donor Information</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="donorName">
                Your Name {!formData.anonymous && '*'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="donorName"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="input pl-12"
                  required={!formData.anonymous}
                  disabled={formData.anonymous}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="donorEmail">
                Your Email {!formData.anonymous && '*'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="donorEmail"
                  name="donorEmail"
                  value={formData.donorEmail}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="input pl-12"
                  required={!formData.anonymous}
                  disabled={formData.anonymous}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Donate anonymously
                </span>
              </label>
              <Shield className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-6 h-6 text-purple-600" />
            <h4 className="text-lg font-semibold">Payment</h4>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Secure Payment Processing</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• 256-bit SSL encryption</li>
                  <li>• No card details stored</li>
                  <li>• Instant receipt via email</li>
                  <li>• Tax deduction certificate available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Impact */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-3">Your Impact</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹500</div>
              <div>Emergency kit for 1 family</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹2,500</div>
              <div>Warning system maintenance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹10,000</div>
              <div>Rescue boat equipment</div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            * Required unless anonymous
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className={`btn-success flex items-center space-x-2 px-8 py-3 ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitting && <div className="loading" />}
            <Heart className="w-5 h-5" />
            <span>{submitting ? 'Processing Donation...' : 'Donate Now'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;