import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Shield, User, Mail, Phone, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Alert, AlertDescription } from './ui/alert';

const VolunteerForm = ({ onVolunteerSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: '',
        agreedToTerms: false,
    });
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (checked) => {
        setFormData(prev => ({ ...prev, agreedToTerms: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.agreedToTerms) {
            toast.error('You must agree to the terms and conditions.');
            return;
        }
        setSubmitting(true);
        try {
            // Mock API call to submit volunteer application
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Volunteer Application Submitted:', formData);
            toast.success('Thank you for volunteering! We will be in touch soon.');
            setFormData({ fullName: '', email: '', phone: '', message: '', agreedToTerms: false });
            if (onVolunteerSuccess) onVolunteerSuccess();
        } catch (error) {
            toast.error('Submission failed. Please try again later.');
            console.error('Volunteer form submission error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center bg-primary text-primary-foreground p-6">
                <div className="mx-auto bg-primary-foreground/10 rounded-full p-3 w-fit">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mt-2">Join as a Volunteer</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                    Become a vital part of our community safety network.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Alex Smith" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="alex.smith@example.com" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+91 12345 67890" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Why do you want to join? (Optional)</Label>
                        <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Share your motivation or skills..." />
                    </div>
                    
                    <Alert variant="info">
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                            Your information will be kept confidential and used only for coordinating volunteer activities.
                        </AlertDescription>
                    </Alert>

                    <div className="flex items-start space-x-3 pt-2">
                        <Checkbox id="terms" checked={formData.agreedToTerms} onCheckedChange={handleCheckboxChange} />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                                I agree to the terms and conditions
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                You agree to be contacted for volunteer opportunities and to follow our community guidelines.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-6 bg-secondary/30 border-t">
                    <Button type="submit" disabled={submitting || !formData.agreedToTerms} className="w-full text-lg py-6">
                         {submitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                        ) : (
                            <Send className="w-5 h-5 mr-3" />
                        )}
                        {submitting ? 'Submitting Application...' : 'Submit Application'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default VolunteerForm;
