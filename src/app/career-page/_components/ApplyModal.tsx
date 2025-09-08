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
import { MapPin, Calendar, Users, IndianRupee } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { JobApplication, getProfile } from "../api/career-page";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Job, JobApplicationInfo } from "@/app/career-page/types/career-page";

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
      company_fid: job.company_fid,
      company_reg_fid: job.company_reg_fid,
      department_fid: job.department_fid,
    };

    try {
      await JobApplication(jobApplicationData);
      toast.success("Application submitted successfully");
      form.reset();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit application");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            Apply for {job?.designation_directory?.designation_name ?? "Job"}
          </DialogTitle>
          <DialogDescription>
            Review the job details and fill out the form to apply.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ✅ Left Side - Job Details */}
          {job && (
            <Card className="bg-card border-border shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.designation_directory?.designation_name}
                    </h3>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{job.department_directory?.department_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
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
                  <Badge>
                    {job.employee_category?.category_name ?? "N/A"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pb-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {job.job_description ?? "No description available"}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">
                      {job.location_directory?.location_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-700">
                      {(job.salary_min * 1000).toLocaleString()} -{" "}
                      {(job.salary_max * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ✅ Right Side - Application Form */}
          <Card className="bg-card border-border shadow-md">
            <CardContent>
              {isLoadingUserData ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">Loading your information...</span>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                    encType="multipart/form-data"
                  >
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
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
                        <FormLabel>Email*</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            {...field}
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
                        <FormLabel>Phone*</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98XXXXXXXX" {...field} />
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
                        <FormLabel>LinkedIn Profile URL*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.linkedin.com/in/username"
                            {...field}
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
                        <FormLabel>About You*</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself"
                            {...field}
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
                        <FormLabel>Profile Image (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              field.onChange(file);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full"
                    >
                      {form.formState.isSubmitting
                        ? "Submitting..."
                        : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;