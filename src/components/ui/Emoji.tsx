// components/ui/Emoji.tsx
type EmojiProps = {
  label: string;
  symbol: string;
  className?: string;
};
export function Emoji({ label, symbol, className }: EmojiProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-block align-middle select-none ${className}`}
      style={{ lineHeight: 1 }}
    >
      {symbol}
    </span>
  );
}
