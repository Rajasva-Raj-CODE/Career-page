"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUser, registerUser } from "../career-page/api/career-page";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent } from "@/components/ui/tabs";

// Login Schema
const loginSchema = z.object({
  login_email: z.string().email("Please enter a valid email address"),
  login_password: z.string().min(1, "Password is required"),
});

// Register Schema
const registerSchema = z.object({
  company_fid: z.number(),
  company_reg_fid: z.number(),
  department_fid: z.number(),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  login_email: z.string().email("Please enter a valid email address"),
  login_password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;


import { Suspense } from "react";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"login" | "register">(
    tabParam === "register" ? "register" : "login"
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [registerShowPassword, setRegisterShowPassword] = useState(false);

  // Login Form
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login_email: "",
      login_password: "",
    },
  });

  // Register Form
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      company_fid: 1,
      company_reg_fid: 1,
      department_fid: 2,
      full_name: "",
      login_email: "",
      login_password: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (tabParam === "register") {
      setActiveTab("register");
    }
  }, [tabParam]);

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
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
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setMessage(axiosError.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setMessage("");

    try {
      const res = await registerUser(data);
      setMessage(res.message);

      if (res.status) {
        // Switch to login tab after successful registration
        setTimeout(() => {
          setActiveTab("login");
          // Pre-fill the email field in login form
          loginForm.setValue("login_email", data.login_email);
          setMessage("Registration successful! Please login.");
        }, 1000);
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      setMessage(axiosError.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* left Side with Auth Form */}
      <div
        className="relative min-h-screen flex items-center justify-center p-6 
             bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] 
             md:bg-gradient-to-br md:from-[#0f2027] md:via-[#203a43] md:to-[#2c5364]
             bg-cover bg-center 
             bg-[url('https://images.pexels.com/photos/3757369/pexels-photo-3757369.jpeg')] 
             md:bg-none"
      >
        {/* Overlay only for mobile to darken image */}
        <div className="absolute inset-0 bg-black/50 md:hidden"></div>
        <div className="w-full max-w-md relative z-10">
          <Card className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-2 text-foreground">
                {activeTab === "login" ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {activeTab === "login"
                  ? "Sign in to access your account"
                  : "Join us to get started"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "login" | "register")}
              >
                <div className="flex mb-6 bg-muted rounded-full overflow-hidden border border-border">
                  <button
                    onClick={() => setActiveTab("login")}
                    className={`flex-1 py-2 text-center font-medium transition-colors rounded-full ${
                      activeTab === "login"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-accent-foreground"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveTab("register")}
                    className={`flex-1 py-2 text-center font-medium transition-colors rounded-full ${
                      activeTab === "register"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-accent-foreground"
                    }`}
                  >
                    Register
                  </button>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 transition-all duration-300 ease-in-out">
                  {/* Login Form */}
                  <TabsContent value="login" className="w-full">
                    <Form {...loginForm}>
                      <form
                        onSubmit={loginForm.handleSubmit(handleLogin)}
                        className="space-y-6"
                      >
                        <FormField
                          control={loginForm.control}
                          name="login_email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">
                                Email
                              </FormLabel>
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
                          control={loginForm.control}
                          name="login_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">
                                Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={
                                      loginShowPassword ? "text" : "password"
                                    }
                                    placeholder="Enter your password"
                                    className="bg-background border-border text-foreground pr-12"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 px-4 flex items-center text-sm text-muted-foreground hover:text-foreground"
                                    onClick={() =>
                                      setLoginShowPassword(!loginShowPassword)
                                    }
                                  >
                                    {loginShowPassword ? (
                                      <EyeOff size={16} />
                                    ) : (
                                      <Eye size={16} />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Login"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  {/* Register Form */}
                  <TabsContent value="register" className="w-full">
                    <Form {...registerForm}>
                      <form
                        onSubmit={registerForm.handleSubmit(handleRegister)}
                        className="space-y-6"
                      >
                        <FormField
                          control={registerForm.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">
                                Full Name
                              </FormLabel>
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
                          control={registerForm.control}
                          name="login_email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">
                                Email
                              </FormLabel>
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
                          control={registerForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">
                                Phone
                              </FormLabel>
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
                          control={registerForm.control}
                          name="login_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">
                                Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={
                                      registerShowPassword ? "text" : "password"
                                    }
                                    placeholder="Create a password"
                                    className="bg-background border-border text-foreground pr-12"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 px-4 flex items-center text-sm text-muted-foreground hover:text-foreground"
                                    onClick={() =>
                                      setRegisterShowPassword(
                                        !registerShowPassword
                                      )
                                    }
                                  >
                                    {registerShowPassword ? (
                                      <EyeOff size={16} />
                                    ) : (
                                      <Eye size={16} />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </div>
              </Tabs>

              {message && (
                <div className="mt-4 p-3 rounded-lg text-center bg-muted text-foreground">
                  {message}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Right Side with Background Image */}
      <div
        className="hidden md:flex items-center justify-center bg-cover bg-right"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/3757369/pexels-photo-3757369.jpeg')",
        }}
      >
        <div className="w-full h-full bg-black/40"></div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthPageContent />
    </Suspense>
  );
}
