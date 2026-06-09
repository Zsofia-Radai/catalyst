import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setSessionCompleted as toggleSessionCompletedApi } from "../../../api/sessionsApi";
import type { Session } from "../types/session";

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

    onMutate: async ({ sessionId, completed }) => {
      await queryClient.cancelQueries({
        queryKey: ["sessions"],
      });

      const previousSessions = queryClient.getQueryData<Session[]>([
        "sessions",
      ]);

      queryClient.setQueryData<Session[]>(["sessions"], (old) =>
        old?.map((session) =>
          session.id === sessionId ? { ...session, completed } : session,
        ),
      );

      return { previousSessions };
    },

    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["sessions"], context?.previousSessions);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    },
  });
}
