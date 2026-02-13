'use client';

import React from 'react';

type VariantContainer = 'primary' | 'secondary';

interface PageContainerProps {
  children: React.ReactNode;
  variant: VariantContainer;
}

const variantStyles = {
  primary: 'md:p-8 max-w-7xl mx-auto border-2 border-red-500 space-y-6',
  secondary: 'md:p-8 max-w-7xl border-2 border-blue-500 mx-auto',
};

export default function PageContainer({
  children,
  variant = 'primary',
}: PageContainerProps) {
  const parentBg = variant === 'primary' ? 'bg-[#FDFCFF]' : '';

  return (
    <div className={`min-h-screen border-2 p-6 ${parentBg}`}>
      <div className={variantStyles[variant]}>{children}</div>
    </div>
  );
}
