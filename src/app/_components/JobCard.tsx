import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Job } from "@/types/career-page";
import { MapPin, Calendar, Users, IndianRupee  } from "lucide-react";


interface JobCardProps {
    job: Job;
    onApply: (job: Job) => void;
}

export const JobCard = ({ job, onApply }: JobCardProps) => {
    const formatSalary = (min: number, max: number) => {
        return `${(min * 1000).toLocaleString()} - ${(max * 1000).toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getEmploymentTypeColor = (type: string) => {
        switch (type) {
            case 'FULL_TIME':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'CONTRACT':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'PART_TIME':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <Card className="group h-auto bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-foreground">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-muted-foreground transition-colors duration-300 mb-2">
                            {job.designation_directory?.designation_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{job.department_directory?.department_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(job.created_date)}</span>
                            </div>
                        </div>
                    </div>
                    <Badge className={getEmploymentTypeColor(job?.employee_category?.category_name ?? '')}>
                        {(job.employee_category?.category_name ?? '').replace('_', ' ')}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pb-6">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {job.job_description}
                </p>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-foreground" />
                        <span className="font-medium">{job.location_directory?.location_name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <IndianRupee  className="w-4 h-4 text-foreground" />
                        <span className="font-semibold text-foreground">
              {formatSalary(job.salary_min, job.salary_max)}
            </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <Button
                    onClick={() => onApply(job)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                    Apply Now
                </Button>
            </CardFooter>
        </Card>
    );
};