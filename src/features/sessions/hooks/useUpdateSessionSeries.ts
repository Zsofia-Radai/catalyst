import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSessionSeries as updateSessionSeriesApi } from "../../../api/sessionsApi";
import type { Session } from "../types/session";

export function useUpdateSessionSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      updatedSession,
      originalSession,
    }: {
      updatedSession: Session;
      originalSession: Session;
    }) => updateSessionSeriesApi(updatedSession, originalSession),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      }),
  });
}
