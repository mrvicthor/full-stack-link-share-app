import CardLink from "./CardLink";

export type Link = {
  _id: string;
  platform: string;
  url: string;
};

type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  links: Link[];
  __v?: number;
};

type Props = {
  user: User | undefined;
};
const CardInfo = ({ user }: Props) => {
  const fullName = `${user?.firstName} ${user?.lastName}`;

  return (
    <section className="p-8 md:bg-white rounded-lg w-[21.8125rem] absolute top-[8rem] md:top-[14rem] left-[50%] -translate-x-[50%] z-40 flex flex-col gap-y-4 items-center md:card-wrapper">
      <div className="h-[6.5rem] w-[6.5rem] overflow-hidden rounded-full border-4 border-[#633cff]">
        <img src={user?.image} alt="profile picture" />
      </div>
      <h1 className="font-bold text-2xl capitalize">{fullName}</h1>
      <p className="text-[#737373]">{user?.email}</p>
      <ul className="space-y-4 mt-8 h-[13rem] overflow-y-auto">
        {user?.links.map((link) => (
          <CardLink title={link.platform} url={link.url} key={link._id} />
        ))}
      </ul>
    </section>
  );
};

export default CardInfo;
