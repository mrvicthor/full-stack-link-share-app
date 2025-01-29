import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import AppLogo from "@/assets/images/logo-devlinks-large.svg";
import EmailIcon from "@/assets/images/icon-email.svg";
import PasswordIcon from "@/assets/images/icon-password.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createUser } from "@/api/auth";
import { RegisterFormInput, registerSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
  });
  const {
    mutate: createAccount,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("Please verify your account");
      navigate("/verify-email", { replace: true });
    },
  });
  const onSubmit = (data: RegisterFormInput) => createAccount(data);

  return (
    <section className="flex justify-center items-center h-[35.8125rem] mt-16">
      <ToastContainer />
      <div className="w-[29.75rem] space-y-8">
        <div className="flex justify-center">
          <img src={AppLogo} alt="devlinks logo" />
        </div>
        {isError && (
          <p className="text-center text-2xl mt-4 text-[#ff3939]">
            {error.message || "An error occurred"}
          </p>
        )}
        <div className="bg-white py-8 px-6 rounded-xl">
          <h1 className="font-bold text-3xl">Create account</h1>
          <p className="text-[#737373] opacity-80 mt-2 text-sm">
            Let's get you started sharing your links!
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`${
                        form.formState.errors.email && "text-[#ff3939]"
                      } font-extralight`}
                    >
                      Email address
                    </FormLabel>
                    <div className="relative">
                      <img
                        src={EmailIcon}
                        alt="email-icon"
                        className="absolute top-[13px] left-3"
                      />
                      <FormControl>
                        <Input
                          placeholder="e.g. alex@email.com"
                          {...field}
                          className={`py-5 placeholder:pl-6 placeholder:opacity-40 ${
                            form.formState.errors.email
                              ? "border-[#ff3939]"
                              : "input-wrapper"
                          }  register-form-input`}
                        />
                      </FormControl>
                      <FormMessage className="absolute top-[13px] right-3" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel
                      className={`${
                        form.formState.errors.password && "text-[#ff3939]"
                      } font-extralight`}
                    >
                      Password
                    </FormLabel>
                    <div className="relative">
                      <img
                        className="absolute top-[13px] left-3"
                        src={PasswordIcon}
                        alt="password icon"
                      />
                      <FormControl>
                        <Input
                          className={`py-5 placeholder:pl-6 placeholder:opacity-40 ${
                            form.formState.errors.password
                              ? "border-[#ff3939]"
                              : "input-wrapper"
                          } register-form-input`}
                          placeholder="Enter your password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute top-[13px] right-3" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel
                      className={`${
                        form.formState.errors.confirmPassword &&
                        "text-[#ff3939]"
                      } font-extralight`}
                    >
                      Confirm password
                    </FormLabel>
                    <div className="relative">
                      <img
                        className="absolute top-[13px] left-3"
                        src={PasswordIcon}
                        alt="password icon"
                      />
                      <FormControl>
                        <Input
                          className={`py-5 placeholder:pl-6 placeholder:opacity-40 ${
                            form.formState.errors.confirmPassword
                              ? "border-[#ff3939]"
                              : "input-wrapper"
                          } register-form-input`}
                          placeholder="Enter your password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute top-[13px] right-3" />
                    </div>
                  </FormItem>
                )}
              />
              <FormDescription className="mt-4">
                Password must contain at least 8 characters
              </FormDescription>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#633cff] hover:bg-[#deabff] mt-4"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚪</span>
                    processing...
                  </span>
                ) : (
                  "Create new account"
                )}
              </Button>
              <p className="mt-6 text-[#737373] text-center text-sm">
                Already have an account?
                <a href="/login" target="_self" className="text-[#633cff] pl-2">
                  Login
                </a>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
