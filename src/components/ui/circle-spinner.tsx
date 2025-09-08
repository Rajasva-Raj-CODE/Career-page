import React from 'react';

const cn = (...classes: (string | undefined | false | null)[]) => {
    return classes.filter(Boolean).join(' ');
};

type LoadingSpinnerProps = {
    className?: string;
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin stroke-black dark:stroke-white", className)}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
};
