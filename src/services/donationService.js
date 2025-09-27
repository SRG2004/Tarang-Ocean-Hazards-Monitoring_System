import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const donationService = {
  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Process donation
  async processDonation(donationData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/donations`, donationData, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        donationId: response.data.donation.id,
        data: response.data.donation,
        paymentResult: response.data.paymentResult
      };
    } catch (error) {
      console.error('Error processing donation:', error);
      throw new Error(error.response?.data?.error || 'Failed to process donation');
    }
  },

  // Get donations
  async getDonations(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`${API_BASE_URL}/donations?${params}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.donations || [];
    } catch (error) {
      console.error('Error getting donations:', error);
      throw new Error(error.response?.data?.error || 'Failed to get donations');
    }
  },

  // Get specific donation
  async getDonation(donationId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/${donationId}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.donation;
    } catch (error) {
      console.error('Error getting donation:', error);
      throw new Error(error.response?.data?.error || 'Failed to get donation');
    }
  },

  // Get donation statistics
  async getDonationStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/donations/stats`, {
        headers: this.getAuthHeaders()
      });

      return response.data.stats || {
        totalAmount: 0,
        totalDonations: 0,
        uniqueDonors: 0,
        thisMonth: 0,
        byType: { monetary: 0, supplies: 0, services: 0 }
      };
    } catch (error) {
      console.error('Error getting donation stats:', error);
      return {
        totalAmount: 0,
        totalDonations: 0,
        uniqueDonors: 0,
        thisMonth: 0,
        byType: { monetary: 0, supplies: 0, services: 0 }
      };
    }
  },

  // Create resource request
  async createResourceRequest(requestData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/donations/resource-requests`, requestData, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        requestId: response.data.request.id,
        data: response.data.request
      };
    } catch (error) {
      console.error('Error creating resource request:', error);
      throw new Error(error.response?.data?.error || 'Failed to create resource request');
    }
  },

  // Get resource requests
  async getResourceRequests(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`${API_BASE_URL}/donations/resource-requests?${params}`, {
        headers: this.getAuthHeaders()
      });

      return response.data.requests || [];
    } catch (error) {
      console.error('Error getting resource requests:', error);
      throw new Error(error.response?.data?.error || 'Failed to get resource requests');
    }
  },

  // Update resource request
  async updateResourceRequest(requestId, updateData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/donations/resource-requests/${requestId}`, updateData, {
        headers: this.getAuthHeaders()
      });

      return {
        success: true,
        message: response.data.message,
        data: response.data.request
      };
    } catch (error) {
      console.error('Error updating resource request:', error);
      throw new Error(error.response?.data?.error || 'Failed to update resource request');
    }
  },

  // Generate receipt
  async generateReceipt(donationId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/donations/${donationId}/receipt`, {}, {
        headers: this.getAuthHeaders()
      });

      return response.data.receipt;
    } catch (error) {
      console.error('Error generating receipt:', error);
      throw new Error(error.response?.data?.error || 'Failed to generate receipt');
    }
  },

  // Get payment methods
  getPaymentMethods() {
    return [
      { value: 'online', label: 'Online Payment' },
      { value: 'upi', label: 'UPI' },
      { value: 'card', label: 'Credit/Debit Card' },
      { value: 'netbanking', label: 'Net Banking' },
      { value: 'wallet', label: 'Digital Wallet' }
    ];
  },

  // Get donation types
  getDonationTypes() {
    return [
      { value: 'monetary', label: 'Monetary Donation' },
      { value: 'supplies', label: 'Supplies & Equipment' },
      { value: 'services', label: 'Services & Support' },
      { value: 'volunteer', label: 'Volunteer Time' }
    ];
  },

  // Get currencies
  getCurrencies() {
    return [
      { value: 'INR', label: 'Indian Rupee (INR)' },
      { value: 'USD', label: 'US Dollar (USD)' },
      { value: 'EUR', label: 'Euro (EUR)' },
      { value: 'GBP', label: 'British Pound (GBP)' }
    ];
  }
};