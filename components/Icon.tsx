interface IconProps {
  name: string;
  size?: number;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  fill?: boolean;
  grade?: -25 | 0 | 200;
  className?: string;
  style?: React.CSSProperties;
}

export default function Icon({
  name,
  size = 24,
  weight = 400,
  fill = false,
  grade = 0,
  className = "",
  style,
}: IconProps) {
  return (
    <span
      className={`material-symbols-rounded ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${size}`,
        lineHeight: 1,
        userSelect: "none",
        display: "inline-block",
        verticalAlign: "middle",
        ...style,
      }}
    >
      {name}
    </span>
  );
}
