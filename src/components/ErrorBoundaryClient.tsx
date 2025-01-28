// src/components/ErrorBoundaryClient.tsx
'use client';

import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';

const ErrorBoundaryClient = ({ children }: { children: React.ReactNode }) => {
    return <SentryErrorBoundary
        fallback={({ error, resetError }) => {
            const errorMessage =
                error instanceof Error ? error.message : "An unknown error occurred";
            return (
                <div>
                    <h1>An error occurred</h1>
                    <p>{errorMessage}</p>
                    <button onClick={resetError}>Try again</button>
                </div>
            );
        }}
    >
        {children}
    </SentryErrorBoundary>;
};

export default ErrorBoundaryClient;
