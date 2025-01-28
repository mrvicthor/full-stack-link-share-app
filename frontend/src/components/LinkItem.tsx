import LinkIcon from "./LinkIcon";
import { getMatchingColor } from "@/utils/getMatchingColors";
import { getIcon } from "@/utils/getIcon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { itemVariants } from "@/helpers";
import { motion } from "motion/react";
import EditForm from "./EditForm";

type Props = {
  id: string;
  url: string;
  platform: string;
};

const LinkItem = ({ id, url, platform }: Props) => {
  const color = getMatchingColor(platform);
  const icon = getIcon(platform);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.li
          variants={itemVariants}
          style={{ backgroundColor: color }}
          className={`p-2 rounded-md flex items-center cursor-pointer ${
            platform === "Frontend Mentor" ? "border text-black" : "text-white"
          }`}
        >
          <LinkIcon
            color={platform === "Frontend Mentor" ? "black" : "white"}
            pathString={icon}
          />
          <span className=" block text-xs">
            {platform === "Youtube" ? "YouTube" : platform}
          </span>

          <a
            href={`${url}`}
            target="_blank"
            rel="noopener"
            className={`${
              platform === "Frontend Mentor" ? "text-black" : "text-white"
            } ml-auto`}
          >
            <LinkIcon
              color={platform === "Frontend Mentor" ? "black" : "white"}
              pathString="M2.667 7.333v1.334h8L7 12.333l.947.947L13.227 8l-5.28-5.28L7 3.667l3.667 3.666h-8Z"
            />
          </a>
        </motion.li>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit or Delete link</DialogTitle>
          <DialogDescription>
            Make changes to your link here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditForm id={id} platform={platform} url={url} />
      </DialogContent>
    </Dialog>
  );
};

export default LinkItem;
