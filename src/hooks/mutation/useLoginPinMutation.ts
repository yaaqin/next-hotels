import { loginWithPin } from "@/src/services/auth/login";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";

export const useLoginPinMutation = () => {
  return useMutation({
    mutationKey: ["login-pin"],
    mutationFn: loginWithPin,

    onSuccess: (data) => {
      if (data?.accessToken) {
        setCookie("access_token", data.accessToken, {
          maxAge: 60 * 60 * 24, 
          secure: true,
          sameSite: "strict",
        });
      }

      if (data?.refreshToken) {
        setCookie("refresh_token", data.refreshToken, {
          maxAge: 60 * 60 * 24 * 7, 
          secure: true,
          sameSite: "strict",
        });
      }
    },
  });
};
