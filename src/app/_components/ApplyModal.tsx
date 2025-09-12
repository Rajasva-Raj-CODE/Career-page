"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Briefcase,
  Building2,
  Upload,
  User,
  Mail,
  Phone,
  Linkedin,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Job, JobApplicationInfo } from "@/types/career-page";
import { getProfile, JobApplication } from "@/api/career-page";

interface JobApplicationDialogProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

// ✅ Validation schema
const formSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone is required")
    .max(15, "Too long")
    .regex(/^\+?[0-9\s-]{10,15}$/, "Enter a valid phone number"),
  linkedin_profile_url: z
    .string()
    .url("Invalid LinkedIn URL")
    .refine(
      (v) => /linkedin\.com\/(in|company)\//i.test(v),
      "Must be a valid LinkedIn profile/company URL"
    ),
  description: z.string().min(1, "Description is required"),
  image_url: z
    .custom<File | null | undefined>()
    .optional()
    .refine(
      (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
      "File size must be under 5MB"
    ),
});

type FormValues = z.infer<typeof formSchema>;

export const JobApplicationDialog: React.FC<JobApplicationDialogProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  const [isLoadingUserData, setIsLoadingUserData] = React.useState(false);
  const [userId, setUserId] = React.useState<number | null>(null); // To store candidate_fid

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      linkedin_profile_url: "",
      description: "",
      image_url: null,
    },
  });

  // Fetch user profile data and populate form
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isOpen) return;

      // Check if user is logged in
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn || isLoggedIn !== "true") {
        // If not logged in, reset form to empty values
        form.reset({
          full_name: "",
          email: "",
          phone: "",
          linkedin_profile_url: "",
          description: "",
          image_url: null,
        });
        return;
      }

      setIsLoadingUserData(true);
      try {
        const profileResponse = await getProfile();
        const userData = profileResponse.data;
        setUserId(userData.id); // Set candidate_fid

        // Pre-populate form with user data
        form.reset({
          full_name: userData.full_name || "",
          email: userData.login_email || "",
          phone: userData.phone || "",
          linkedin_profile_url: userData.linkedin_profile_url || "",
          description: userData.profile_summary || "",
          image_url: null,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // If error, reset form to empty values
        form.reset({
          full_name: "",
          email: "",
          phone: "",
          linkedin_profile_url: "",
          description: "",
          image_url: null,
        });
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [isOpen, form]);

  // ✅ Submit handler
const onSubmit = async (values: FormValues) => {
  if (!job) return;

  const jobApplicationData: JobApplicationInfo = {
    ...values,
    job_requisition_fid: job.id ?? 0,
    candidate_fid: userId ?? undefined,
    company_fid: job.company_fid,
    company_reg_fid: job.company_reg_fid,
    department_fid: job.department_fid,
  };

  console.log("Application submitted:---------", jobApplicationData);

  try {
    const response = await JobApplication(jobApplicationData);

    const status = response?.data?.status;
    const message = response?.data?.message;
    const error = response?.data?.error; // optional extra info

    if (status === false) {
      // 🔥 Only backend response shown
      toast.error(message || error || "Something went wrong");
    } else {
      toast.success(message || ""); // only backend message
      form.reset();
      onClose();
    }
  } catch (error: unknown) {
    console.error("API Error:", error);

    // ✅ Handle network / unexpected error
    let errorMessage = "Something went wrong!";
    if (typeof error === "object" && error !== null) {
      // Check for error.response?.data?.message or error.response?.data?.error
      const maybeResponse = (error as { response?: unknown }).response;
      if (
        maybeResponse &&
        typeof maybeResponse === "object" &&
        "data" in maybeResponse &&
        typeof (maybeResponse as { data?: unknown }).data === "object" &&
        (maybeResponse as { data?: unknown }).data !== null
      ) {
        const data = (maybeResponse as { data?: { message?: string; error?: string } }).data;
        if (data && typeof data === "object") {
          const maybeMessage = (data as { message?: unknown }).message;
          const maybeError = (data as { error?: unknown }).error;
          if (typeof maybeMessage === "string") {
            errorMessage = maybeMessage;
          } else if (typeof maybeError === "string") {
            errorMessage = maybeError;
          }
        }
      } else if ("message" in error && typeof (error as { message?: unknown }).message === "string") {
        errorMessage = (error as { message: string }).message;
      }
    }
    toast.error(errorMessage);
  }
};


  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-full max-w-full sm:max-w-6xl max-h-[95vh] overflow-y-auto p-0">
        {/* Enhanced Header with Gradient */}
        <div className="relative bg-gradient-to-r from-[#2c83ec] to-[#87c232] p-6 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    Apply for{" "}
                    {job?.designation_directory?.designation_name ?? "Position"}
                  </DialogTitle>
                  <DialogDescription className="text-white/90 text-base">
                    Join our team and make a difference
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Left Side - Job Details */}
            {job && (
              <div className="space-y-6">
                <Card className="border-0 shadow-none bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-5 h-5 text-[#2c83ec]" />
                          <h3 className="text-2xl font-bold text-foreground">
                            {job.designation_directory?.designation_name}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-700/60 px-3 py-1 rounded-full">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">
                              {job.department_directory?.department_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-700/60 px-3 py-1 rounded-full">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(job.created_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-[#87c232] hover:bg-[#87c232]/90 text-white border-0 px-3 py-1">
                        {job.employee_category?.category_name ?? "Full-time"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Job Description
                      </h4>
                      <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                        {job.job_description ?? "No description available"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <MapPin className="w-5 h-5 text-[#2c83ec]" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                              Location
                            </p>
                            <p className="font-semibold text-foreground">
                              {job.location_directory?.location_name}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <IndianRupee className="w-5 h-5 text-[#87c232]" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                              Salary Range
                            </p>
                            <p className="font-semibold text-foreground">
                              ₹{(job.salary_min * 1000).toLocaleString()} - ₹
                              {(job.salary_max * 1000).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Enhanced Right Side - Application Form */}
            <div className="space-y-6">
              <Card className="border-0 shadow-none bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#2c83ec]/10 rounded-lg">
                      <User className="w-5 h-5 text-[#2c83ec]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        Application Form
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Fill in your details to apply
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {isLoadingUserData ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-[#2c83ec] mb-4" />
                      <p className="text-muted-foreground">
                        Loading your information...
                      </p>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        encType="multipart/form-data"
                      >
                        {/* Full Name */}
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your full name"
                                  {...field}
                                  className="h-10 border-slate-200 dark:border-slate-700 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Email */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="name@example.com"
                                  {...field}
                                  className="h-10 border-slate-200 dark:border-slate-700 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Phone */}
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone Number *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+91 98XXXXXXXX"
                                  {...field}
                                  className="h-10 border-slate-200 dark:border-slate-700 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* LinkedIn */}
                        <FormField
                          control={form.control}
                          name="linkedin_profile_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                <Linkedin className="w-4 h-4" />
                                LinkedIn Profile *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://www.linkedin.com/in/username"
                                  {...field}
                                  className="h-10 border-slate-200 dark:border-slate-700 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* About You */}
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                About You *
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about yourself, your experience, and why you're interested in this role..."
                                  {...field}
                                  className="min-h-[120px] border-slate-200 dark:border-slate-700 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Profile Image */}
                        <FormField
                          control={form.control}
                          name="image_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Profile Image (Optional)
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] ?? null;
                                      field.onChange(file);
                                    }}
                                    className="h-10 border-slate-200 dark:border-slate-700 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2c83ec]/10 file:text-[#2c83ec] hover:file:bg-[#2c83ec]/20"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={form.formState.isSubmitting}
                          className="w-full h-12 bg-gradient-to-r from-[#2c83ec] to-[#87c232] hover:from-[#2c83ec]/90 hover:to-[#87c232]/90 text-white font-semibold text-base shadow-none hover:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {form.formState.isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Submitting Application...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5" />
                              Submit Application
                            </div>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;
