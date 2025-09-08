import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { Job } from "../types/career-page";

interface JobFiltersProps {
  jobs: Job[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  selectedEmploymentType: string;
  onEmploymentTypeChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  onClearFilters: () => void;
}

export const JobFilters = ({
  jobs,
  searchTerm,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedEmploymentType,
  onEmploymentTypeChange,
  selectedLocation,
  onLocationChange,
  onClearFilters,
}: JobFiltersProps) => {
  const departments = Array.from(
    new Set(
      jobs
        .map((job) => job.department_directory?.department_name)
        .filter((name): name is string => !!name)
    )
  );

  const employmentTypes = Array.from(
    new Set(
      jobs
        .map((job) => job?.employee_category?.category_name)
        .filter((type): type is string => !!type)
    )
  );

  const locations = Array.from(
    new Set(
      jobs
        .map((job) => job?.location_directory?.location_name)
        .filter((loc): loc is string => !!loc)
    )
  );

  const hasActiveFilters =
    searchTerm ||
    selectedDepartment !== "all" ||
    selectedEmploymentType !== "all" ||
    selectedLocation !== "all";

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 sticky top-20">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Filter Opportunities
        </h3>
      </div>

      <div className="flex flex-col gap-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-border focus:border-primary focus:ring-primary/20"
          />
        </div>

        {/* Department Filter */}
        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-full border-border focus:border-primary focus:ring-primary/20">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Employment Type Filter */}
        <Select
          value={selectedEmploymentType}
          onValueChange={onEmploymentTypeChange}
        >
          <SelectTrigger className="w-full border-border focus:border-primary focus:ring-primary/20">
            <SelectValue placeholder="Employment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {employmentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <Select value={selectedLocation} onValueChange={onLocationChange}>
          <SelectTrigger className="w-full border-border focus:border-primary focus:ring-primary/20">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={onClearFilters}
            className="flex items-center gap-2 border-border hover:border-primary hover:text-primary transition-colors duration-300"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
