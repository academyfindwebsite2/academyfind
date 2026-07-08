"use client";

interface NewsletterCTAProps {
  onSubscribe?: (email: string) => Promise<void>;
  title?: string;
  description?: string;
}

export default function NewsletterCTA(props: NewsletterCTAProps) {
  // Newsletter is currently disabled
  return null;
}
