export function Logo({
  className,
  width,
  height,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <img
      src="/insurex-logo.png"
      alt="INSUREX Logo"
      width={width}
      height={height}
      className={className}
    />
  );
} 