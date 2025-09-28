import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Heart, CreditCard, User, Mail, DollarSign, Shield, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { cn } from '../lib/utils';
import { Alert, AlertDescription } from './ui/alert';

const DonationForm = ({ onDonationSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    donorEmail: '',
    anonymous: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleAnonymousChange = (checked) => {
    setFormData(prev => ({ ...prev, anonymous: checked, donorName: '', donorEmail: '' }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post('/api/donations/process', formData);
      toast.success('Thank you for your generous donation!');
      if (onDonationSuccess) onDonationSuccess(response.data.donation);
      setFormData({ amount: '', donorName: '', donorEmail: '', anonymous: false });
    } catch (error) {
      console.error('Failed to process donation:', error);
      toast.error(error.response?.data?.error || 'Donation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const suggestedAmounts = [500, 1000, 2500, 5000];

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground text-center p-6">
        <div className="mx-auto bg-primary-foreground/10 rounded-full p-3 w-fit">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl mt-2">Support Relief Efforts</CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Your contribution helps us protect coastal communities.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-8">
          <div className="space-y-4 text-center">
            <Label className="text-base font-semibold">Choose Donation Amount (INR)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {suggestedAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={formData.amount === amount.toString() ? 'default' : 'outline'}
                  className="h-auto py-3"
                  onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                >
                  <span className="text-lg font-bold">₹{amount.toLocaleString()}</span>
                </Button>
              ))}
            </div>
            <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Or enter a custom amount"
                    className="pl-10 text-center text-lg"
                    min="10"
                    required
                />
            </div>
          </div>

          <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donorName">Full Name {!formData.anonymous && '*'}</Label>
                <Input
                  id="donorName"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleInputChange}
                  placeholder="e.g. Jane Doe"
                  required={!formData.anonymous}
                  disabled={formData.anonymous}
                  className="aria-disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donorEmail">Email Address {!formData.anonymous && '*'}</Label>
                <Input
                  id="donorEmail"
                  name="donorEmail"
                  type="email"
                  value={formData.donorEmail}
                  onChange={handleInputChange}
                  placeholder="jane.doe@example.com"
                  required={!formData.anonymous}
                  disabled={formData.anonymous}
                  className="aria-disabled:opacity-50"
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="anonymous" checked={formData.anonymous} onCheckedChange={handleAnonymousChange} />
                <Label htmlFor="anonymous" className="text-sm font-normal cursor-pointer">
                  I'd like to donate anonymously
                </Label>
              </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              All payments are processed securely. Your financial details are never stored on our servers.
            </AlertDescription>
          </Alert>

        </CardContent>
        <CardFooter className="p-6 bg-secondary/30 border-t">
          <Button type="submit" disabled={submitting} className="w-full text-lg py-6">
            {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
            ) : (
                <Heart className="w-5 h-5 mr-3" />
            )}
            {submitting ? 'Processing Donation...' : `Donate ₹${formData.amount || '0'}`}
            {!submitting && <ArrowRight className="w-5 h-5 ml-3" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DonationForm;
