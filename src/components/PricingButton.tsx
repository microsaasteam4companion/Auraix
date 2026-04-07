'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

interface PricingButtonProps {
  productId: string;
  cta: string;
  highlight?: boolean;
}

export default function PricingButton({ productId, cta, highlight }: PricingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { userId } = useAuth();
  
  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (productId === 'free' || !userId) {
      router.push('/sign-up');
      return;
    }

    // Redirect directly to the Dodo Payments Checkout Link with the given Product ID
    // We append the userId to the metadata so that the webhook can upgrade the user upon success!
    const checkoutUrl = `https://checkout.dodopayments.com/buy/${productId}?quantity=1&metadata_userId=${userId}`;
    window.location.href = checkoutUrl;
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      style={{
        width: '100%',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '14px',
        padding: '13px 20px',
        borderRadius: '12px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s',
        border: highlight ? 'none' : '1px solid #1E293B',
        ...(highlight
          ? { background: 'linear-gradient(135deg, #A78BFA, #F472B6)', color: '#fff', boxShadow: '0 4px 20px rgba(167,139,250,0.3)' }
          : { background: 'transparent', color: '#F1F5F9' }),
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {isLoading ? 'Loading...' : cta}
    </button>
  );
}
