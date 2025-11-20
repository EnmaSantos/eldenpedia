'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthModal } from '@/components/auth-modal';

export default function LoginPage() {
  const router = useRouter();
  // We keep it open. If the user closes it, we redirect to home.
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <AuthModal isOpen={isOpen} onClose={handleClose} />
    </div>
  );
}

