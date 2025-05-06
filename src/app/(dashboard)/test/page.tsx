'use client';

import React from 'react';
import {useAPI} from '@/hooks/useAPI';

const Page = () => {
    const {data: message, error, isLoading} = useAPI<string>('/', {
        method: 'GET',
    });

    if (isLoading) return <p>Loading message...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return <div>
        <h1>Test Page</h1>
        {message}
    </div>;
};

export default Page;
