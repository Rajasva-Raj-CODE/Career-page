"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUser } from "../career-page/api/career-page";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  login_email: z.string().email("Please enter a valid email address"),
  login_password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login_email: "",
      login_password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setMessage("");

    try {
      const res = await loginUser(data);

      setMessage(res.message);

      if (res.status) {
        localStorage.setItem("token", res.token); 
        localStorage.setItem("user", JSON.stringify(res.data || res));
        localStorage.setItem("isLoggedIn", "true");
        router.push("/career-page");
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setMessage(axiosError.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card border-border shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-2 text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="login_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="bg-background border-border text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="login_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="bg-background border-border text-foreground pr-12"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 px-4 flex items-center text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                {message && (
                  <div className="mt-4 p-3 rounded-lg text-center bg-muted text-foreground">
                    {message}
                  </div>
                )}

                <div className="text-center mt-6">
                  <p className="text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <a
                      href="/register"
                      className="text-foreground hover:text-muted-foreground font-medium transition duration-200"
                    >
                      Sign up
                    </a>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}