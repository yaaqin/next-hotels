"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => true,
    onSuccess: () => {
      deleteCookie("access_token");
      deleteCookie("refresh_token");
    },
  });
};
