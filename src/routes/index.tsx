import { createBrowserRouter } from "react-router-dom";
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { HomePage } from '@/pages/HomePage';
import { GenresPage } from '@/pages/GenresPage';
import { StationsByTagPage } from '@/pages/StationsByTagPage';
import { CountriesPage } from '@/pages/CountriesPage';
import { StationsByCountryPage } from '@/pages/StationsByCountryPage';
import { StationDetailPage } from '@/pages/StationDetailPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
export const router = createBrowserRouter([
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