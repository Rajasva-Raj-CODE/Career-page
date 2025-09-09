"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { JobCard } from "../_components/JobCard";
import { JobFilters } from "../_components/JobFilters";
import JobApplicationDialog from "../_components/ApplyModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, TrendingUp, Award } from "lucide-react";

import { ModeToggle } from "@/components/ui/mode-toggle";

import UserMenue from "../_components/UserMenue";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Job } from "@/types/career-page";
import { AllJobsRequisitionsInfo } from "@/api/career-page";
import Image from "next/image";

const Careers = () => {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await AllJobsRequisitionsInfo(0, 100, "", "", "", "");
        if (response?.status && response?.data) {
          setJobs(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      }
    };

    fetchJobs();
  }, []);

  // Handle URL parameter for auto-opening application modal after login
  useEffect(() => {
    const applyParam = searchParams.get("apply");
    if (applyParam === "true") {
      // Check if there's a pending job application stored
      const pendingJob = localStorage.getItem("pendingJobApplication");
      if (pendingJob) {
        try {
          const jobData = JSON.parse(pendingJob);
          setSelectedJob(jobData);
          setIsApplyModalOpen(true);
          // Clear the URL parameter
          window.history.replaceState({}, "", "/career-page");
        } catch (error) {
          console.error("Error parsing pending job application:", error);
        }
      }
    }
  }, [searchParams]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const title = job.designation_directory?.designation_name ?? "";
      const description = job?.job_description ?? "";
      const search = searchTerm ?? "";

      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "all" ||
        job.department_directory?.department_name === selectedDepartment;

      const matchesEmploymentType =
        selectedEmploymentType === "all" ||
        job.employee_category?.category_name === selectedEmploymentType;

      const matchesLocation =
        selectedLocation === "all" ||
        job.location_directory?.location_name === selectedLocation;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesEmploymentType &&
        matchesLocation
      );
    });
  }, [
    jobs,
    searchTerm,
    selectedDepartment,
    selectedEmploymentType,
    selectedLocation,
  ]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setSelectedEmploymentType("all");
    setSelectedLocation("all");
  };

  const departments = Array.from(
    new Set(
      jobs
        .map((job) => job.department_directory?.department_name)
        .filter(
          (name): name is string =>
            typeof name === "string" && name.trim() !== ""
        )
    )
  );

  const handleApply = (job: Job) => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn || isLoggedIn !== "true") {
      // Store the job they wanted to apply for
      localStorage.setItem("pendingJobApplication", JSON.stringify(job));
      // Show toast message
      toast.info("Please login to apply for this job");
      // Redirect to login page
      window.location.href = "/login";
      return;
    }

    // If logged in, proceed with application
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="relative min-h-screen bg-background overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/careers-hero.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/40 dark:from-black/70 dark:via-black/50 dark:to-black/80" />

        {/* Header */}
        <header className="relative z-50 w-full px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Image
            src="/logosoft.svg"
            alt="Company Logo"
            width={56}
            height={56}
            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-35 lg:h-35 object-contain"
          />

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserMenue />
          </div>
        </header>

        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center min-h-screen">
          <div className="text-center text-foreground w-full">
            <div className="animate-fade-in">
              <h1 className="text-7xl md:text-8xl font-black mb-8 ">
                Join Our Team
              </h1>
              <p className="text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ">
                Build the future with us. We&apos;re looking for passionate,
                talented individuals to help shape the next generation of
                technology solutions.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="group bg-gray-500/20 dark:bg-gray-300/15 rounded-2xl p-8 border border-border hover:border-foreground transition-all duration-500">
                <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8 text-foreground" />
                </div>
                <div className="text-4xl font-bold mb-2 text-foreground">
                  {jobs.length}
                </div>
                <div className="text-foreground font-medium">
                  Open Positions
                </div>
              </div>

              <div className="group bg-gray-500/20 dark:bg-gray-300/15 rounded-2xl p-8 border border-border hover:border-foreground transition-all duration-500">
                <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-foreground" />
                </div>
                <div className="text-4xl font-bold mb-2 text-foreground">
                  {departments.length}
                </div>
                <div className="text-foreground font-medium">Departments</div>
              </div>

              <div className="group bg-gray-500/20 dark:bg-gray-300/15 rounded-2xl p-8 border border-border hover:border-foreground transition-all duration-500">
                <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-foreground" />
                </div>
                <div className="text-4xl font-bold mb-2 text-foreground">
                  4.8
                </div>
                <div className="text-foreground font-medium">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-background relative">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Filters (Left Side) */}
            <aside className="lg:col-span-1">
              <JobFilters
                jobs={jobs}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
                selectedEmploymentType={selectedEmploymentType}
                onEmploymentTypeChange={setSelectedEmploymentType}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                onClearFilters={handleClearFilters}
              />
            </aside>

            {/* Results (Right Side) */}
            <section className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-10">
                <div className="animate-fade-in">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    {filteredJobs.length} Position
                    {filteredJobs.length !== 1 ? "s" : ""} Available
                  </h2>
                  <p className="text-muted-foreground mt-2 text-lg">
                    Find your next career opportunity with us
                  </p>
                </div>
                {filteredJobs.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-foreground border-border bg-card px-4 py-2 text-lg font-medium rounded-full"
                  >
                    {filteredJobs.length} result
                    {filteredJobs.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>

              {/* Job Cards */}
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredJobs.map((job, index) => (
                    <div
                      key={job.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <JobCard job={job} onApply={handleApply} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 animate-fade-in">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-muted rounded-full blur-xl"></div>
                    </div>
                    <div className="relative">
                      <Briefcase className="w-20 h-20 mx-auto text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    No jobs found
                  </h3>
                  <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                    Try adjusting your filters or search terms to discover more
                    exciting opportunities.
                  </p>
                  <Button
                    onClick={handleClearFilters}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <JobApplicationDialog
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={selectedJob}
      />
    </div>
  );
};

export default Careers;
