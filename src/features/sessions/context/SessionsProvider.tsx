import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSession as createSessionApi,
  createSessionSeries as createSessionSeriesApi,
  deleteSession as deleteSessionApi,
  deleteSessionSeries as deleteSessionSeriesApi,
  getSessions,
  setSessionCompleted as toggleSessionCompletedApi,
  updateSession as updateSessionApi,
  updateSessionSeries as updateSessionSeriesApi,
} from "../../../api/sessionsApi";
import type { Session, SessionInputs } from "../types/session";
import { SessionsContext, type SessionContextValue } from "./SessionsContext";
import { getErrorMessage } from "../../../utils/errorUtils";

export function SessionsProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["sessions"],
    queryFn: getSessions,
  });

  const invalidateSessions = () =>
    queryClient.invalidateQueries({
      queryKey: ["sessions"],
    });

  const createSessionMutation = useMutation({
    mutationFn: ({
      sessionInputs,
      day,
    }: {
      sessionInputs: SessionInputs;
      day: Date;
    }) => createSessionApi(sessionInputs, day),
    onSuccess: invalidateSessions,
  });

  const createSessionSeriesMutation = useMutation({
    mutationFn: ({
      sessionInputs,
      day,
    }: {
      sessionInputs: SessionInputs;
      day: Date;
    }) => createSessionSeriesApi(sessionInputs, day),
    onSuccess: invalidateSessions,
  });

  const updateSessionMutation = useMutation({
    mutationFn: updateSessionApi,
    onSuccess: invalidateSessions,
  });

  const updateSessionSeriesMutation = useMutation({
    mutationFn: updateSessionSeriesApi,
    onSuccess: invalidateSessions,
  });

  const deleteSessionMutation = useMutation({
    mutationFn: deleteSessionApi,
    onSuccess: invalidateSessions,
  });

  const deleteSessionSeriesMutation = useMutation({
    mutationFn: deleteSessionSeriesApi,
    onSuccess: invalidateSessions,
  });

  const toggleSessionCompletedMutation = useMutation({
    mutationFn: ({
      sessionId,
      completed,
    }: {
      sessionId: string;
      completed: boolean;
    }) => toggleSessionCompletedApi(sessionId, completed),
    onSuccess: invalidateSessions,
  });

  const createSession = async (sessionInputs: SessionInputs, day: Date) => {
    await createSessionMutation.mutateAsync({ sessionInputs, day });
  };

  const createSessionSeries = async (
    sessionInputs: SessionInputs,
    day: Date,
  ) => {
    await createSessionSeriesMutation.mutateAsync({ sessionInputs, day });
  };

  const updateSession = async (session: Session) => {
    await updateSessionMutation.mutateAsync(session);
  };

  const updateSessionSeries = async (updatedSession: Session) => {
    await updateSessionSeriesMutation.mutateAsync(updatedSession);
  };

  const deleteSession = async (sessionId: string) => {
    await deleteSessionMutation.mutateAsync(sessionId);
  };

  const deleteSessionSeries = async (seriesId: string) => {
    await deleteSessionSeriesMutation.mutateAsync(seriesId);
  };

  const toggleSessionCompleted = async (session: Session) => {
    await toggleSessionCompletedMutation.mutateAsync({
      sessionId: session.id,
      completed: !session.completed,
    });
  };

  const value: SessionContextValue = {
    sessions: query.data ?? [],
    createSession,
    createSessionSeries,
    updateSession,
    updateSessionSeries,
    deleteSession,
    deleteSessionSeries,
    toggleSessionCompleted,
    isSessionsLoading: query.isLoading,
    error: query.error ? getErrorMessage(query.error) : null,
  };

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}
