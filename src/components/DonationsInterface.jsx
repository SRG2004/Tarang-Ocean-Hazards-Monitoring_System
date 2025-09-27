import React, { useState } from 'react';
import { 
  Heart,
  CreditCard,
  DollarSign,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  Gift,
  Globe,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';

export const DonationsInterface = ({ user }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationType, setDonationType] = useState('one-time');
  const [showSuccess, setShowSuccess] = useState(false);

  const campaigns = [
    {
      id: '1',
      title: 'Cyclone Yaas Relief Fund',
      description: 'Emergency relief for coastal communities affected by Cyclone Yaas in West Bengal and Odisha.',
      target: 500000,
      raised: 387500,
      donors: 1245,
      daysLeft: 8,
      image: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Relief+Campaign',
      location: 'West Bengal & Odisha',
      urgent: true,
      category: 'relief'
    },
    {
      id: '2',
      title: 'Coast Guard Rescue Equipment',
      description: 'Help us purchase modern rescue equipment for coast guard operations in Gujarat maritime region.',
      target: 750000,
      raised: 234000,
      donors: 567,
      daysLeft: 22,
      image: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Relief+Campaign',
      location: 'Gujarat Coast',
      urgent: false,
      category: 'equipment'
    },
    {
      id: '3',
      title: 'Ocean Research Initiative',
      description: 'Support research on changing ocean patterns and their impact on coastal communities.',
      target: 300000,
      raised: 198750,
      donors: 892,
      daysLeft: 15,
      image: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Relief+Campaign',
      location: 'Pan-India',
      urgent: false,
      category: 'research'
    },
    {
      id: '4',
      title: 'Community Warning Systems',
      description: 'Install early warning systems in remote coastal villages across Kerala and Karnataka.',
      target: 450000,
      raised: 123000,
      donors: 334,
      daysLeft: 30,
      image: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Relief+Campaign',
      location: 'Kerala & Karnataka',
      urgent: true,
      category: 'community'
    }
  ];

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  const handleDonation = () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (amount && selectedCampaign) {
      // Simulate payment processing
      setTimeout(() => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      }, 2000);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      relief: Heart,
      equipment: Target,
      research: Globe,
      community: Users
    };
    return icons[category] || Heart;
  };

  const getCategoryColor = (category) => {
    const colors = {
      relief: 'bg-red-100 text-red-700',
      equipment: 'bg-blue-100 text-blue-700',
      research: 'bg-green-100 text-green-700',
      community: 'bg-purple-100 text-purple-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
  const totalDonors = campaigns.reduce((sum, campaign) => sum + campaign.donors, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support Ocean Safety</h1>
            <p className="text-red-100 mt-2">Help protect coastal communities and marine ecosystems</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-red-100">Total Raised</div>
            <div className="text-2xl font-bold">₹{(totalRaised / 100000).toFixed(1)}L</div>
            <div className="text-sm text-red-100">{totalDonors} donors</div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in-scale">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Thank you for your donation!</h3>
              <p className="text-green-700">Your contribution will help protect coastal communities.</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Active Campaigns</h3>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{campaigns.length}</div>
          <p className="text-gray-500 text-sm">Seeking support</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Urgent Needs</h3>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">
            {campaigns.filter(c => c.urgent).length}
          </div>
          <p className="text-gray-500 text-sm">Need immediate help</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Communities Helped</h3>
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">127</div>
          <p className="text-gray-500 text-sm">This year</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Impact Score</h3>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-2">4.8</div>
          <p className="text-gray-500 text-sm">Donor satisfaction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns List */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Campaigns</h2>
            <div className="space-y-6">
              {campaigns.map((campaign) => {
                const CategoryIcon = getCategoryIcon(campaign.category);
                const progressPercentage = (campaign.raised / campaign.target) * 100;
                
                return (
                  <div 
                    key={campaign.id}
                    className={`border-2 rounded-xl p-6 transition-all cursor-pointer hover:shadow-lg ${
                      selectedCampaign === campaign.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedCampaign(campaign.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                          {campaign.urgent && (
                            <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                              Urgent
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(campaign.category)}`}>
                            {campaign.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{campaign.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{campaign.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{campaign.daysLeft} days left</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{campaign.donors} donors</span>
                          </div>
                        </div>
                      </div>
                      
                      <CategoryIcon className="w-8 h-8 text-blue-600 ml-4 flex-shrink-0" />
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          ₹{(campaign.raised / 1000).toFixed(0)}k raised of ₹{(campaign.target / 1000).toFixed(0)}k goal
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {progressPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Donation Panel */}
        <div className="lg:col-span-1">
          <div className="card-feature sticky top-6">
            <div className="flex items-center space-x-3 mb-6">
              <Gift className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold">Make a Donation</h3>
            </div>

            {!selectedCampaign && (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a campaign to donate</p>
              </div>
            )}

            {selectedCampaign && (
              <div className="space-y-6">
                {/* Donation Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Donation Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDonationType('one-time')}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        donationType === 'one-time'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <DollarSign className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">One-time</span>
                    </button>
                    <button
                      onClick={() => setDonationType('monthly')}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        donationType === 'monthly'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <Calendar className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Monthly</span>
                    </button>
                  </div>
                </div>

                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select Amount</label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          selectedAmount === amount
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <span className="text-sm font-medium">₹{amount}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Amount</label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      placeholder="Enter amount"
                      className="input"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="payment" value="card" className="mr-3" defaultChecked />
                      <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="payment" value="upi" className="mr-3" />
                      <span className="w-5 h-5 mr-2 bg-purple-600 rounded text-white flex items-center justify-center text-xs font-bold">₹</span>
                      <span className="font-medium">UPI</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="payment" value="netbanking" className="mr-3" />
                      <Globe className="w-5 h-5 mr-2 text-green-600" />
                      <span className="font-medium">Net Banking</span>
                    </label>
                  </div>
                </div>

                {/* Donation Impact */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Your Impact</p>
                      <p className="text-blue-700">
                        ₹{selectedAmount || customAmount || '0'} can help provide emergency supplies 
                        for {Math.floor((selectedAmount || parseInt(customAmount) || 0) / 500) || 0} families
                      </p>
                    </div>
                  </div>
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonation}
                  disabled={!selectedCampaign || (!selectedAmount && !customAmount)}
                  className="w-full btn-success py-4 text-lg font-semibold"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Donate ₹{selectedAmount || customAmount || '0'}
                </button>

                <div className="text-xs text-gray-500 text-center">
                  <p>🔒 Secure payment • 80G tax exemption available</p>
                  <p>Managed by certified NGO partners</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};