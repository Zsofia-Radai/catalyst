import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SessionInputs } from "../types/session";
import { createSession as createSessionApi } from "../../../api/sessionsApi";

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionInputs,
      day,
    }: {
      sessionInputs: SessionInputs;
      day: Date;
    }) => createSessionApi(sessionInputs, day),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      }),
  });
}
