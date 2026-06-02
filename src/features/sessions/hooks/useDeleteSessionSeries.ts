import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSessionSeries as deleteSessionSeriesApi } from "../../../api/sessionsApi";

export function useDeleteSessionSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSessionSeriesApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      }),
  });
}
