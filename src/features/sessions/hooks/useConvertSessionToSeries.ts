import { useMutation, useQueryClient } from "@tanstack/react-query";
import { convertSessionToSeries as convertSessionToSeriesApi } from "../../../api/sessionsApi";

export function useConvertSessionToSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: convertSessionToSeriesApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      }),
  });
}
