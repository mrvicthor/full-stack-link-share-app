import PhoneIcon from "@/assets/images/illustration-empty.svg";

const Board = () => {
  return (
    <section className="px-6">
      <div className="bg-[#fafafa] flex flex-col justify-center items-center mt-4 rounded-md gap-y-6 py-8 mb-6 h-[24.5rem]">
        <img src={PhoneIcon} alt="phone icon" />
        <h2 className="text-2xl font-bold">Let's get you started</h2>
        <p className="text-center text-[#737373] text-xs opacity-80 w-[50%]">
          Use the "Add new link" button to get started. Once you have more than
          one link, you can reorder and edit them. We're here to help you share
          your profiles with everyone.
        </p>
      </div>
    </section>
  );
};

export default Board;
