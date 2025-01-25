import phoneLogo from "@/assets/images/illustration-phone-mockup.svg";

const Phone = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <img
        src={phoneLogo}
        alt="phone image"
        className="w-[19.1875rem] h-[32rem]"
      />
    </div>
  );
};

export default Phone;
