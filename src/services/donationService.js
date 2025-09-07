import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  query,
  orderBy,
  where,
  limit 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const donationService = {
  // Process donation
  async processDonation(donationData) {
    try {
      const donation = {
        ...donationData,
        id: `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        status: 'pending',
        amount: parseFloat(donationData.amount) || 0,
        currency: donationData.currency || 'INR',
        paymentMethod: donationData.paymentMethod || 'online',
        receiptGenerated: false
      };

      // Simulate payment processing
      const paymentResult = await this.processPayment(donation);
      
      if (paymentResult.success) {
        donation.status = 'confirmed';
        donation.paymentId = paymentResult.paymentId;
        donation.receiptGenerated = donationData.receipt || false;
      }

      const docRef = await addDoc(collection(db, 'donations'), donation);
      
      // Update campaign statistics
      await this.updateCampaignStats(donation);
      
      return { 
        success: true, 
        donationId: docRef.id, 
        data: donation,
        paymentResult 
      };
    } catch (error) {
      console.error('Error processing donation:', error);
      throw error;
    }
  },

  // Simulate payment processing
  async processPayment(donation) {
    // Simulate payment gateway integration
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        resolve({
          success,
          paymentId: success ? `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : null,
          message: success ? 'Payment processed successfully' : 'Payment failed'
        });
      }, 1000);
    });
  },

  // Get donations
  async getDonations(filters = {}) {
    try {
      let q = collection(db, 'donations');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.userId) {
        q = query(q, where('userId', '==', filters.userId));
      }
      if (filters.campaignId) {
        q = query(q, where('campaignId', '==', filters.campaignId));
      }

      q = query(q, orderBy('timestamp', 'desc'));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const donations = [];
      querySnapshot.forEach((doc) => {
        donations.push({ id: doc.id, ...doc.data() });
      });

      return donations;
    } catch (error) {
      console.error('Error getting donations:', error);
      throw error;
    }
  },

  // Get donation statistics
  async getDonationStats() {
    try {
      const donations = await this.getDonations({ status: 'confirmed' });
      
      const stats = {
        totalAmount: 0,
        totalDonations: donations.length,
        uniqueDonors: new Set(),
        thisMonth: 0,
        byType: {
          monetary: 0,
          supplies: 0,
          services: 0
        }
      };

      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();

      donations.forEach(donation => {
        // Total amount
        if (donation.type === 'monetary' || donation.type === 'Monetary') {
          stats.totalAmount += donation.amount;
        }
        
        // Unique donors
        if (donation.userId) {
          stats.uniqueDonors.add(donation.userId);
        }
        
        // This month donations
        const donationDate = new Date(donation.timestamp);
        if (donationDate.getMonth() === thisMonth && donationDate.getFullYear() === thisYear) {
          if (donation.type === 'monetary' || donation.type === 'Monetary') {
            stats.thisMonth += donation.amount;
          }
        }
        
        // By type
        const type = (donation.type || 'monetary').toLowerCase();
        if (stats.byType.hasOwnProperty(type)) {
          stats.byType[type]++;
        }
      });

      return {
        ...stats,
        uniqueDonors: stats.uniqueDonors.size
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
      const request = {
        ...requestData,
        id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        status: 'active',
        fulfilled: false,
        priority: requestData.priority || 'medium',
        itemsReceived: {},
        totalDonationsReceived: 0
      };

      const docRef = await addDoc(collection(db, 'resourceRequests'), request);
      return { success: true, requestId: docRef.id, data: request };
    } catch (error) {
      console.error('Error creating resource request:', error);
      throw error;
    }
  },

  // Get resource requests
  async getResourceRequests(filters = {}) {
    try {
      let q = collection(db, 'resourceRequests');

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.priority) {
        q = query(q, where('priority', '==', filters.priority));
      }

      q = query(q, orderBy('timestamp', 'desc'));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });

      return requests;
    } catch (error) {
      console.error('Error getting resource requests:', error);
      throw error;
    }
  },

  // Update campaign statistics
  async updateCampaignStats(donation) {
    try {
      // Update global campaign stats
      const campaignId = donation.campaignId || 'general_emergency_fund';
      // This would typically update campaign-specific statistics
      console.log(`Updated stats for campaign: ${campaignId}`);
    } catch (error) {
      console.error('Error updating campaign stats:', error);
    }
  },

  // Generate receipt
  async generateReceipt(donationId) {
    try {
      // This would generate a PDF receipt in a real implementation
      const receiptData = {
        receiptId: `receipt_${donationId}_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        donationId
      };

      // Update donation record
      const donationRef = doc(db, 'donations', donationId);
      await updateDoc(donationRef, {
        receiptGenerated: true,
        receiptData
      });

      return receiptData;
    } catch (error) {
      console.error('Error generating receipt:', error);
      throw error;
    }
  }
};