import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSessionSeries as updateSessionSeriesApi } from "../../../api/sessionsApi";

export function useUpdateSessionSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSessionSeriesApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      }),
  });
}
