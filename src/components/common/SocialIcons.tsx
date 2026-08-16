// lucide-react intentionally ships no brand/social logos — these are small
// hand-drawn stand-ins so the footer doesn't need a whole icon-library
// dependency for three glyphs.
interface IconProps {
  size?: number;
}

export function FacebookIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 8.5h2.5V5h-2.5c-2.21 0-4 1.79-4 4v2H9v3.5h2v7h3.5v-7h2.3l.7-3.5h-3V9c0-.28.22-.5.5-.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function LinkedinIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8" cy="8.5" r="1.1" fill="currentColor" />
      <path d="M8 11v6M12 11v6M12 13.5c0-1.5 1-2.5 2.3-2.5S17 12 17 13.5V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
