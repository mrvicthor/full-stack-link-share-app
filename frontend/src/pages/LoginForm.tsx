import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginInput, loginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import devLinksLogo from "../assets/images/logo-devlinks-large.svg";
import EmailIcon from "@/assets/images/icon-email.svg";
import PasswordIcon from "@/assets/images/icon-password.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const redirectUrl = location.state?.redirectUrl || "/";
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => loginUser(data);

  const {
    isPending,
    isError,
    mutate: loginUser,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => navigate(redirectUrl, { replace: true }),
  });
  return (
    <section className="flex justify-center items-center h-[35.8125rem] mt-12">
      <div className="w-[29.75rem] space-y-8">
        <div className="flex justify-center">
          <img src={devLinksLogo} alt="devlinks logo" />
        </div>
        {isError && (
          <p className="text-center text-2xl mt-4 text-[#ff3939]">
            Invalid email or password
          </p>
        )}
        <div className="bg-white py-8 px-6 rounded-xl">
          <h1 className="font-bold capitalize text-3xl">login</h1>
          <p className="text-[#737373] opacity-80 mt-2 text-sm">
            Add your details below to get back into the app
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
              <Button asChild variant={"link"} className="text-[#633cff]">
                <Link to="/password/forgot">Forgot password?</Link>
              </Button>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#633cff] hover:bg-[#deabff] mt-4"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚪</span>
                    logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
              <p className="mt-6 text-[#737373] text-center text-sm">
                Don't have an account?
                <a
                  href="/signup"
                  target="_self"
                  className="text-[#633cff] pl-2"
                >
                  Create account
                </a>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Login;
