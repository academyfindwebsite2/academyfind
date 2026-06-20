'use client';
import { trackInstituteView } from '@/lib/User/manager/track';
import { useEffect } from 'react';

export default function ViewTracker({ instituteId }: { instituteId: string }) {
  useEffect(() => {
    // Jaise hi page load hoga, background me count badh jayega bina page slow kiye
    trackInstituteView(instituteId);
  }, [instituteId]);

  return null; // UI pe kuch nahi dikhega
}