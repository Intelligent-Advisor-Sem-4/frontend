import React from 'react';
import {Skeleton} from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <div className={'px-5 py-5 flex flex-col gap-4'}>
            <Skeleton className={'w-20 h-6'} />
            <Skeleton className={'w-full h-8'} />
            <Skeleton className={'w-full h-96'} />
        </div>
    );
};

export default Loading;