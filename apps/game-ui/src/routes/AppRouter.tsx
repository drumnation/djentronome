import { ReactNode, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Center, Loader } from '@mantine/core';
import { Home } from '../screens/Home';

// Import placeholder screens
// These will be replaced with actual screen components later
const Game = () => <div>Game Screen</div>;
const Settings = () => <div>Settings Screen</div>;
const SongSelection = () => <div>Song Selection Screen</div>;
const Results = () => <div>Results Screen</div>;

// Loading fallback component
const LoadingFallback = () => (
  <Center style={{ width: '100%', height: '100%' }}>
    <Loader size="lg" />
  </Center>
);

type RouteConfig = {
  path: string;
  element: ReactNode;
};

// Route configurations
const routes: RouteConfig[] = [
  { path: AppRoutes.HOME, element: <Home /> },
  { path: AppRoutes.GAME, element: <Game /> },
  { path: AppRoutes.SETTINGS, element: <Settings /> },
  { path: AppRoutes.SONG_SELECTION, element: <SongSelection /> },
  { path: AppRoutes.RESULTS, element: <Results /> },
];

export const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to={AppRoutes.HOME} replace />} />
      </Routes>
    </Suspense>
  );
}; 