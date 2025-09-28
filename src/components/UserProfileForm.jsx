import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CardFooter } from './ui/card';
import { Button } from './ui/button';

const UserProfileForm = ({ formData, handleInputChange, submitting, handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                    </div>
                </div>
            </div>
            <CardFooter className="flex justify-end mt-6">
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving Changes...' : 'Save Changes'}
                </Button>
            </CardFooter>
        </form>
    );
};

export default UserProfileForm;
