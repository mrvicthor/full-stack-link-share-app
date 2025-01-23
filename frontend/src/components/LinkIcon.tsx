interface SVGProps {
  color?: string;
  pathString: string;
}
const LinkIcon = ({ color, pathString }: SVGProps) => {
  return (
    <svg
      width={21}
      height={20}
      xmlns="http://www.w3.org/2000/svg"
      color={color}
    >
      <path d={pathString} fill="currentColor" />
    </svg>
  );
};

export default LinkIcon;
