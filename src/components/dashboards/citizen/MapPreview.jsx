import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { MinimalHazardMap } from '../../MinimalHazardMap';

const MapPreview = () => (
    <Card>
        <CardHeader>
            <CardTitle>Hazard Map Preview</CardTitle>
            <CardDescription>A glimpse of the current hazard landscape.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] p-0">
            <MinimalHazardMap height="100%" showControls={false} />
        </CardContent>
    </Card>
);

export default MapPreview;
