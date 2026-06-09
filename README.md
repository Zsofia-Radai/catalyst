# Catalyst

Catalyst is a habit planning and time-tracking app built with React, TypeScript, Vite, Supabase, and TanStack Query. It helps you define habits, schedule focused sessions for them, track completed work, and review progress through charts and summaries.

The app is organized around four main views:

- **Dashboard**: day and week planner for scheduling and editing sessions.
- **Habits**: active and archived habit management.
- **Sessions**: recent completed session history.
- **Analytics**: tracked hours by habit, category, and time range.

Dashboard:
<img width="1902" height="947" alt="catalyst_dashboard" src="https://github.com/user-attachments/assets/4643b080-7534-48bb-a073-2bc1c33c106f" />

Habits:
<img width="1901" height="949" alt="catalyst_habits" src="https://github.com/user-attachments/assets/b0c35ae9-a357-4616-a7e5-f70024515412" />

Sessions:
<img width="1901" height="947" alt="catalyst_sessions" src="https://github.com/user-attachments/assets/e905fb6e-c8d6-4284-85ef-d55683c8d52b" />

Analytics:
<img width="1903" height="949" alt="catalyst_analytics" src="https://github.com/user-attachments/assets/80306793-3f5a-4eed-957d-3ac86625b51e" />



## Features

- Create, edit, archive, restore, and delete habits.
- Archive and restore habits with optimistic UI updates.
- Categorize habits by mind, body, hobby, chore, career, finance, or social.
- Assign custom colors to habits for planner and chart visibility.
- Add one-off sessions from the day or week planner.
- Create recurring session series with daily, weekly, monthly, or yearly cadence.
- Edit or delete a single session.
- Edit or delete an entire recurring series.
- Mark sessions as completed with optimistic UI updates.
- Separate daytime and night sessions in the planner.
- Sign in anonymously on app startup for demo-friendly persistence.
- Seed demo habits and sessions for the current week.
- Reset demo data from the sidebar.
- View the 20 most recent completed sessions.
- Filter analytics by week, month, year, or all time.
- Filter analytics by active, archived, or all habits.
- See summary stats, habit-level charts, category charts, and logged-hour trends.

## Tech Stack

- **React 19** for UI.
- **TypeScript** for static typing.
- **Vite** for local development and production builds.
- **React Router** for page routing.
- **TanStack Query** for Supabase data fetching, mutations, and cache invalidation.
- **Supabase** for persistence.
- **React Hook Form** for form state.
- **date-fns** for date calculations.
- **Recharts** for analytics charts.
- **Lucide React** for icons.
- **Vitest** for unit tests.
- **ESLint** for linting.

## Getting Started

### Prerequisites

- Node.js installed.
- npm installed.
- A Supabase project with `habits` and `sessions` tables.

### Install Dependencies

```sh
npm install
```

On Windows PowerShell, if script execution blocks `npm`, use:

```sh
npm.cmd install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

These values are read in `src/lib/supabase.ts` and used to create the Supabase client.

### Run the App

```sh
npm run dev
```

For PowerShell script-policy environments:

```sh
npm.cmd run dev
```

Vite will print the local development URL, usually `http://localhost:5173`.

## Demo Data

On startup, the app signs in anonymously and seeds demo data if the current anonymous user has no habits yet.

The seed data is date-aware: sessions are generated for the current week rather than hard-coded calendar dates. This keeps the Dashboard useful whenever the app is opened.

Seeded data includes:

- 3 habits: Gym, Deep work, and Reading.
- Gym one-off sessions on Monday and Friday.
- Deep work as a recurring daily series from Tuesday through Thursday, 11:00-12:30.
- Reading as a recurring daily series from Saturday through Sunday, 08:00-09:00.

The sidebar includes a **Reset demo data** button. It clears the current user's visible habits and sessions, recreates the demo data for the current week, and refreshes the cached habit/session queries.

## Available Scripts

```sh
npm run dev
```

Starts the Vite development server.

```sh
npm run build
```

Runs TypeScript project checks and creates a production build in `dist`.

```sh
npm run lint
```

Runs ESLint across the project.

```sh
npm test
```

Runs the Vitest unit test suite once.

```sh
npm run preview
```

Serves the production build locally for previewing.

