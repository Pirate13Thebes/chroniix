interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
}

export function Avatar({ src, name, size = 36 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="avatar"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--chronix-navy)',
        color: '#fff',
        fontSize: size * 0.38,
        fontWeight: 700,
      }}
    >
      {initials}
    </div>
  );
}
