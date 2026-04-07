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

    try {
      setIsLoading(true);
      const response = await fetch('/api/checkout/dodo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create checkout session');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received from Dodo.');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Checkout Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
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