## Supabase Data Model

The app expects two main tables: `habits` and `sessions`.

### `habits`

| Column | Expected type | Notes |
| --- | --- | --- |
| `id` | uuid or text | Primary identifier. |
| `name` | text | Habit display name. |
| `category` | text | One of `mind`, `body`, `hobby`, `chore`, `career`, `finance`, or `social`. |
| `goal` | text, nullable | Optional goal or description. |
| `color` | text | Hex color used in cards, planners, and charts. |
| `createdAt` | number or timestamp-compatible value | Used by the app type as habit creation metadata. |
| `archived` | boolean | Controls active versus archived habit views. |

### `sessions`

| Column | Expected type | Notes |
| --- | --- | --- |
| `id` | uuid or text | Primary identifier. |
| `habit_id` | uuid or text | References the habit being tracked. |
| `started_at` | timestamp/text | Session start date and time. |
| `finished_at` | timestamp/text | Session end date and time. |
| `notes` | text, nullable | Session notes. |
| `completed` | boolean | Whether the session counts toward tracked hours. |
| `frequency` | text | One of `none`, `daily`, `weekly`, `monthly`, or `yearly`. |
| `repeat_until` | timestamp/text, nullable | End date for recurring series. |
| `series_id` | uuid/text, nullable | Shared ID for sessions in the same recurring series. |

The API layer maps database snake_case fields to application camelCase types in `src/features/sessions/utils/sessionsUtils.ts`.

## Project Structure

```txt
src/
  api/
    habitsApi.ts
    sessionsApi.ts
  context/
    ToastContext.tsx
  features/
    habits/
      components/
      hooks/
      types/
      utils/
    sessions/
      components/
      hooks/
      types/
      utils/
  hooks/
  layout/
  lib/
    supabase.ts
  pages/
    AnalyticsPage/
    DashboardPage.tsx
    HabitsPage.tsx
    SessionsPage.tsx
  ui/
  utils/
```

### Important Areas

- `src/router.tsx` defines the application routes.
- `src/layout/AppLayout.tsx` renders the app title, navigation, and route outlet.
- `src/main.tsx` initializes anonymous auth, seeds demo data, creates the React root, and provides the TanStack Query client.
- `src/api/` contains all Supabase reads and writes.
- `src/features/*/hooks/` wraps API calls in TanStack Query hooks.
- `src/features/*/types/` defines domain types and constants.
- `src/features/*/utils/` contains reusable domain logic.
- `src/utils/demoData.ts` defines and resets the demo habits and current-week sessions.
- `src/ui/` contains shared UI building blocks such as buttons, tabs, modals, loaders, empty states, and toast notifications.

## Routing

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | `DashboardPage` | Main planner view. |
| `/habits` | `HabitsPage` | Habit management. |
| `/sessions` | `SessionsPage` | Recent completed sessions. |
| `/analytics` | `AnalyticsPage` | Charts and progress summaries. |

## Data Flow

1. Pages call feature hooks such as `useHabits`, `useSessions`, `useCreateHabit`, or `useUpdateSession`.
2. Hooks use TanStack Query to call functions in `src/api/`.
3. API functions read from or write to Supabase.
4. Successful mutations invalidate the relevant query keys, usually `habits` or `sessions`.
5. Selected high-frequency actions update the cache optimistically before the Supabase request finishes.
6. Pages re-render with the updated data.

This keeps Supabase-specific logic out of the UI and centralizes cache behavior inside feature hooks.

Optimistic updates are currently used for:

- toggling session completion
- archiving habits
- restoring habits

## Habits

Habits are managed on the Habits page. A habit contains:

- name
- category
- optional goal
- color
- archived state

Active habits are available in the planner. Archived habits are hidden from active workflows but can still be restored and included in analytics with the archived/all filters.

Archiving and restoring habits use optimistic updates so the habit moves between active and archived states immediately while the Supabase mutation is still in flight.

## Sessions

Sessions represent scheduled or completed time blocks for a habit. The planner supports both day and week views.

A session contains:

- habit reference
- start date/time
- finish date/time
- notes
- completed state
- recurrence details
- optional series ID

Recurring sessions are expanded into individual session rows. Sessions in the same recurrence group share a `series_id`, allowing the app to update or delete an entire series.

