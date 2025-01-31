import Details from "@/components/Details";
import ImageInput from "@/components/ImageInput";
import ProfileInput from "@/components/ProfileInput";
import { Button } from "@/components/ui/button";
import useLinks from "@/hooks/useLinks";
import { profileSchema } from "@/schemas";
import { ProfileInput as ProfileInputData } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import IconChangesSaved from "@/assets/images/icon-changes-saved.svg";
import toast, { Toaster } from "react-hot-toast";
import { createProfile } from "@/api/auth";

const MAX_FILE_SIZE = 1000000;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];
const Profile = () => {
  const queryClient = useQueryClient();
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useLinks();

  const { firstName, lastName, image, email } = user?.data.userToReturn || {};

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm<ProfileInputData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      Email: email,
      "First Name": firstName,
      "Last Name": lastName,
      imageUrl: image,
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setImageError(null);
    setImagePreview(null);
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setValue("imageUrl", base64String);
      };
      reader.readAsDataURL(file);
      // setImagePreview(URL.createObjectURL(file));
    }
  };

  const {
    mutate: updateProfile,
    isPending,
    isError,
  } = useMutation({
    mutationFn: createProfile,
    onSuccess: () =>
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-[24rem] bg-[#333333] shadow-lg rounded-lg pointer-events-auto py-3 px-4 text-white flex gap-2 ring-1 ring-black ring-opacity-5`}
        >
          <div>
            <img src={IconChangesSaved} alt="changes-saved-icon" />
          </div>
          <p>Your changes have been successfully saved!</p>
        </div>
      )),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["auth"] }),
  });

  const onSubmit = async (data: ProfileInputData) => {
    // const { Email, ...rest } = data;
    console.log(data);
    updateProfile(data);
  };
  return (
    <section className="container md:px-6 grid welcome-screen gap-4">
      <Toaster position="bottom-center" reverseOrder={false} />

      <section className="bg-white welcome-screen_phone-wrapper h-[42rem] rounded-md hidden lg:block">
        <Details />
      </section>
      <section className=" bg-white welcome-screen_form-wrapper h-[43.5rem] md:h-[42rem] rounded-md">
        {isError && <p className="text-red-500">Error updating profile</p>}

        <div className="pt-8">
          <h1 className="font-bold text-2xl px-6 capitalize">
            profile details
          </h1>
          <p className="text-[#737373] text-sm mt-4 opacity-80 px-6 w-full">
            Add your details to add a personal touch to your profile
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ImageInput
              handleImageUpload={handleImageUpload}
              imageUrl={image as string}
              imageError={imageError}
              imagePreview={imagePreview}
              error={errors.imageUrl as FieldError}
            />
            <div className="mx-6 bg-[#fafafa] px-4 mt-6 rounded-md py-4 text-[#737373]">
              <ProfileInput
                register={register}
                fieldName="firstName"
                error={errors["First Name"] as FieldError}
                label="First Name"
                type="text"
              />
              <ProfileInput
                register={register}
                fieldName="lastName"
                error={errors["Last Name"] as FieldError}
                label="Last Name"
                type="text"
              />
              <ProfileInput
                register={register}
                fieldName="email"
                error={errors.Email as FieldError}
                label="Email"
                type="email"
              />
            </div>
            <hr className="mt-20" />
            <div className="flex justify-end mt-4 px-6">
              <Button
                type="submit"
                disabled={!isDirty || isPending}
                className={`bg-[#633cff] hover:bg-[#beadff] w-full md:w-auto`}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </section>
    </section>
  );
};

export default Profile;
