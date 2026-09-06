/**
 * Helper to get normalized website URL for a company
 */
export function getCompanyWebsiteUrl(company) {
  if (!company) return '';
  const url = company.websiteUrl || company.website;
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
