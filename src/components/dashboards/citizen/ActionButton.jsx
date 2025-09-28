import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { cn } from '../../../lib/utils';

const ActionButton = ({ title, icon: Icon, onClick, className, description }) => (
    <Card className={cn('group hover:bg-primary/90 transition-all duration-300 cursor-pointer', className)} onClick={onClick}>
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-white/20 transition-all">
                <Icon className="w-8 h-8 text-primary group-hover:text-white" />
            </div>
            <h3 className="text-lg font-semibold text-primary group-hover:text-white">{title}</h3>
            <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/80 mt-1">{description}</p>
        </CardContent>
    </Card>
);

export default ActionButton;
