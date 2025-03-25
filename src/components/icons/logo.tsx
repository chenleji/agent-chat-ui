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
      src="https://picx.zhimg.com/v2-62fcd0952553090c6addd538e8c4a2fe_xll.jpg?source=32738c0c&needBackground=1"
      alt="Logo"
      width={width}
      height={height}
      className={className}
    />
  );
} 