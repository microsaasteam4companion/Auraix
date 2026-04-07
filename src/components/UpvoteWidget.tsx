"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface UpvoteWidgetProps {
  userId?: string | null;
  email?: string | null;
}

export default function UpvoteWidget({ userId, email }: UpvoteWidgetProps) {
  const [remountKey, setRemountKey] = useState(0);

  useEffect(() => {
    // Force hard remount for cleanup when identity changes
    setRemountKey(k => k + 1);
    
    // Proactive cleanup of existing floating elements
    if (typeof window !== 'undefined' && (window as any).__upvote_cleanup) {
      (window as any).__upvote_cleanup();
    }
  }, [userId, email]);

  return (
    <div key={remountKey}>
      <div 
        className="upvote-widget"
        data-application-id="69cfff1ed282b633a3387f58"
        data-user-id={userId || ''}
        data-email={email || ''}
        data-position="right"
        data-theme="light"
        data-logo-url="/logo.png"         // Optional: your logo
        data-product-overview="..."       // Optional
        data-about-text="..."             // Optional
        data-faqs='[{"question":"Q?","answer":"A."}]' // Required for FAQs
      />
      <Script 
        src="https://upvote.entrext.com/widget.js" 
        strategy="afterInteractive"
      />
    </div>
  );
}
