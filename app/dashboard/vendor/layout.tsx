import { requireRole } from '@/lib/core/server';
import React from 'react';
import { Loader2 } from 'lucide-react';

export const instant = false;

const VendorAuthGuard = async ({ children }: { children: React.ReactNode }) => {
    await requireRole('vendor')
    return children;
};

const VendorDashboardLayout = ({children}:{children:React.ReactNode}) => {
    return (
        <React.Suspense
            fallback={
                <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F4EF]">
                    <Loader2 className="animate-spin text-[#C98291]" size={30} />
                </div>
            }
        >
            <VendorAuthGuard>{children}</VendorAuthGuard>
        </React.Suspense>
    );
};

export default VendorDashboardLayout;
