type Props = { name: string };

function initials(name: string): string {
  const parts = name.replace(/[^A-Za-z가-힣\s.]/g, '').split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name }: Props) {
  return <div className="avatar">{initials(name)}</div>;
}
