import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSession as updateSessionApi } from "../../../api/sessionsApi";

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSessionApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      }),
  });
}
