"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Loader2, Camera } from "lucide-react";
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
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and documents
          </p>
        </div>

        <Card className="bg-card border-border shadow-none py-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="md:flex">
            {/* Left column - Profile image and files */}
            <div className="md:w-1/3 bg-muted/50 p-6 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                  {form.watch("profile_img_url") ? (
                    <Image
                      src={getImageUrl(form.watch("profile_img_url"))}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-muted-foreground">
                      {form.watch("full_name") ? form.watch("full_name").charAt(0) : "U"}
                    </span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary p-2  rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="h-5 w-5 mx-auto group-hover:scale-110 transition-transform text-primary-foreground" />
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
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    Resume
                  </label>
              <Card 
                    className="border-2 border-dashed border-border hover:border-foreground transition-colors cursor-pointer bg-card"
                    onClick={() => document.getElementById('resume-file-input')?.click()}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span
                        className="mt-2 text-sm text-muted-foreground text-center"
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
                          className="mt-2 text-xs text-foreground hover:text-muted-foreground underline"
                          onClick={(e) => e.stopPropagation()}
                        >
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
                  <Separator className="mb-4" />
                  <h3 className="font-medium text-foreground mb-2">
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
                    className="h-2.5 mb-2 [&>[data-slot=progress-indicator]]:bg-primary"
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

            {/* Right column - Form fields */}
            <div className="md:w-2/3 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-foreground mb-2 pb-2">
                    Personal Information
                  </h3>
                  <Separator className="mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Fields marked with <span className="text-destructive">*</span> are required
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Full Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                      <FormLabel className="text-foreground">
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
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
                        <Input
                          type="password"
                          placeholder="Leave blank to keep current"
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
                      <FormLabel className="text-foreground">
                        Phone <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="profile_summary"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-foreground">Profile Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          className="bg-background border-border text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-medium text-black dark:text-foreground mb-4 pb-2">
                    Location Information
                  </h3>
                  <Separator className="mb-4" />
                </div>

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Country</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">State</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">City</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Pincode</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="location"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-foreground">Full Address</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-background border-border text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-medium text-black dark:text-foreground mb-4 pb-2">
                    Professional Links
                  </h3>
                  <Separator className="mb-4" />
                </div>

                <FormField
                  control={form.control}
                  name="linkedin_profile_url"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-foreground">LinkedIn Profile URL</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-background border-border text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-8 pt-6">
                <Separator className="mb-6" />
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  {message && (
                    <p
                      className={`mb-4 sm:mb-0 ${
                        message.includes("successfully")
                          ? "text-green-600"
                          : "text-destructive"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
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