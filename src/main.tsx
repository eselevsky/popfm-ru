import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { GenresPage } from './pages/GenresPage';
import { StationsByTagPage } from './pages/StationsByTagPage';
import { CountriesPage } from './pages/CountriesPage';
import { StationsByCountryPage } from './pages/StationsByCountryPage';
import { StationDetailPage } from './pages/StationDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/station/:stationuuid",
    element: <StationDetailPage />,
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
    element: <FavoritesPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)