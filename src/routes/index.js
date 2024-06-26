import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation, Routes, Route } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Stepper />} />
    </Routes>
  );
  // return useRoutes([
  //   // Dashboard Routes
  //   {
  //     path: 'dashboard',
  //     element: <DashboardLayout />,
  //     children: [
  //       // formulaire
  //       { path: 'new', element: <Stepper /> }
  //       // liste des rapports
  //       // { path: 'list', element: <UserList /> }
  //     ]
  //   },

  //   // Main Routes
  //   {
  //     path: '/',
  //     element: <MainLayout />,
  //     children: [{ element: <LandingPage /> }]
  //   },
  //   { path: '*', element: <Navigate to="/404" replace /> }
  // ]);
}

const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
const Stepper = Loadable(lazy(() => import('../pages/components-overview/material-ui/stepper')));
