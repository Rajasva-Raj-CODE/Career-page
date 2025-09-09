import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Building2, MapPin, Briefcase, RotateCcw } from "lucide-react";
import { Job } from "@/types/career-page";

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
    <div className="relative bg-gradient-to-br from-white via-slate-50/50 to-slate-100/80 dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:shadow-[#2c83ec]/5 transition-all duration-300 p-6 sticky top-20 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2c83ec] via-[#87c232] to-[#2c83ec] opacity-40" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pt-2">
        <div className="relative">
          <div className="p-2 bg-gradient-to-br from-[#2c83ec]/10 to-[#2c83ec]/5 rounded-xl border border-[#2c83ec]/20">
            <Filter className="w-5 h-5 text-[#2c83ec]" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Filter Opportunities
          </h3>
          <p className="text-xs text-muted-foreground">
            Find your perfect match
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Search Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Search className="w-4 h-4 text-[#2c83ec]" />
            Search Jobs
          </label>
          <div className="relative">
            <Input
              placeholder="Search by title, skills, or keywords..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 h-12 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-200"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#2c83ec]" />
          </div>
        </div>

        {/* Department Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#87c232]" />
            Department
          </label>
          <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-full cursor-pointer border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 h-12 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-200">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200/60 dark:border-slate-700/60">
              <SelectItem value="all" className="cursor-pointer rounded-lg">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#87c232]" />
                  All Departments
                </div>
              </SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept} className="cursor-pointer rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#87c232]" />
                    {dept}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employment Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#2c83ec]" />
            Employment Type
          </label>
          <Select
            value={selectedEmploymentType}
            onValueChange={onEmploymentTypeChange}
          >
            <SelectTrigger className="w-full cursor-pointer border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 h-12 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-200">
              <SelectValue placeholder="Select Employment Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200/60 dark:border-slate-700/60">
              <SelectItem value="all" className="cursor-pointer rounded-lg">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#2c83ec]" />
                  All Types
                </div>
              </SelectItem>
              {employmentTypes.map((type) => (
                <SelectItem key={type} value={type} className="cursor-pointer rounded-lg">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#2c83ec]" />
                    {type.replace(/_/g, " ")}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#87c232]" />
            Location
          </label>
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger className="w-full cursor-pointer border-slate-200/60 dark:border-slate-700/60 focus:border-[#2c83ec] focus:ring-[#2c83ec]/20 h-12 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-200">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200/60 dark:border-slate-700/60">
              <SelectItem value="all" className="cursor-pointer rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#87c232]" />
                  All Locations
                </div>
              </SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location} className="cursor-pointer rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#87c232]" />
                    {location}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClearFilters}
              className="w-full flex items-center justify-center gap-2 border-slate-200/60 dark:border-slate-700/60 hover:border-[#2c83ec] hover:text-[#2c83ec] hover:bg-[#2c83ec]/5 transition-all duration-300 h-12 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group"
            >
              <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#87c232] rounded-full"></div>
              <span className="text-xs font-medium text-muted-foreground">Active Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <div className="px-2 py-1 bg-[#2c83ec]/10 text-[#2c83ec] text-xs rounded-full border border-[#2c83ec]/20">
                  Search: {searchTerm}
                </div>
              )}
              {selectedDepartment !== "all" && (
                <div className="px-2 py-1 bg-[#87c232]/10 text-[#87c232] text-xs rounded-full border border-[#87c232]/20">
                  {selectedDepartment}
                </div>
              )}
              {selectedEmploymentType !== "all" && (
                <div className="px-2 py-1 bg-[#2c83ec]/10 text-[#2c83ec] text-xs rounded-full border border-[#2c83ec]/20">
                  {selectedEmploymentType.replace(/_/g, " ")}
                </div>
              )}
              {selectedLocation !== "all" && (
                <div className="px-2 py-1 bg-[#87c232]/10 text-[#87c232] text-xs rounded-full border border-[#87c232]/20">
                  {selectedLocation}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
