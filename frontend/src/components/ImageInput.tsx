import { FieldError } from "react-hook-form";
import WhiteIconUpload from "@/assets/images/icon-upload-white-image.svg";
import UploadIcon from "@/assets/images/icon-upload-image.svg";

type ImageInputProps = {
  handleImageUpload: React.ChangeEventHandler<HTMLInputElement>;
  imageUrl: string;
  imageError: string | null;
  imagePreview: string | null;
  error: FieldError;
};

const ImageInput = ({
  handleImageUpload,
  imageUrl,
  imageError,
  imagePreview,
  error,
}: ImageInputProps) => {
  return (
    <div className="bg-[#fafafa] mt-6 px-4 py-4 mx-6 rounded-md h-[10.56rem] flex gap-x-4 items-center justify-between text-[#737373]">
      <p>Profile picture</p>
      <div className="flex items-center gap-x-4 px-4">
        <label
          htmlFor="profile-picture"
          className="h-[8.0625rem] w-[8.0625rem] overflow-hidden group/item bg-[#efebff] text-[#633cff] hover:opacity-90 rounded-md flex flex-col gap-y-3 items-center justify-center cursor-pointer"
        >
          {imageUrl && Object.keys(imageUrl).length !== 0 ? (
            <div className="relative h-full ">
              <img
                src={imageUrl}
                alt="profile picture"
                className="rounded-md"
              />
              <div className="group/edit invisible group-hover/item:visible absolute top-[50%]  -translate-x-[50%] left-[50%] -translate-y-[50%] flex flex-col items-center justify-center">
                <img src={WhiteIconUpload} alt="profile picture" />
                <span className="flex text-white">Change Image</span>
              </div>
            </div>
          ) : (
            <>
              <img src={UploadIcon} alt="profile picture" />
              <span className="flex">+ Upload Image</span>
            </>
          )}
        </label>
        <input
          type="file"
          id="profile-picture"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
        />
        <p>
          Image must be below 1024x1024px. <br />
          Use PNG or JPG format.
        </p>
        {imageError && <span>{imageError}</span>}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 h-24 w-24 rounded-full"
          />
        )}
        {error && <p className="text-[#ff3939]">Image upload failed</p>}
      </div>
    </div>
  );
};

export default ImageInput;
