import { SelectItem } from "./ui/select";

import LinkIcon from "./LinkIcon";
type PlatformProps = {
  title: string;
  icon: string;
};
const Platform = ({ title, icon }: PlatformProps) => {
  return (
    <SelectItem value={title} className="py-2">
      <div className="flex items-center text-[#737373]">
        <div className="pt-[0.2rem]">
          <LinkIcon pathString={icon} />
        </div>

        <span className="inline-block text-md">{title}</span>
      </div>
    </SelectItem>
  );
};

export default Platform;
