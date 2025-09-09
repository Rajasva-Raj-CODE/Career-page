"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUser, registerUser } from "../../api/career-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { toast } from "sonner";

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
  phone: z.string().min(1, "Phone number is required"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginDialog({ isOpen, onClose, onLoginSuccess }: LoginDialogProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
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

  // Reset forms when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsRegisterMode(false);
      loginForm.reset();
      registerForm.reset();
    }
  }, [isOpen, loginForm, registerForm]);

  // Reset forms when switching between login and register
  useEffect(() => {
    loginForm.reset();
    registerForm.reset();
  }, [isRegisterMode, loginForm, registerForm]);

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);

    try {
      const res = await loginUser(data);

      if (res.status) {
        toast.success(res.message || "Login successful!");
        
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.data || res));
        localStorage.setItem("isLoggedIn", "true");
        
        // Call success callback if provided
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        // Close dialog
        onClose();
        
        // Reload page to update UI
        window.location.reload();
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(axiosError.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);

    try {
      const res = await registerUser(data);

      if (res.status) {
        toast.success(res.message || "Registration successful!");
        
        // Switch to login mode after successful registration
        setTimeout(() => {
          setIsRegisterMode(false);
          // Pre-fill the email field in login form
          loginForm.setValue("login_email", data.login_email);
          toast.info("Please login with your new account");
        }, 1000);
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(axiosError.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[95vh] p-0 overflow-hidden sm:max-w-6xl">
        <div className="flex h-full flex-col lg:flex-row">
          {/* Left Side - Login Form */}
          <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 sm:p-8 md:p-0 flex flex-col overflow-y-auto justify-center">
            <div className="max-w-md mx-auto w-full py-4">
              {/* Logo */}
              <div className="flex items-center mb-6">
                <Image
                  src="/logosoft.svg"
                  alt="LogoSoft"
                  width={100}
                  height={100}
                  className="mr-3"
                />
             
              </div>

              {/* Title */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {isRegisterMode ? "Create Account" : "Sign In"}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {isRegisterMode 
                    ? "Join us to get started with your career journey" 
                    : "Welcome back! Please enter your details"
                  }
                </p>
              </div>

              {/* Forms */}
              {!isRegisterMode ? (
                // Login Form
                <Form {...loginForm} key="login-form">
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="login_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="h-10"
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
                          <FormLabel className="text-foreground font-medium">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={loginShowPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="h-10 pr-12"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 px-4 flex items-center text-muted-foreground hover:text-foreground"
                                onClick={() => setLoginShowPassword(!loginShowPassword)}
                              >
                                {loginShowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                      className="w-full h-12 bg-gradient-to-r from-[#2c83ec] to-[#87c232] hover:from-[#2c83ec]/90 hover:to-[#87c232]/90 text-white font-semibold transition-all duration-200 shadow-none hover:shadow-none"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                // Register Form
                <Form {...registerForm} key="register-form">
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your full name"
                              className="h-10"
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
                          <FormLabel className="text-foreground font-medium">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="h-10"
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
                          <FormLabel className="text-foreground font-medium">Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your phone number"
                              className="h-10"
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
                          <FormLabel className="text-foreground font-medium">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={registerShowPassword ? "text" : "password"}
                                placeholder="Create a password"
                                className="h-10 pr-12"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 px-4 flex items-center text-muted-foreground hover:text-foreground"
                                onClick={() => setRegisterShowPassword(!registerShowPassword)}
                              >
                                {registerShowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                      className="w-full h-12 bg-gradient-to-r from-[#2c83ec] to-[#87c232] hover:from-[#2c83ec]/90 hover:to-[#87c232]/90 text-white font-semibold transition-all duration-200 shadow-none hover:shadow-none"
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
              )}

              {/* OR Divider */}
              <div className="flex items-center my-4 sm:my-6">
                <div className="flex-1 border-t border-border"></div>
                <span className="px-4 text-muted-foreground text-sm">OR</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex flex-row items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#0077B5">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-sm font-medium">LinkedIn</span>
                </Button>
              </div>

              {/* Sign up link */}
              <div className="text-center mt-4 sm:mt-6">
                <span className="text-muted-foreground text-sm sm:text-base">
                  {isRegisterMode ? "Already have an account?" : "Don't have an account?"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-[#2c83ec] hover:text-[#2c83ec]/80 font-medium ml-1 text-sm sm:text-base"
                >
                  {isRegisterMode ? "Sign in" : "Sign up"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Career Image */}
          <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=800&fit=crop"
              alt="Career Opportunities"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
