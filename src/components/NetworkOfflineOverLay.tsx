'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

export default function NetworkOfflineOverlay() {
    const [isOffline, setIsOffline] = useState(false);
    const [checking, setChecking] = useState(false);

    const checkConnection = async () => {
        setChecking(true);
        try {
            // Ping a lightweight public resource
            await fetch('https://www.google.com/favicon.ico', {
                method: 'HEAD',
                mode: 'no-cors',
            });
            setIsOffline(false);
        } catch {
            setIsOffline(true);
        } finally {
            setChecking(false);
        }
    };

    useEffect(() => {
        // Initial check on mount
        checkConnection();

        const updateStatus = () => {
            // Use actual ping instead of relying solely on navigator.onLine
            checkConnection();
        };

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center space-y-4">
                <Image
                    src="/wreck-it-ralph-ralph.gif"
                    alt="No Internet"
                    width={450}
                    height={450}
                    priority
                    className="drop-shadow-xl rounded-lg"
                />

                <Alert variant="destructive" className="w-[448px] flex flex-col items-center text-center">
                    <AlertTitle>You&#39;re Offline</AlertTitle>
                    <AlertDescription>
                        Please check your internet connection and try again.
                    </AlertDescription>

                    <div className="w-full mt-4 flex justify-center">
                        <Button
                            onClick={checkConnection}
                            disabled={checking}
                            variant="outline"
                        >
                            {checking ? 'Checking...' : 'Retry'}
                        </Button>
                    </div>

                </Alert>
            </div>
        </div>
    );
}