Session completion toggles use optimistic updates so completed state changes feel immediate in the planner, session list, and analytics-backed views.

### Known Recurring Session Edge Cases

Recurring sessions work for common daily, weekly, monthly, and yearly schedules, but the current implementation intentionally stays simple and does not handle every calendar edge case yet.

Known limitations include:

- Monthly recurrence can behave unexpectedly when the starting day does not exist in a later month, such as a session that starts on January 31.
- Yearly recurrence can behave unexpectedly around leap days, such as sessions scheduled on February 29.
- Daylight saving time transitions may shift perceived session times depending on the local timezone and stored date values.
- Overnight recurring sessions need careful handling because the UI and analytics often reason about the start date as the session date.
- The app does not currently support skipping, moving, or editing only selected future occurrences in a recurring series.
- The app does not support custom recurrence rules such as weekdays only, every other week, selected days of the week, or exceptions.
- Recurring session completion is based on generated session rows; there is no background process that continuously normalizes future/past completion state.
- A recurring session requires a repeat-until date in the current utility logic.

These are good candidates for future work before relying on recurrence for complex scheduling.

## Analytics

The Analytics page only counts completed sessions. It supports:

- range filtering: week, month, year, all time
- habit filtering: active habits, archived habits, all habits
- total logged hours
- completed session count
- most active habit
- logged hours by habit
- logged hours by category
- logged-hours trend over time

Analytics calculations live in `src/pages/AnalyticsPage/utils/analyticsUtils.ts`.

## Testing

Unit tests use Vitest and focus on pure utility logic.

Current test coverage includes:

- habit logged-hour aggregation
- session date conversion and duration helpers
- recurring session row generation
- planner session style calculations
- analytics range checks and trend aggregation

Run tests with:

```sh
npm test
```

For PowerShell script-policy environments:

```sh
npm.cmd test
```

## Development Notes

- Keep Supabase access inside `src/api/`.
- Prefer feature hooks for all data access from components.
- Put reusable domain calculations in `utils` files and cover them with unit tests.
- Keep UI primitives in `src/ui/` when they are shared by multiple pages.
- Use route-level pages for screen composition and feature-level components for domain-specific UI.
- Invalidate the smallest useful TanStack Query key after mutations.

## Future Development Plans

Potential next improvements:

- Add quick tasks for short day-specific work that takes less than 15 minutes and only needs a checkmark when finished.
- Harden recurring sessions around month-end dates, leap years, daylight saving time, and overnight sessions.
- Add richer recurrence options, including selected weekdays, interval-based repeats, and exceptions.
- Support editing one occurrence, all occurrences, or only future occurrences in a series.
- Add database constraints or generated types for Supabase tables to reduce drift between the backend schema and TypeScript models.
- Add integration tests for habit and session CRUD flows.
- Add component tests for modal forms, planner interactions, and analytics filters.
- Improve analytics with streaks, goal completion, category comparisons, and habit-specific detail pages.
- Add authentication and per-user data isolation if the app becomes multi-user.
- Improve bundle size through route-level code splitting if production build size becomes a priority.

### Quick Tasks

Quick tasks are a planned feature for small pieces of work that do not need a full timed session. They would be useful for things that take less than 15 minutes, such as checking the postbox, loading or unloading the dishwasher, watering plants, sending a short message, or doing a quick reset of a room.

The intended behavior is:

- Create an occasional quick task for a specific day.
- Create reusable quick-task templates for small routines that repeat often but do not need habit-style time tracking.
- Schedule quick tasks into the daily planner without requiring start and finish times.
- Mark quick tasks as done with a simple checkmark.
- Keep quick tasks separate from logged-hour analytics, since they represent completion rather than tracked duration.
- Optionally show quick-task completion in lightweight daily summaries.

This would create a useful middle ground between habits and sessions: habits define larger ongoing areas of effort, sessions track focused time, and quick tasks capture small recurring or occasional actions.

## Production Build

Create a production build with:

```sh
npm run build
```

The output is written to `dist`.

Vite may warn if a generated JavaScript chunk is larger than 500 kB. That warning does not necessarily mean the build failed; it is a prompt to consider code splitting if bundle size becomes a priority.
