import React from 'react';

/**
 * Helper to determine clean company icon symbol
 */
export function getCompanyIconSymbol(company) {
  if (!company) return '🏢';
  const logo = company.logoUrl || company.logo;

  // If logo is a short icon string or emoji (not starting with http:// or / or data:)
  if (logo && typeof logo === 'string' && !logo.startsWith('http') && !logo.startsWith('/') && !logo.startsWith('data:')) {
    return logo;
  }

  // Fallback defaults based on company slug or name
  const slug = (company.slug || company.name || '').toLowerCase();
  if (slug.includes('workable')) return '💼';
  if (slug.includes('ashby')) return '⚡';
  if (slug.includes('whitecarrot')) return '🥕';

  return '🏢';
}

/**
 * Reusable Company Logo Icon Badge component
 */
export default function CompanyLogoIcon({ company, size = 'md', className = '' }) {
  const icon = getCompanyIconSymbol(company);

  const sizeClasses = {
    sm: 'w-8 h-8 text-base rounded-lg',
    md: 'w-10 h-10 text-xl rounded-xl',
    lg: 'w-14 h-14 text-2xl rounded-2xl',
  }[size] || 'w-10 h-10 text-xl rounded-xl';

  return (
    <div
      className={`shrink-0 flex items-center justify-center font-normal bg-[color-mix(in_srgb,var(--brand-primary,#6366f1)_18%,transparent)] border border-[color-mix(in_srgb,var(--brand-primary,#6366f1)_35%,transparent)] shadow-sm ${sizeClasses} ${className}`}
    >
      <span>{icon}</span>
    </div>
  );
}
