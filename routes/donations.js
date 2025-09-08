/**
 * Donation Management Routes
 * Handles donation processing, campaign management, and financial tracking
 */

import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { firestore } from '../config/database.js';

const router = express.Router();

/**
 * POST /api/donations/process
 * Process a new donation
 */
router.post('/process', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const {
      type = 'monetary',
      amount,
      currency = 'INR',
      paymentMethod = 'online',
      campaignId = 'general_emergency_fund',
      donorName,
      donorEmail,
      donorPhone,
      anonymous = false,
      dedicatedTo,
      message,
      receipt = false
    } = req.body;
    
    // Validate required fields
    if (type === 'monetary' && (!amount || amount <= 0)) {
      return res.status(400).json({
        error: 'Valid amount is required for monetary donations'
      });
    }
    
    // Generate unique donation ID
    const donationId = `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate payment processing
    const paymentResult = await simulatePaymentProcessing({
      amount: parseFloat(amount) || 0,
      currency,
      paymentMethod,
      donorEmail: donorEmail || req.user.email
    });
    
    if (!paymentResult.success) {
      return res.status(400).json({
        error: 'Payment processing failed',
        details: paymentResult.message
      });
    }
    
    // Create donation record
    const donationData = {
      id: donationId,
      userId,
      userInfo: {
        name: req.user.fullName,
        email: req.user.email
      },
      type,
      amount: parseFloat(amount) || 0,
      currency,
      paymentMethod,
      campaignId,
      donor: {
        name: donorName || req.user.fullName,
        email: donorEmail || req.user.email,
        phone: donorPhone || req.user.phone || '',
        anonymous
      },
      dedicatedTo: dedicatedTo || '',
      message: message || '',
      receipt,
      status: 'confirmed',
      paymentId: paymentResult.paymentId,
      transactionDetails: {
        gateway: 'stripe', // Would be actual payment gateway
        reference: paymentResult.reference,
        fees: paymentResult.fees || 0
      },
      metadata: {
        source: 'web_app',
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        platform: 'taranga'
      },
      timestamps: {
        initiated: new Date().toISOString(),
        processed: new Date().toISOString(),
        confirmed: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to database
    await setDoc(doc(firestore, 'donations', donationId), donationData);
    
    // Update user donation statistics
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    
    const currentStats = userData.stats || {};
    await updateDoc(userRef, {
      'stats.donationsCount': (currentStats.donationsCount || 0) + 1,
      'stats.totalDonated': (currentStats.totalDonated || 0) + (parseFloat(amount) || 0),
      updatedAt: new Date().toISOString()
    });
    
    // Update campaign statistics
    await updateCampaignStats(campaignId, donationData);
    
    // Generate receipt if requested
    let receiptData = null;
    if (receipt) {
      receiptData = await generateReceipt(donationId, donationData);
    }
    
    // Emit real-time event
    req.io?.emit('new-donation', {
      donation: {
        id: donationId,
        amount: donationData.amount,
        type: donationData.type,
        campaign: campaignId,
        anonymous: anonymous
      }
    });
    
    res.status(201).json({
      message: 'Donation processed successfully',
      donation: {
        id: donationId,
        amount: donationData.amount,
        currency: donationData.currency,
        status: donationData.status,
        receipt: receiptData
      },
      paymentDetails: {
        transactionId: paymentResult.paymentId,
        reference: paymentResult.reference
      }
    });
    
  } catch (error) {
    console.error('Process donation error:', error);
    res.status(500).json({
      error: 'Failed to process donation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/donations
 * Get donations with filtering and pagination
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      status,
      type,
      campaignId,
      userId: filterUserId,
      limit: queryLimit = 50,
      anonymous
    } = req.query;
    
    const userId = req.user.userId || req.user.id;
    const userRole = req.user.role || 'citizen';
    
    let q = collection(firestore, 'donations');
    const constraints = [];
    
    // Regular users can only see their own donations
    // Officials and admins can see all donations
    if (!['official', 'admin', 'analyst'].includes(userRole)) {
      constraints.push(where('userId', '==', userId));
    } else if (filterUserId) {
      constraints.push(where('userId', '==', filterUserId));
    }
    
    // Apply filters
    if (status) {
      constraints.push(where('status', '==', status));
    }
    
    if (type) {
      constraints.push(where('type', '==', type));
    }
    
    if (campaignId) {
      constraints.push(where('campaignId', '==', campaignId));
    }
    
    if (anonymous !== undefined) {
      constraints.push(where('donor.anonymous', '==', anonymous === 'true'));
    }
    
    // Add ordering and limit
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(parseInt(queryLimit)));
    
    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    const donations = [];
    
    querySnapshot.forEach((doc) => {
      const donation = doc.data();
      
      // Hide sensitive information for non-admin users
      if (!['admin', 'official'].includes(userRole)) {
        delete donation.transactionDetails;
        delete donation.metadata;
        if (donation.donor?.anonymous) {
          donation.donor.name = 'Anonymous Donor';
          donation.donor.email = 'hidden';
        }
      }
      
      donations.push({
        id: doc.id,
        ...donation,
        timeAgo: getTimeAgo(donation.createdAt)
      });
    });
    
    res.json({
      donations,
      total: donations.length,
      filters: { status, type, campaignId, anonymous }
    });
    
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({
      error: 'Failed to retrieve donations',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/donations/statistics
 * Get donation statistics and analytics
 */
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const { timeRange = '30d', campaignId } = req.query;
    const userRole = req.user.role || 'citizen';
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '24h':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    // Base query
    let q = collection(firestore, 'donations');
    const constraints = [
      where('status', '==', 'confirmed'),
      where('createdAt', '>=', startDate.toISOString()),
      orderBy('createdAt', 'desc')
    ];
    
    if (campaignId) {
      constraints.push(where('campaignId', '==', campaignId));
    }
    
    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    const donations = [];
    querySnapshot.forEach(doc => donations.push(doc.data()));
    
    // Calculate statistics
    const stats = {
      totalAmount: 0,
      totalDonations: donations.length,
      averageDonation: 0,
      uniqueDonors: new Set(),
      byType: {
        monetary: { count: 0, amount: 0 },
        supplies: { count: 0, amount: 0 },
        services: { count: 0, amount: 0 }
      },
      byCampaign: {},
      dailyTrends: {},
      topDonors: [],
      recentDonations: []
    };
    
    donations.forEach(donation => {
      // Total calculations
      if (donation.type === 'monetary') {
        stats.totalAmount += donation.amount;
      }
      
      // Unique donors
      if (!donation.donor?.anonymous) {
        stats.uniqueDonors.add(donation.donor?.email || donation.userInfo?.email);
      }
      
      // By type
      const type = donation.type || 'monetary';
      if (stats.byType[type]) {
        stats.byType[type].count++;
        if (type === 'monetary') {
          stats.byType[type].amount += donation.amount;
        }
      }
      
      // By campaign
      const campaign = donation.campaignId || 'general';
      if (!stats.byCampaign[campaign]) {
        stats.byCampaign[campaign] = { count: 0, amount: 0 };
      }
      stats.byCampaign[campaign].count++;
      if (donation.type === 'monetary') {
        stats.byCampaign[campaign].amount += donation.amount;
      }
      
      // Daily trends
      const date = donation.createdAt.split('T')[0];
      if (!stats.dailyTrends[date]) {
        stats.dailyTrends[date] = { count: 0, amount: 0 };
      }
      stats.dailyTrends[date].count++;
      if (donation.type === 'monetary') {
        stats.dailyTrends[date].amount += donation.amount;
      }
    });
    
    // Calculate derived statistics
    stats.uniqueDonors = stats.uniqueDonors.size;
    stats.averageDonation = stats.totalDonations > 0 ? stats.totalAmount / stats.totalDonations : 0;
    
    // Get top donors (only for admin/official users)
    if (['admin', 'official', 'analyst'].includes(userRole)) {
      const donorAmounts = {};
      donations.forEach(donation => {
        if (!donation.donor?.anonymous && donation.type === 'monetary') {
          const donorKey = donation.donor?.email || donation.userInfo?.email;
          donorAmounts[donorKey] = (donorAmounts[donorKey] || 0) + donation.amount;
        }
      });
      
      stats.topDonors = Object.entries(donorAmounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([email, amount]) => {
          const donation = donations.find(d => 
            (d.donor?.email === email || d.userInfo?.email === email) && !d.donor?.anonymous
          );
          return {
            name: donation?.donor?.name || donation?.userInfo?.name || 'Unknown',
            email,
            totalAmount: amount,
            donationCount: donations.filter(d => 
              (d.donor?.email === email || d.userInfo?.email === email)
            ).length
          };
        });
    }
    
    // Recent donations (last 10, anonymized for non-admin users)
    stats.recentDonations = donations
      .slice(0, 10)
      .map(donation => ({
        id: donation.id,
        amount: donation.amount,
        type: donation.type,
        donor: donation.donor?.anonymous || !['admin', 'official'].includes(userRole)
          ? 'Anonymous Donor'
          : donation.donor?.name || 'Unknown',
        campaign: donation.campaignId,
        createdAt: donation.createdAt,
        timeAgo: getTimeAgo(donation.createdAt)
      }));
    
    // Convert daily trends to array
    stats.dailyTrends = Object.entries(stats.dailyTrends)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.json({
      statistics: stats,
      timeRange,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get donation statistics error:', error);
    res.status(500).json({
      error: 'Failed to retrieve donation statistics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/donations/:id/receipt
 * Generate and download donation receipt
 */
router.get('/:id/receipt', authenticateToken, async (req, res) => {
  try {
    const donationId = req.params.id;
    const userId = req.user.userId || req.user.id;
    const userRole = req.user.role || 'citizen';
    
    const donationDoc = await getDoc(doc(firestore, 'donations', donationId));
    
    if (!donationDoc.exists()) {
      return res.status(404).json({
        error: 'Donation not found'
      });
    }
    
    const donation = donationDoc.data();
    
    // Check permissions - users can only access their own receipts
    if (donation.userId !== userId && !['admin', 'official'].includes(userRole)) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }
    
    // Generate receipt
    const receipt = await generateReceipt(donationId, donation);
    
    res.json({
      receipt
    });
    
  } catch (error) {
    console.error('Generate receipt error:', error);
    res.status(500).json({
      error: 'Failed to generate receipt',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Utility functions
async function simulatePaymentProcessing(paymentData) {
  // Simulate payment gateway processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate 95% success rate
  const success = Math.random() > 0.05;
  
  if (success) {
    return {
      success: true,
      paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reference: `TXN${Date.now()}`,
      fees: Math.round(paymentData.amount * 0.029 * 100) / 100, // 2.9% processing fee
      gateway: 'stripe'
    };
  } else {
    return {
      success: false,
      message: 'Payment failed - insufficient funds or card declined',
      errorCode: 'PAYMENT_DECLINED'
    };
  }
}

async function updateCampaignStats(campaignId, donationData) {
  try {
    // This would typically update campaign-specific statistics
    // For now, we'll just log the update
    console.log(`Updated campaign stats for ${campaignId}:`, {
      amount: donationData.amount,
      type: donationData.type
    });
  } catch (error) {
    console.error('Error updating campaign stats:', error);
  }
}

async function generateReceipt(donationId, donationData) {
  const receiptData = {
    receiptId: `RCP_${donationId.split('_')[1]}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    donationId,
    generatedAt: new Date().toISOString(),
    organization: {
      name: 'Indian National Centre for Ocean Information Services (INCOIS)',
      address: 'Ocean Valley, Pragathi Nagar, Nizampet, Hyderabad - 500090',
      phone: '+91-40-23886047',
      email: 'incois@incois.gov.in',
      pan: 'AAETI0123A',
      registration: '80G Registration Available'
    },
    donation: {
      amount: donationData.amount,
      currency: donationData.currency,
      type: donationData.type,
      campaign: donationData.campaignId,
      paymentMethod: donationData.paymentMethod,
      transactionId: donationData.paymentId,
      date: donationData.createdAt
    },
    donor: {
      name: donationData.donor.name,
      email: donationData.donor.anonymous ? 'Anonymous' : donationData.donor.email,
      phone: donationData.donor.anonymous ? 'Anonymous' : donationData.donor.phone
    },
    taxBenefit: {
      eligible: true,
      section: '80G of Income Tax Act, 1961',
      deduction: '50% of donation amount'
    }
  };
  
  // In a real implementation, this would generate a PDF receipt
  return receiptData;
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const donationTime = new Date(timestamp);
  const diffMs = now - donationTime;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return 'Just now';
}

export default router;