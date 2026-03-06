'use client';

import { ModerationDashboard } from '@/components/admin/ModerationDashboard';
import { useRole } from '@/contexts/RoleContext';

// Mock data - replace with actual API calls
const mockStats = {
  pending: 12,
  approved: 45,
  rejected: 3,
  reported: 5,
};

const mockPendingItems = [
  {
    id: '1',
    type: 'post' as const,
    content: 'This is a sample post that needs moderation review...',
    author: 'John Doe',
    createdAt: new Date(),
    priority: 'high' as const,
  },
  {
    id: '2',
    type: 'recognition' as const,
    content: 'Recognition post for outstanding work...',
    author: 'Jane Smith',
    createdAt: new Date(),
    priority: 'medium' as const,
  },
  {
    id: '3',
    type: 'comment' as const,
    content: 'Comment that requires review...',
    author: 'Bob Johnson',
    createdAt: new Date(),
    priority: 'low' as const,
  },
];

export default function AdminDashboardPage() {
  const { isAdminMode } = useRole();

  if (!isAdminMode) {
    return null;
  }

  const handleApprove = (id: string) => {
    console.log('Approve:', id);
    // Implement approval logic
  };

  const handleReject = (id: string) => {
    console.log('Reject:', id);
    // Implement rejection logic
  };

  const handleReview = (id: string) => {
    console.log('Review:', id);
    // Navigate to review page
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">
          Moderation Dashboard
        </h1>
        <p className="text-text-secondary">
          Review and moderate content across the platform
        </p>
      </div>

      <ModerationDashboard
        stats={mockStats}
        pendingItems={mockPendingItems}
        onApprove={handleApprove}
        onReject={handleReject}
        onReview={handleReview}
      />
    </div>
  );
}
