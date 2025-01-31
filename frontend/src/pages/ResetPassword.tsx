import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import AppLogo from "../assets/images/logo-devlinks-large.svg";
import PasswordIcon from "@/assets/images/icon-password.svg";
import { Input } from "@/components/ui/input";
import { ResetPasswordInput, resetPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/api/auth";
import { toast } from "react-toastify";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();
  const linkIsValid = code && exp && exp > now;
  const navigate = useNavigate();
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: code as string,
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: handleReset, isPending } = useMutation({
    mutationFn: resetPassword,
    onSettled: () => {
      toast.success("Password reset successful");
      navigate("/login", { replace: true });
    },
  });

  const onSubmit = (data: ResetPasswordInput) => handleReset(data);

  return (
    <section className="container mx-auto max-w-[29.75rem] px-4 w-[90%] mt-[8.875rem] ">
      <div className="text-center flex devlinks-logo md:justify-center mb-4">
        <img src={AppLogo} alt="devlinks logo" />
      </div>
      <div className="bg-white py-8 px-6 rounded-xl mt-6">
        <h1 className="text-2xl font-bold">Reset password</h1>
        {linkIsValid ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem className="mt-6 hidden">
                    <FormControl>
                      <Input
                        className={`py-5 placeholder:pl-6 placeholder:opacity-40 input-wrapper register-form-input`}
                        type="text"
                        {...field}
                      />
                    </FormControl>
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
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="bg-white login-form mt-10 rounded-lg py-10 px-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid link</AlertTitle>
              <AlertDescription>
                The link is either invalid or expired
              </AlertDescription>
            </Alert>
            <div>
              <Button asChild variant={"link"}>
                <Link to="/password/forgot" replace>
                  Request a new password reset link
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResetPassword;
