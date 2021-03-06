import { RegisterFormInput } from "../../components/auth/RegisterForm";
// import decode from "jwt-decode";
import apiClient from "./apiClient";

export interface ApiResponse<T> {
  response: string;
  message: string;
  data: T;
}

export const register = async ({
  username,
  password,
  member_group,
  member_name,
  member_rank,
  dog_tags,
}: RegisterFormInput) => {
  const response = await apiClient.post<ApiResponse<string>>("/user/signup", {
    username,
    password,
    member_group,
    member_name,
    member_rank,
    dog_tags,
  });
  // accessToken을 Authorization 헤더 기본값으로 설정
  apiClient.defaults.headers.common["Authorization"] = response.data.data;
  localStorage.setItem("accessToken", response.data.data);
};

export const login = async (username: string, password: string) => {
  const response = await apiClient.post<ApiResponse<string>>("/user/signin", {
    username,
    password,
  });
  if (response.data.response !== "success") {
    throw new Error(response.data.message);
  }
  // accessToken을 Authorization 헤더 기본값으로 설정
  apiClient.defaults.headers.common["Authorization"] = response.data.data;
  localStorage.setItem("accessToken", response.data.data);
};

// export const refreshToken = async (): Promise<string> => {
//   const response = await apiClient.get<LoginResponse>("/user/refreshtoken");
//   // accessToken을 Authorization 헤더 기본값으로 설정
//   apiClient.defaults.headers.common["Authorization"] = response.data.data;
//   localStorage.setItem("accessToken", response.data.data);
//   const { username } = decode(response.data.data);
//   return username;
// };

export const logout = async () => {
  await apiClient.post("/user/signout");
  // Authorization 헤더 제거
  delete apiClient.defaults.headers.common["Authorization"];
  localStorage.removeItem("accessToken");
};
