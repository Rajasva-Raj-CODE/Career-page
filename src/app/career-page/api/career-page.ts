import axiosInstance from "@/api/axiosInstance";
import axios from "@/api/axiosInstance";
import { JobApplicationInfo, RegisterUserInfo } from "@/app/career-page/types/career-page";

export const AllJobsRequisitionsInfo = async (
  skip: number,
  pageSize: number,
  searchText: string,
  search: string,
  fromDate: string,
  toDate: string
) => {
  try {
    console.log("searc-arry", search);

    const response = await axios.post(
      "talent-acquisition/job-requisition/get-all",
      { search, searchText, fromDate, toDate, skip: skip, limit: pageSize }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Jobs info:", error);
    throw error;
  }
};

export const JobApplication = async (data: JobApplicationInfo) => {
  try {
    const response = await axios.post(
      "talent-acquisition/application/create",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in Job Application:", error);
    throw error;
  }
};


export const registerUser = async (data: RegisterUserInfo) => {
  try {
    const response = await axiosInstance.post(
      "talent-acquisition/candidate/create",
      data
    );
    return response.data as { status: boolean; message: string };
  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
};


export const loginUser = async (data: {
  login_email: string;
  login_password: string;
}) => {
  try {
    const response = await axiosInstance.post(
      "talent-acquisition/candidate/login",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get("talent-acquisition/candidate/get");
    return response.data;
  } catch (error) {
    console.error("Profile Error:", error);
    throw error;
  }
};

export const updateCandidateProfile = async (data: FormData) => {
  try {
    const response = await axiosInstance.put(
      "talent-acquisition/candidate/update",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Updating Profile:", error);
    throw error;
  }
};

