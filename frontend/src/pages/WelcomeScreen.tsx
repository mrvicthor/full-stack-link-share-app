import FormBoard from "@/components/FormBoard";
import Phone from "@/components/Phone";

const WelcomeScreen = () => {
  return (
    <section className="container md:px-6 grid welcome-screen gap-4">
      <section className="bg-white welcome-screen_phone-wrapper h-[40rem] rounded-md">
        <Phone />
      </section>
      <section className=" bg-white welcome-screen_form-wrapper h-[40rem] rounded-md">
        <FormBoard />
      </section>
    </section>
  );
};

export default WelcomeScreen;
