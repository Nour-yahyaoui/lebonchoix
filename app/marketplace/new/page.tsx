// app/marketplace/new/page.tsx
'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';

export default function NewItemPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Post New Property</h1>
        {/* Your form here */}
      </div>
    </ProtectedRoute>
  );
}