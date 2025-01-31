import { Button } from "./ui/button";
import { NavLink } from "react-router-dom";
import { useNotification } from "@/hooks/useNotification";

const PreviewHeader = () => {
  const { setNotification } = useNotification();
  return (
    <header className="md:h-[4.875rem] container">
      <nav className="md:bg-[#ffffff] w-full  flex gap-4 h-full rounded-md items-center justify-between md:pl-6 md:pr-4">
        <NavLink
          to="/profile"
          className="text-[#633cff] border border-[#633CFF] px-4 py-2 text-sm rounded-md font-medium w-full text-center md:w-[9.9375rem]"
        >
          Back to Editor
        </NavLink>
        <Button
          className="bg-[#633cff] w-full md:w-[9.9375rem]"
          onClick={() => setNotification(true)}
        >
          Share Link
        </Button>
      </nav>
    </header>
  );
};

export default PreviewHeader;
