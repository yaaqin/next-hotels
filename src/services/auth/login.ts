import { axiosPublic } from "@/src/libs/instance";

interface LoginPayload {
  identifier: string;
  password: string;
}

export const loginWithPin = async (payload: LoginPayload) => {
  const res = await axiosPublic.post(
    "/auth/login",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, 
    }
  );

  return res.data;
};
