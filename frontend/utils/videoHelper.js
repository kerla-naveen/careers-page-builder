/**
 * Extract YouTube Video ID from various YouTube URL formats
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/);
  return match ? match[1] : null;
}
