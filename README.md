# Study Companion

Study Companion is a React + Vite study planner built for organizing subjects, topics, tasks, and revision schedules. It includes a dashboard with progress analytics, subject/topic management, task filtering, a revision calendar, dark mode support, and AI-powered study material generation.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Pages](#available-pages)
- [State Management](#state-management)
- [AI Tools](#ai-tools)
- [Scripts](#scripts)
- [Future Improvements](#future-improvements)

## Features

- Responsive sidebar navigation with routes for Dashboard, Subjects, Tasks, Revision, and AI Tools.
- Persistent study data stored in `localStorage` for subjects, topics, and tasks.
- Subject and topic management with custom metadata, difficulty, status, and notes.
- Task creation, filtering, sorting, search, and tabbed views for Pending, Completed, Overdue, and Revision tasks.
- Analytics dashboard showing total tasks, completion rates, subject progress, and weekly productivity charts.
- Revision calendar with scheduled task visibility by selected date.
- Dark mode toggle with theme persistence across sessions.
- AI material generation for summaries, practice questions, and flashcards with built-in fallback when API key is missing.

## Project Structure

- `src/App.jsx` - Main application layout, routing, and toast notifications.
- `src/main.jsx` - App bootstrap and provider wrapping.
- `src/context/StudyContext.jsx` - Global study state using React context and `localStorage` persistence.
- `src/context/ThemeContext.jsx` - Theme toggle and dark mode persistence.
- `src/hooks/useSubjects.js` - Subject/topic CRUD helpers.
- `src/hooks/useTasks.js` - Task CRUD and tab filtering logic.
- `src/hooks/useProgress.js` - Dashboard analytics and chart data.
- `src/pages` - Page-level UI screens and feature implementations.
- `src/components` - Reusable UI pieces like sidebar, dark mode toggle, cards, and modal.
- `src/services/aiService.js` - AI generation service with environment-based API key support.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- React Router v7
- React Hook Form
- Yup validation
- React Toastify
- Recharts
- React Calendar
- Framer Motion
- Axios
- UUID

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser to view the app.

## Environment Variables

The AI tools page uses a Gemini API key if available. Create a `.env` file at the project root with:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

If `VITE_GEMINI_API_KEY` is not set, the app uses a built-in mock response for development and testing.

## Available Pages

### Dashboard

- Displays summary cards for total tasks, completed tasks, pending tasks, and revision tasks.
- Shows a subject progress bar chart and weekly productivity line chart.
- Includes an overall completion ring with motivational status text.

### Subjects

- Add and remove subjects.
- Create topics within each subject.
- Track difficulty, status, and notes for each topic.
- Search topics by name or notes.

### Tasks

- Add tasks with title, subject, topic, deadline, and priority.
- Use tabs to switch between All, Pending, Completed, Overdue, and Revision views.
- Search tasks by title.
- Filter tasks by subject, priority, and deadline range.
- Sort tasks by deadline, priority, or title.

### Revision

- Interactive calendar view for scheduled tasks.
- Highlight task dates and show tasks for the selected day.
- Supports deadline-based revision planning.

### AI Tools

- Generate AI-powered study summaries, practice questions, or flashcards.
- Copy generated output to clipboard.
- Uses `axios` to call Gemini API when an API key is configured.

## State Management

The app uses React Context with two providers:

- `ThemeProvider` for dark/light mode toggling and persistence.
- `StudyProvider` for storing `subjects`, `topics`, and `tasks`.

Data is synced to `localStorage` automatically whenever study state changes.

## AI Tools

The AI page builds prompts based on user input and generation type:

- `summary` - concise study summary.
- `questions` - practice questions.
- `flashcards` - formatted flashcards.

The AI service attempts a network request when `VITE_GEMINI_API_KEY` is available. If not, it returns mock content so the UI remains functional during local development.

## Scripts

- `npm run dev` - Start the Vite development server.
- `npm run build` - Build the app for production.
- `npm run preview` - Preview the production build locally.
- `npm run lint` - Run ESLint on the project.

## Future Improvements

- Add task editing and status updates directly from task cards.
- Implement subject/topic detail pages with progress breakdown.
- Add reminder notifications and calendar sync.
- Persist AI history or saved study sessions.
- Add authentication for multi-user support.