import { getIcon } from "@/utils/getIcon";
import { getMatchingColor } from "@/utils/getMatchingColors";
import LinkIcon from "./LinkIcon";

type Props = {
  url: string;
  title: string;
};
const CardLink = ({ url, title }: Props) => {
  const color = getMatchingColor(title);
  const icon = getIcon(title);
  return (
    <li
      style={{ backgroundColor: color }}
      className={`p-2 rounded-md  cursor-pointer w-[14.8125rem] ${
        title === "Frontend Mentor" ? "border text-black" : "text-white"
      }`}
    >
      <a
        href={`${url}`}
        target="_blank"
        rel="noopener"
        className={`flex items-center `}
      >
        <LinkIcon
          color={title === "Frontend Mentor" ? "black" : "white"}
          pathString={icon}
        />
        <span className="block text-xs">
          {title === "Youtube" ? "YouTube" : title}
        </span>
        <div className="ml-auto">
          <LinkIcon
            color={title === "Frontend Mentor" ? "black" : "white"}
            pathString="M2.667 7.333v1.334h8L7 12.333l.947.947L13.227 8l-5.28-5.28L7 3.667l3.667 3.666h-8Z"
          />
        </div>
      </a>
    </li>
  );
};

export default CardLink;
