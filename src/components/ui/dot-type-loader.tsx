import React from 'react';

const DotTypingLoader = () => {
    return (
        <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></span>
        </div>
    );
};

export default DotTypingLoader;
