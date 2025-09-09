"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { 
  Loader2, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Linkedin, 
  Building2,
  CheckCircle2,
  Upload,
  Download
} from "lucide-react";
import {
  getProfile,
  updateCandidateProfile
} from "../../api/career-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  login_email: z.string().email("Please enter a valid email address"),
  login_password: z.string().optional(),
  phone: z.string().min(10, "Please enter a valid phone number"),
  profile_summary: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  location: z.string().optional(),
  linkedin_profile_url: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  profile_img_url: z.any().optional(),
  resume_file_url: z.any().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

interface ProfileData {
  id?: number;
  company_fid?: number;
  company_reg_fid?: number;
  department_fid?: number;
  full_name?: string;
  login_email?: string;
  login_password?: string;
  phone?: string;
  profile_summary?: string;
  profile_img_url?: string | File;
  location?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  resume_file_url?: string | File | null;
  linkedin_profile_url?: string;
  is_verified?: boolean;
  is_activated?: boolean;
  is_deleted?: boolean;
  created_by?: string | null;
  updated_by?: string | null;
  created_date?: string;
  updated_date?: string;
  [key: string]: string | number | boolean | File | null | undefined; // Index signature for dynamic property access
}

export default function ProfilePage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      login_email: "",
      login_password: "",
      phone: "",
      profile_summary: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      location: "",
      linkedin_profile_url: "",
      profile_img_url: null,
      resume_file_url: null,
    },
  });

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | File): string => {
    if (imagePath instanceof File) {
      return URL.createObjectURL(imagePath);
    }
    if (typeof imagePath === 'string' && imagePath) {
      // If the path already starts with http, return as is
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      // Otherwise, prepend the base URL
      return `${process.env.NEXT_PUBLIC_IMAGE_URL}${imagePath}`;
    }
    return '';
  };

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== "undefined" && !localStorage.getItem("isLoggedIn")) {
      window.location.href = "/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        console.log("res", res);

        // Clean the data to handle "null" strings and convert them to empty strings
        const cleanedData = Object.keys(res.data).reduce((acc, key) => {
          const value = res.data[key];
          // Convert string "null" to empty string for better UX
          acc[key as keyof ProfileData] = value === "null" || value === null ? "" : value;
          return acc;
        }, {} as ProfileData);

        // Populate form with fetched data
        form.reset({
          full_name: cleanedData.full_name || "",
          login_email: cleanedData.login_email || "",
          login_password: "",
          phone: cleanedData.phone || "",
          profile_summary: cleanedData.profile_summary || "",
          country: cleanedData.country || "",
          state: cleanedData.state || "",
          city: cleanedData.city || "",
          pincode: cleanedData.pincode || "",
          location: cleanedData.location || "",
          linkedin_profile_url: cleanedData.linkedin_profile_url || "",
          profile_img_url: cleanedData.profile_img_url || null,
          resume_file_url: cleanedData.resume_file_url || null,
        });
      } catch (error) {
        console.error("Error fetching profile", error);
        setMessage("Failed to fetch profile data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [form]);

  const handleFileChange = (fieldName: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      form.setValue(fieldName, file);

      // Show selected file name
      const fileName = file.name;
      const label = e.target.nextElementSibling as HTMLElement;
      if (label) {
        label.textContent = fileName;
      }
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    setMessage("");

    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof ProfileForm];
        // Only append non-empty values to avoid sending empty strings
        if (value && value !== '') {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const res = await updateCandidateProfile(formData);
      setMessage(res.message || "Profile updated successfully!");
    } catch {
      setMessage("Failed to update profile.");
    }
  };




  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2c83ec]"></div>
          <div className="absolute inset-0 rounded-full border-2 border-[#87c232]/20"></div>
        </div>
        <p className="mt-4 text-muted-foreground">Loading your profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-foreground py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2c83ec] to-[#87c232] rounded-2xl blur-lg opacity-20"></div>
            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-[#2c83ec]/10 to-[#87c232]/10 rounded-xl">
                  <User className="w-6 h-6 text-[#2c83ec]" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Profile Settings
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Manage your personal information and documents
              </p>
            </div>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-white via-slate-50/50 to-slate-100/80 dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-[#2c83ec]/10 transition-all duration-300 py-0 overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2c83ec] via-[#87c232] to-[#2c83ec] opacity-60" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="md:flex">
            {/* Left column - Profile image and files */}
            <div className="md:w-1/3 bg-gradient-to-br from-slate-50/80 to-slate-100/60 dark:from-slate-800/80 dark:to-slate-900/60 p-6 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2c83ec]/10 to-[#87c232]/10 flex items-center justify-center overflow-hidden border-4 border-white/50 dark:border-slate-700/50 shadow-lg">
                  {form.watch("profile_img_url") ? (
                    <Image
                      src={getImageUrl(form.watch("profile_img_url"))}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-[#2c83ec]">
                      {form.watch("full_name") ? form.watch("full_name").charAt(0) : "U"}
                    </span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-gradient-to-r from-[#2c83ec] to-[#87c232] p-2 rounded-full cursor-pointer hover:from-[#2c83ec]/90 hover:to-[#87c232]/90 transition-all duration-200 shadow-lg hover:shadow-xl group">
                  <Camera className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                  <input
                    type="file"
                    name="profile_img_url"
                    onChange={handleFileChange("profile_img_url")}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>

              <div className="w-full space-y-4">
                <div>
                  <label className="text-foreground mb-3 block text-sm font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#2c83ec]" />
                    Resume
                  </label>
              <Card 
                    className="border-2 border-dashed border-slate-200/60 dark:border-slate-700/60 hover:border-[#2c83ec] transition-all duration-200 cursor-pointer bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-md"
                    onClick={() => document.getElementById('resume-file-input')?.click()}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <div className="p-3 bg-gradient-to-br from-[#87c232]/10 to-[#87c232]/5 rounded-xl border border-[#87c232]/20 mb-3">
                        <Upload className="h-6 w-6 text-[#87c232]" />
                      </div>
                      <span
                        className="text-sm text-foreground text-center font-medium"
                        id="resume-label"
                      >
                        {form.watch("resume_file_url") instanceof File
                          ? form.watch("resume_file_url").name
                          : form.watch("resume_file_url") && typeof form.watch("resume_file_url") === 'string'
                          ? (() => {
                              const filename = form.watch("resume_file_url").split('/').pop() || "";
                              // Remove ID prefix (numbers followed by dash) from filename
                              const cleanFilename = filename.replace(/^\d+-/, '');
                              return cleanFilename || "Current resume";
                            })()
                          : "Upload resume"}
                      </span>
                      {form.watch("resume_file_url") && typeof form.watch("resume_file_url") === 'string' && (
                        <a
                          href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${form.watch("resume_file_url")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-xs text-[#2c83ec] hover:text-[#2c83ec]/80 underline flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-3 h-3" />
                          View Current Resume
                        </a>
                      )}
                      <input
                        id="resume-file-input"
                        type="file"
                        name="resume_file_url"
                        onChange={handleFileChange("resume_file_url")}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-4">
                  <Separator className="mb-4 bg-slate-200/50 dark:bg-slate-700/50" />
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#87c232]" />
                      Profile Completion
                    </h3>
                    <Progress 
                      value={(() => {
                        const fields = [
                          'full_name', 'login_email', 'phone', 'profile_summary', 
                          'country', 'state', 'city', 'location', 'linkedin_profile_url', 
                          'profile_img_url', 'resume_file_url'
                        ];
                        const completedFields = fields.filter(field => {
                          const value = form.watch(field as keyof ProfileForm);
                          return value && value !== '' && value !== 'null';
                        }).length;
                        return Math.round((completedFields / fields.length) * 100);
                      })()}
                      className="h-3 mb-3 [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-[#2c83ec] [&>[data-slot=progress-indicator]]:to-[#87c232]"
                    />
                    <p className="text-xs text-muted-foreground">
                      {(() => {
                        const fields = [
                          'full_name', 'login_email', 'phone', 'profile_summary', 
                          'country', 'state', 'city', 'location', 'linkedin_profile_url', 
                          'profile_img_url', 'resume_file_url'
                        ];
                        const completedFields = fields.filter(field => {
                          const value = form.watch(field as keyof ProfileForm);
                          return value && value !== '' && value !== 'null';
                        }).length;
                        const percentage = Math.round((completedFields / fields.length) * 100);
                        return `${percentage}% complete - Complete your profile to improve visibility`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Form fields */}
            <div className="md:w-2/3 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-[#2c83ec]/10 to-[#2c83ec]/5 rounded-xl border border-[#2c83ec]/20">
                      <User className="w-5 h-5 text-[#2c83ec]" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Personal Information
                    </h3>
                  </div>
                  <Separator className="mb-4 bg-slate-200/50 dark:bg-slate-700/50" />
                  <p className="text-sm text-muted-foreground mb-6">
                    Fields marked with <span className="text-[#2c83ec] font-semibold">*</span> are required
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-[#2c83ec]" />
                        Full Name <span className="text-[#2c83ec]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 text-foreground h-12 rounded-xl"
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
                      <FormLabel className="text-foreground font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#87c232]" />
                        Email <span className="text-[#2c83ec]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 text-foreground h-12 rounded-xl"
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
                      <FormLabel className="text-foreground font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-[#2c83ec]" />
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Leave blank to keep current"
                          className="bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 text-foreground h-12 rounded-xl"
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
                      <FormLabel className="text-foreground font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#87c232]" />
                        Phone <span className="text-[#2c83ec]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 text-foreground h-12 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profile_summary"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-foreground font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#2c83ec]" />
                        Profile Summary
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          className="bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 text-foreground rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-[#87c232]/10 to-[#87c232]/5 rounded-xl border border-[#87c232]/20">
                      <MapPin className="w-5 h-5 text-[#87c232]" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Location Information
                    </h3>
                  </div>
                  <Separator className="mb-6 bg-slate-200/50 dark:bg-slate-700/50" />
                </div>

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Country</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 text-foreground h-12 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">State</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 text-foreground h-12 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">City</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 text-foreground h-12 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Pincode</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 text-foreground h-12 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-foreground font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#87c232]" />
                        Full Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 text-foreground h-12 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-[#2c83ec]/10 to-[#2c83ec]/5 rounded-xl border border-[#2c83ec]/20">
                      <Linkedin className="w-5 h-5 text-[#2c83ec]" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Professional Links
                    </h3>
                  </div>
                  <Separator className="mb-6 bg-slate-200/50 dark:bg-slate-700/50" />
                </div>

                <FormField
                  control={form.control}
                  name="linkedin_profile_url"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-foreground font-medium flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-[#2c83ec]" />
                        LinkedIn Profile URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 text-foreground h-12 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-8 pt-6">
                <Separator className="mb-6 bg-slate-200/50 dark:bg-slate-700/50" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {message && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                      message.includes("successfully")
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/30"
                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30"
                    }`}>
                      {message.includes("successfully") ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}
                      <p className="font-medium">{message}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#2c83ec] to-[#87c232] hover:from-[#2c83ec]/90 hover:to-[#87c232]/90 text-white font-bold transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl hover:shadow-[#2c83ec]/25 h-12 rounded-xl"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
        </Form>
        </Card>
      </div>
    </div>
  );
}