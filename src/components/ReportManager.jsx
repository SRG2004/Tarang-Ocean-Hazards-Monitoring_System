import React, { useEffect, useState } from 'react';
import { hazardReportService } from '../services/hazardReportService.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const ReportManager = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            const fetchedReports = await hazardReportService.getReports();
            setReports(fetchedReports);
            setLoading(false);
        };
        fetchReports();
    }, []);

    const handleStatusChange = async (reportId, newStatus) => {
        await hazardReportService.updateReportStatus(reportId, newStatus);
        const updatedReports = reports.map(report => 
            report.id === reportId ? { ...report, status: newStatus } : report
        );
        setReports(updatedReports);
    };

    return (
        <div>
            {loading ? (
                <p>Loading reports...</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Reported By</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>{report.title}</TableCell>
                                <TableCell>{report.type}</TableCell>
                                <TableCell>
                                    <Badge variant={report.severity}>{report.severity}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={report.status}>{report.status}</Badge>
                                </TableCell>
                                <TableCell>{report.userInfo.name}</TableCell>
                                <TableCell>
                                    <Select onValueChange={(value) => handleStatusChange(report.id, value)} value={report.status}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Update status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unverified">Unverified</SelectItem>
                                            <SelectItem value="verified">Verified</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};
