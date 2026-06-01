import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setSessionCompleted as toggleSessionCompletedApi } from "../../../api/sessionsApi";

export function useToggleSessionCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      completed,
    }: {
      sessionId: string;
      completed: boolean;
    }) => toggleSessionCompletedApi(sessionId, completed),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      }),
  });
}
