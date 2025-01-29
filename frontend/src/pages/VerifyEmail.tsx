import { verifyEmail } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import AppLogo from "@/assets/images/logo-devlinks-large.svg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyInput, verifySchema } from "@/schemas";
import { Input } from "@/components/ui/input";

const VerifyEmail = () => {
  const form = useForm<VerifyInput>({
    resolver: zodResolver(verifySchema),
  });
  const {
    mutate: verifyUser,
    isError,
    isPending,
  } = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => toast.success("Email verified successfully"),
  });

  const onSubmit = (data: VerifyInput) => verifyUser(data.verifyCode);
  return (
    <section className="container mx-auto max-w-[29.75rem] px-4 w-[90%] mt-[8.875rem] ">
      <ToastContainer />

      <div className="flex justify-center">
        <img src={AppLogo} alt="devlinks logo" />
      </div>
      <div className="bg-white py-8 px-6 rounded-xl mt-6">
        <p className="font-bold capitalize text-3xl">Verify your account</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
            <FormField
              control={form.control}
              name="verifyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      form.formState.errors.verifyCode && "text-[#ff3939]"
                    } font-extralight`}
                  >
                    Verification code
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Enter verification code"
                        {...field}
                        className={`py-5 placeholder:opacity-40 ${
                          form.formState.errors.verifyCode
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
      {isError && (
        <div className="flex justify-center mt-4">
          <Button asChild variant={"link"}>
            <Link to="/password/forgot" replace>
              Get a new link
            </Link>
          </Button>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <Button asChild variant={"link"}>
          <Link className="text-center" to="/" replace>
            Go to home
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default VerifyEmail;
