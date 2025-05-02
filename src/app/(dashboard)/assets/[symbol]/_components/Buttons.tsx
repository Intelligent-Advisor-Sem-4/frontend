'use client';

import React from 'react';
import {PlusCircle} from "lucide-react";
import {Button} from "@/components/ui/button";


// Handle add to DB (server action would go here in a real implementation)
const handleAddToDb = async () => {
    // This would call a server action to add the asset to DB
    console.log('Adding to DB');
};

const Add = () => {
    return (
        <Button onClick={handleAddToDb} className="flex items-center gap-2">
            <PlusCircle size={16}/>
            Add to Database
        </Button>
    );
};

export  {Add};