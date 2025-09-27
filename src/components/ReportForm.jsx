import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { hazardReportService } from '../services/hazardReportService.js';

export const ReportForm = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        type: '',
        severity: '',
        title: '',
        description: '',
        location: '',
    });
    const [files, setFiles] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            await hazardReportService.submitReport({
                ...formData,
                userId: user.id,
                reporterName: user.fullName,
                reporterEmail: user.email,
                mediaFiles: files,
            });
            setSuccess('Hazard report submitted successfully!');
            setFormData({
                type: '',
                severity: '',
                title: '',
                description: '',
                location: '',
            });
            setFiles(null);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Report a Hazard</CardTitle>
                <CardDescription>Submit a report to alert authorities about a potential hazard.</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>{success}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="type">Hazard Type</Label>
                            <Select name="type" onValueChange={(value) => handleSelectChange('type', value)} value={formData.type}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select hazard type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tsunami">Tsunami</SelectItem>
                                    <SelectItem value="cyclone">Cyclone</SelectItem>
                                    <SelectItem value="storm_surge">Storm Surge</SelectItem>
                                    <SelectItem value="high_waves">High Waves</SelectItem>
                                    <SelectItem value="flooding">Flooding</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="severity">Severity Level</Label>
                             <Select name="severity" onValueChange={(value) => handleSelectChange('severity', value)} value={formData.severity}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select severity level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="e.g., High waves at Marina Beach" value={formData.title} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Provide a detailed description of the hazard..." value={formData.description} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" placeholder="e.g., Marina Beach, Chennai" value={formData.location} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="media">Upload Media (Photos/Videos)</Label>
                        <div className="flex items-center gap-4">
                            <Input id="media" type="file" multiple onChange={handleFileChange} className="hidden" />
                            <Label htmlFor="media" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                                <Upload className="mr-2 h-4 w-4" />
                                {files ? `${files.length} file(s) selected` : 'Choose files'}
                            </Label>
                        </div>
                        {files && (
                             <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
                                {Array.from(files).map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
