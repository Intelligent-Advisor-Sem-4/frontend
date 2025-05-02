import React from 'react';

const Page = () => {
    return (
        <div className="flex flex-col flex-grow h-full gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl"/>
                <div className="bg-muted/50 aspect-video rounded-xl"/>
                <div className="bg-muted/50 aspect-video rounded-xl"/>
            </div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"/>
        </div>
    );
};

export default Page;