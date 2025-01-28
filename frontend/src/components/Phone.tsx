import phoneLogo from "@/assets/images/illustration-phone-mockup.svg";
import useLinks from "@/hooks/useLinks";
import Loading from "./Loading";
import LinkItem from "./LinkItem";
import { motion } from "motion/react";
import { containerVariants } from "@/helpers";

type Link = {
  _id: string;
  platform: string;
  url: string;
};
const Phone = () => {
  const { user, isLoading } = useLinks();

  const { firstName, lastName, email, image, links } =
    user?.data.userToReturn || {};
  const fullName = `${firstName} ${lastName}`;

  return isLoading ? (
    <Loading />
  ) : (
    <div className="flex items-center justify-center h-full">
      {!user?.data ? (
        <img
          src={phoneLogo}
          alt="phone image"
          className="w-[19.1875rem] h-[32rem]"
        />
      ) : (
        <div className="phone-container relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="308"
            height="500"
            fill="none"
            viewBox="0 0 308 632"
          >
            <path
              stroke="#737373"
              d="M1 54.5C1 24.953 24.953 1 54.5 1h199C283.047 1 307 24.953 307 54.5v523c0 29.547-23.953 53.5-53.5 53.5h-199C24.953 631 1 607.047 1 577.5v-523Z"
            />
            <path
              fill="#fff"
              stroke="#737373"
              d="M12 55.5C12 30.923 31.923 11 56.5 11h24C86.851 11 92 16.149 92 22.5c0 8.008 6.492 14.5 14.5 14.5h95c8.008 0 14.5-6.492 14.5-14.5 0-6.351 5.149-11.5 11.5-11.5h24c24.577 0 44.5 19.923 44.5 44.5v521c0 24.577-19.923 44.5-44.5 44.5h-195C31.923 621 12 601.077 12 576.5v-521Z"
            />
          </svg>
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="phone-content absolute lg:top-[13.5rem] left-[50%] -translate-x-[50%] w-[11.8125rem] space-y-3 overflow-y-auto h-[15rem]"
          >
            {links.map((link: Link) => (
              <LinkItem
                key={link._id}
                id={link._id}
                platform={link.platform}
                url={link.url}
              />
            ))}
            {[...Array(4)].map(
              (_, index) =>
                links.length < index + 2 && (
                  <li
                    key={index}
                    className="bg-[#d9d9d9] opacity-50 h-8 rounded-md"
                  ></li>
                )
            )}
          </motion.ul>
          {Object.keys(image).length !== 0 ? (
            <div className="absolute h-20 w-20 overflow-hidden top-16 rounded-full left-[50%] -translate-x-[50%]">
              <img
                src={image}
                alt={`${firstName}-image`}
                width="500"
                height="500"
                loading="lazy"
                className="rounded-full"
              />
            </div>
          ) : (
            <div className="absolute bg-[#d9d9d9] opacity-50 h-20 w-20 top-12 rounded-full left-[50%] -translate-x-[50%]" />
          )}
          {firstName && lastName && fullName ? (
            <p className="absolute top-40 left-[50%] -translate-x-[50%] font-medium capitalize">
              {fullName}
            </p>
          ) : (
            <div className="absolute bg-[#d9d9d9] h-3 w-[7.8125rem] opacity-50 top-40 rounded-full left-[50%] -translate-x-[50%]" />
          )}
          {email ? (
            <p className="absolute top-[11.5rem] rounded-full left-[50%] -translate-x-[50%] text-sm text-[#737373] opacity-50">
              {email}
            </p>
          ) : (
            <div className="absolute bg-[#d9d9d9] h-2 w-[4.8125rem] opacity-50 top-[12rem] rounded-full left-[50%] -translate-x-[50%]" />
          )}
        </div>
      )}
    </div>
  );
};

export default Phone;
