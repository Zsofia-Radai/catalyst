import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSession as deleteSessionApi } from "../../../api/sessionsApi";

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSessionApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      }),
  });
}
