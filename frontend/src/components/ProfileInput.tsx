import { Path, UseFormRegister, FieldError } from "react-hook-form";
import { ProfileInput as ProfileInputData } from "@/schemas";
type InputProps = {
  label: Path<ProfileInputData>;
  register: UseFormRegister<ProfileInputData>;
  fieldName: string;
  error: FieldError;
  type: "text" | "email";
};
const ProfileInput = ({
  register,
  error,
  label,
  fieldName,
  type,
}: InputProps) => {
  return (
    <div className="flex items-center justify-between gap-x-10">
      <label
        htmlFor={fieldName}
        className={` font-light text-sm basis-1/3 ${error && "text-[#ff3939]"}`}
      >
        {label}
        <sup>*</sup>
      </label>
      <div
        className={`${
          error ? "border-[#ff3939] border" : "input-wrapper"
        } basis-2/3 register-form-input-profile flex`}
      >
        <input
          type={type}
          id="firstName"
          {...register(label)}
          placeholder={
            label === "Email"
              ? "e.g. alex@email.com"
              : label === "First Name"
              ? "e.g John"
              : "e.g Doe"
          }
          aria-invalid={error ? "true" : "false"}
        />
        {error && (
          <p role="alert" className="text-[#ff3939] flex-item-3">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileInput;
