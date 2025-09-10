import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Job } from "@/types/career-page";
import {
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Share2,
  Building2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useEffect } from "react";

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export const JobCard = ({ job, onApply }: JobCardProps) => {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300); // wait for content render
      }
    }
  }, []);

  // ✅ Salary formatter with frequency scaling
  const formatSalary = (
    min: number,
    max: number,
    frequency: string,
    currency: string
  ) => {
    let multiplier = 1;

    if (frequency === "MONTHLY") {
      multiplier = 1000; // convert to actual rupees (5 -> 5000)
    } else if (frequency === "ANNUALLY") {
      multiplier = 100000; // convert lakhs to actual rupees (5 -> 5,00,000)
    }

    const minSalary = (min * multiplier).toLocaleString("en-IN");
    const maxSalary = (max * multiplier).toLocaleString("en-IN");

    const freqLabel: Record<string, string> = {
      MONTHLY: "per month",
      ANNUALLY: "per year",
    };

    return `${currency} ${minSalary} - ${maxSalary} ${
      freqLabel[frequency] || ""
    }`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case "FULL_TIME":
        return "bg-[#87c232]/10 text-[#87c232] border-[#87c232]/20 dark:bg-[#87c232]/20 dark:text-[#87c232] dark:border-[#87c232]/30";
      case "CONTRACT":
        return "bg-[#2c83ec]/10 text-[#2c83ec] border-[#2c83ec]/20 dark:bg-[#2c83ec]/20 dark:text-[#2c83ec] dark:border-[#2c83ec]/30";
      case "PART_TIME":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/20 dark:text-gray-400 dark:border-gray-700/30";
    }
  };

  // ✅ helper for structured share text (without apply link)
  const buildShareText = (job: Job) => {
    const salary = formatSalary(
      job.salary_min,
      job.salary_max,
      job.salary_frequency,
      job.salary_currency
    );

    return `
Job Opportunity: ${job.designation_directory?.designation_name}

📍 Location: ${job.location_directory?.location_name}
💰 Salary: ${salary}

📝 Description:
${job.job_description}

👉 Apply here: http://localhost:3000/#job-${job.id}
  `.trim();
  };

  return (
    <Card className="group relative h-full py-2 bg-gradient-to-br from-white via-slate-50/50 to-slate-100/80 dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-xl sm:rounded-2xl shadow-none hover:shadow-none hover:shadow-[#2c83ec]/10 transition-all duration-500 hover:border-[#2c83ec]/30 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2c83ec] via-[#87c232] to-[#2c83ec] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3 sm:pb-4 pt-4 sm:pt-6 px-4 sm:px-6">
        {/* Header Section */}
        <div className="space-y-3 sm:space-y-4">
          {/* Title and Badge Row */}
          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="relative flex-shrink-0">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#2c83ec]/10 to-[#2c83ec]/5 rounded-lg sm:rounded-xl border border-[#2c83ec]/20 group-hover:border-[#2c83ec]/40 transition-colors duration-300">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2c83ec] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground transition-colors duration-300 line-clamp-2 leading-tight">
                    {job.designation_directory?.designation_name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Employment Type Badge */}
            <div className="flex-shrink-0 self-start">
              <Badge
                className={`${getEmploymentTypeColor(
                  job?.employee_category?.category_name ?? ""
                )} px-2 sm:px-3 py-1 sm:py-1.5 font-semibold text-xs rounded-full border shadow-none`}
              >
                {(job.employee_category?.category_name ?? "").replace("_", " ")}
              </Badge>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-row xs:flex-row xs:items-center gap-2 sm:gap-3 xs:gap-4">
            <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#2c83ec] flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm text-muted-foreground truncate">
                {job.department_directory?.department_name}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#87c232] flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm text-muted-foreground">
                {formatDate(job.created_date)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4 sm:pb-6 px-4 sm:px-2">
        {/* Job Description */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200/60 dark:border-slate-700/60 mb-4 sm:mb-6 shadow-none">
          <div className="flex items-start gap-2 sm:gap-3 mb-2">
            <div className="p-1 bg-[#87c232]/10 rounded-lg flex-shrink-0">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#87c232]" />
            </div>
            <h4 className="font-semibold text-foreground text-xs sm:text-sm">
              Job Description
            </h4>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-3 pl-5 sm:pl-7">
            {job.job_description}
          </p>
        </div>

        {/* Location and Salary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Location Card */}
          <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/40 dark:from-blue-900/20 dark:to-blue-800/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-200/50 dark:border-blue-800/30 shadow-none hover:shadow-none transition-shadow duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#2c83ec]/20 to-[#2c83ec]/10 rounded-lg sm:rounded-xl border border-[#2c83ec]/20 flex-shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#2c83ec]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                  Location
                </p>
                <p className="font-bold text-foreground text-xs sm:text-sm truncate">
                  {job.location_directory?.location_name}
                </p>
              </div>
            </div>
          </div>

          {/* Salary Card */}
          <div className="bg-gradient-to-br from-green-50/80 to-green-100/40 dark:from-green-900/20 dark:to-green-800/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200/50 dark:border-green-800/30 shadow-none hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#87c232]/20 to-[#87c232]/10 rounded-lg sm:rounded-xl border border-[#87c232]/20 flex-shrink-0">
                <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-[#87c232]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                  Salary Range
                </p>
                <p className="font-bold text-foreground text-xs sm:text-sm">
                  {formatSalary(
                    job.salary_min,
                    job.salary_max,
                    job.salary_frequency,
                    job.salary_currency
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4 sm:pb-6 px-4 sm:px-6">
        <div className="flex flex-row  gap-2 sm:gap-3 w-full">
          <Button
            onClick={() => onApply(job)}
            className="flex-1 bg-gradient-to-r from-[#2c83ec] to-[#87c232] hover:from-[#2c83ec]/90 hover:to-[#87c232]/90 text-white font-bold transition-all duration-300 hover:scale-[1.02] shadow-none hover:shadow-none hover:shadow-[#2c83ec]/25 h-10 sm:h-12 rounded-lg sm:rounded-xl group/btn text-sm sm:text-base"
          >
            <span className="mr-1 sm:mr-2">Apply Now</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 sm:h-12 w-10 sm:w-12 xs:w-auto xs:px-3 sm:px-4 border-slate-200 dark:border-slate-700 hover:border-[#2c83ec] hover:bg-[#2c83ec]/10 hover:text-[#2c83ec] transition-all duration-300 rounded-lg sm:rounded-xl group/share"
            onClick={() => {
              const shareData = {
                title: job.designation_directory?.designation_name,
                text: buildShareText(job),
              };

              if (navigator.share) {
                navigator
                  .share(shareData)
                  .catch((err) => console.log("Share failed:", err));
              } else {
                navigator.clipboard.writeText(shareData.text);
                alert("Job details copied to clipboard!");
              }
            }}
          >
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4 group-hover/share:scale-110 transition-transform duration-300" />
            <span className="hidden xs:inline ml-1 sm:ml-2 font-medium text-xs sm:text-sm">
              Share
            </span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
