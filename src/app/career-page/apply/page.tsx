'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Linkedin, Upload } from "lucide-react";
import { toast } from "sonner";

const jobApplicationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    linkedinProfile: z
        .string()
        .url("Please enter a valid LinkedIn URL")
        .optional()
        .or(z.literal("")),
    resume: z.any().optional(),
    introduction: z.string().optional(),
});

type JobApplicationForm = z.infer<typeof jobApplicationSchema>;

const JobApplicationForm = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<JobApplicationForm>({
        resolver: zodResolver(jobApplicationSchema),
    });

    const onSubmit = async (data: JobApplicationForm) => {
        try {
            // Use the submitted data so it's not flagged as unused
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("linkedinProfile", data.linkedinProfile ?? "");
            formData.append("introduction", data.introduction ?? "");
            if (selectedFile) {
                formData.append("resume", selectedFile);
            }
            // Simulate request
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // You could inspect or send formData here
            // console.log([...formData.entries()]);

            toast.success("Application Submitted!", {
                description: "Thank you for your application. We'll be in touch soon.",
            });

            reset();
            setSelectedFile(null);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong", {
                description: "Please try again.",
            });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full opacity-20 floating-animation"></div>
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-full opacity-20 floating-animation"
                    style={{ animationDelay: "3s" }}
                ></div>
            </div>

            <div className="max-w-7xl mx-auto relative">
                <div className="mb-8 fade-in-up">
                    <nav className="text-sm text-gray-600 mb-4">
                        Jobs / Marketing and Community Manager
                    </nav>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">
              We&apos;re actively hiring
            </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 fade-in-up" style={{ animationDelay: "0.2s" }}>
                        <Card className="glass-card shadow-2xl border-0 backdrop-blur-md">
                            <CardHeader className="pb-6 bg-gradient-to-r from-white/50 to-white/30 rounded-t-xl">
                                <CardTitle className="text-3xl font-bold gradient-text">
                                    Job Application Form
                                </CardTitle>
                                <p className="text-gray-600 mt-2">
                                    Join our innovative IT team and shape the future of technology
                                </p>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 stagger-animation">
                                    <div>
                                        <Label
                                            htmlFor="name"
                                            className="text-sm font-semibold text-gray-700 flex items-center"
                                        >
                                            Your Name <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            {...register("name")}
                                            className="mt-2 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm
                               focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               transition-all duration-300 hover:border-purple-300
                               bg-white/70 backdrop-blur-sm"
                                            placeholder="Enter your full name"
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-500 flex items-center">
                                                <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-semibold text-gray-700 flex items-center"
                                        >
                                            Your Email <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            className="mt-2 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm
                               focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               transition-all duration-300 hover:border-purple-300
                               bg-white/70 backdrop-blur-sm"
                                            placeholder="Enter your email address"
                                        />
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-500 flex items-center">
                                                <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="phone"
                                            className="text-sm font-semibold text-gray-700 flex items-center"
                                        >
                                            Your Phone Number <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            {...register("phone")}
                                            className="mt-2 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm
                               focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               transition-all duration-300 hover:border-purple-300
                               bg-white/70 backdrop-blur-sm"
                                            placeholder="+91 Enter your phone number"
                                        />
                                        {errors.phone && (
                                            <p className="mt-2 text-sm text-red-500 flex items-center">
                                                <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="linkedin" className="text-sm font-semibold text-gray-700">
                                            LinkedIn Profile
                                        </Label>
                                        <div className="mt-2 relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Linkedin className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <Input
                                                id="linkedin"
                                                {...register("linkedinProfile")}
                                                className="pl-12 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm
                                 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                 transition-all duration-300 hover:border-purple-300
                                 bg-white/70 backdrop-blur-sm"
                                                placeholder="e.g. https://www.linkedin.com/in/yourprofile"
                                            />
                                        </div>
                                        {errors.linkedinProfile && (
                                            <p className="mt-2 text-sm text-red-500 flex items-center">
                                                <span className="w-1 h-1 rounded-full bg-red-500 mr-2"></span>
                                                {errors.linkedinProfile.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="resume" className="text-sm font-semibold text-gray-700">
                                            Resume
                                        </Label>
                                        <div className="mt-2">
                                            <div className="flex items-center space-x-4">
                                                <label
                                                    className="inline-flex items-center px-6 py-3 border-2 border-dashed border-purple-300
                                        rounded-xl shadow-sm text-sm font-semibold text-purple-700 bg-purple-50
                                        hover:bg-purple-100 hover:border-purple-400 cursor-pointer
                                        transition-all duration-300 group"
                                                >
                                                    <Upload className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                                <div className="flex-1">
                          <span className="text-sm text-gray-700 font-medium">
                            {selectedFile ? (
                                <span className="flex items-center text-green-600">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                    {selectedFile.name}
                              </span>
                            ) : (
                                "No file chosen"
                            )}
                          </span>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500">
                                                Provide either a resume file or a LinkedIn profile
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="introduction" className="text-sm font-semibold text-gray-700">
                                            Short Introduction
                                        </Label>
                                        <Textarea
                                            id="introduction"
                                            {...register("introduction")}
                                            rows={4}
                                            className="mt-2 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm
                               focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               transition-all duration-300 hover:border-purple-300
                               bg-white/70 backdrop-blur-sm resize-none"
                                            placeholder="Tell us about yourself and why you're excited about this role..."
                                        />
                                    </div>

                                    <div className="pt-6">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="tech-button w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed
                               animate-pulse-glow relative overflow-hidden group"
                                        >
                      <span className="relative z-10 flex items-center">
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Submitting Application...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">✨</span>
                                I&apos;m feeling lucky
                                <span className="ml-2">🚀</span>
                            </>
                        )}
                      </span>
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Job Details Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card
                            className="glass-card shadow-2xl border-0 backdrop-blur-md fade-in-up"
                            style={{ animationDelay: "0.4s" }}
                        >
                            <CardHeader className="pb-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-t-xl">
                                <div className="flex items-center space-x-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="p-2 rounded-lg border-purple-200 hover:bg-purple-50"
                                    >
                                        <ArrowLeft className="h-4 w-4 text-purple-600" />
                                    </Button>
                                    <CardTitle className="text-lg font-bold text-gray-900">
                                        Job Details
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                        Position
                                    </h3>
                                    <p className="text-lg font-bold text-gray-900">
                                        Marketing and Community Manager
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                                        <h3 className="text-sm font-semibold text-gray-600">Location</h3>
                                        <p className="text-sm font-medium text-gray-900">Remote / Hybrid</p>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                                        <h3 className="text-sm font-semibold text-gray-600">Department</h3>
                                        <p className="text-sm font-medium text-gray-900">Marketing</p>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                                        <h3 className="text-sm font-semibold text-gray-600">Response Time</h3>
                                        <p className="text-sm font-medium text-green-600">2 days</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                                    <h3 className="text-sm font-semibold text-green-800 mb-3">
                                        Interview Process
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-green-700">
                                            <span className="w-2 h-2 rounded-full bg-green-500 mr-3"></span>
                                            Phone Screening (30 min)
                                        </div>
                                        <div className="flex items-center text-sm text-green-700">
                                            <span className="w-2 h-2 rounded-full bg-green-500 mr-3"></span>
                                            Technical Interview (1 hour)
                                        </div>
                                        <div className="flex items-center text-sm text-green-700">
                                            <span className="w-2 h-2 rounded-full bg-green-500 mr-3"></span>
                                            Culture Fit (45 min)
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                                    <h3 className="text-sm font-semibold text-blue-800">Timeline</h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Offer decision within 4 days after final interview
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Tips Card */}
                        <Card
                            className="glass-card shadow-lg border-0 backdrop-blur-md fade-in-up"
                            style={{ animationDelay: "0.6s" }}
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                                    <span className="mr-2">💡</span>
                                    Application Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-sm text-gray-600">
                                    <p className="mb-2">• Highlight your marketing experience</p>
                                    <p className="mb-2">• Showcase community building skills</p>
                                    <p className="mb-2">• Mention relevant tech tools</p>
                                    <p>• Include portfolio links if available</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplicationForm;
