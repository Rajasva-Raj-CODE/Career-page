"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUser } from "../career-page/api/career-page";
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

const registerSchema = z.object({
  company_tid: z.number(),
  company_reg_tid: z.number(),
  department_tid: z.number(),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  login_email: z.string().email("Please enter a valid email address"),
  login_password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      company_tid: 1,
      company_reg_tid: 1,
      department_tid: 2,
      full_name: "",
      login_email: "",
      login_password: "",
      phone: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setMessage("");

    try {
      const res = await registerUser(data);
      setMessage(res.message);

      if (res.status) {
        setTimeout(() => {
          window.location.href = "/login"; 
        }, 1000);
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
            <CardTitle className="text-3xl font-bold mb-2 text-foreground">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground">Join us to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your phone number"
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
                            placeholder="Create a password"
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
                    "Create Account"
                  )}
                </Button>

                {message && (
                  <div className="mt-4 p-3 rounded-lg text-center bg-muted text-foreground">
                    {message}
                  </div>
                )}

                <div className="text-center mt-6">
                  <p className="text-muted-foreground">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-foreground hover:text-muted-foreground font-medium transition duration-200"
                    >
                      Sign in
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