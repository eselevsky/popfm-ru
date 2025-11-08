import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { AppLayout } from './components/layout/AppLayout';
import { GenresPage } from './pages/GenresPage';
import { StationsByTagPage } from './pages/StationsByTagPage';
import { CountriesPage } from './pages/CountriesPage';
import { StationsByCountryPage } from './pages/StationsByCountryPage';
// Placeholder component for routes that are not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <AppLayout>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 text-center">
        <h1 className="font-pixel text-4xl text-retro-primary">{title}</h1>
        <p className="mt-4 text-lg text-retro-accent/80">Coming soon...</p>
      </div>
    </div>
  </AppLayout>
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/station/:stationId",
    element: <PlaceholderPage title="Station Details" />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/genres",
    element: <GenresPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/genres/:tagName",
    element: <StationsByTagPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/countries",
    element: <CountriesPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/countries/:countryName",
    element: <StationsByCountryPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/favorites",
    element: <PlaceholderPage title="Favorites" />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)