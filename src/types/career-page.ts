
export interface JobApplicationInfo {
    full_name: string;
    email: string;
    phone: string;
    linkedin_profile_url: string;
    description: string;
    job_requisition_fid: number;
    candidate_fid?: number;
    company_fid: number;
    company_reg_fid: number;
    department_fid: number;
    image_url?: File | null;
}

export interface Job {
    id?: number
    company_fid: number
    company_reg_fid: number
    department_fid: number
    designation_fid: number
    location_fid: number | string
    job_description: string
    salary_min: number
    salary_max: number
    salary_currency: string
    salary_type: string
    salary_frequency: string
    status: string
    no_of_vacancy: number
    position_fid?: number | null
    job_level_fid: number
    key_result_areas?: string
    role_resp?: string
    time_equivalent?: string
    employee_category_fid: number
    skill_required?: { id: number; name: string }[]
    qualification?: { id: number; name: string }[]
    certification_required?: { id: number; display_name: string }[]
    is_activated: boolean
    is_deleted: boolean
    created_by: number
    updated_by?: number | null
    created_date: string
    updated_date?: string
    department_directory?: {
        department_name: string
        display_name: string
    }
    designation_directory?: {
        designation_name: string
        display_name: string
    }
    location_directory?: {
        location_name: string
        display_name: string
    }
    job_level_directory?: {
        display_name: string
    }
    employee_category?: {
        category_name: string
    }
    _count?: {
        applications: number
    }
}

export interface RegisterUserInfo {
  company_fid: number;
  company_reg_fid: number;
  department_fid: number;
  full_name: string;
  login_email: string;
  login_password: string;
  phone?: string;
}
