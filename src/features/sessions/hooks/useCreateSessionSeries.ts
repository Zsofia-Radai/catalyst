import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SessionInputs } from "../types/session";
import { createSessionSeries as createSessionSeriesApi } from "../../../api/sessionsApi";

export function useCreateSessionSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionInputs,
      day,
    }: {
      sessionInputs: SessionInputs;
      day: Date;
    }) => createSessionSeriesApi(sessionInputs, day),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      }),
  });
}
