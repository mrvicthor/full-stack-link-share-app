import {
  Form,
  FormMessage,
  FormItem,
  FormControl,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import AppLogo from "../assets/images/logo-devlinks-large.svg";
import EmailIcon from "@/assets/images/icon-email.svg";
import { Input } from "@/components/ui/input";
import { ForgotPasswordInput, forgotPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/auth";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { isPending, mutate: handlePasswordReset } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => toast.success("Email sent. check your inbox"),
  });

  const onSubmit = (data: ForgotPasswordInput) => handlePasswordReset(data);
  return (
    <section className="container mx-auto max-w-[29.75rem] px-4 w-[90%] mt-[8.875rem] ">
      <ToastContainer />
      <div className="text-center flex devlinks-logo md:justify-center mb-4">
        <img src={AppLogo} alt="devlinks logo" />
      </div>
      <div className="bg-white py-8 px-6 rounded-xl mt-6">
        <h1 className="text-2xl font-bold">Reset password</h1>

        <Form {...form}>
          <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
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
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#633cff] hover:bg-[#deabff] mt-4"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚪</span>
                  submitting...
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default ForgotPassword;
