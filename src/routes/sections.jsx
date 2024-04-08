import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const UserPage = lazy(() => import('src/pages/user'));
export const ReportedUserPage = lazy(() => import('src/pages/reported-user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const TotalItemsPage = lazy(() => import('src/pages/items'));
export const NotificationsPage = lazy(() => import('src/pages/notifications'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const UserProfile = lazy(() => import('src/pages/user-profile'));

const routes = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { path: "dashboard", element: <IndexPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'reported-products', element: <ProductsPage /> },
      { path: 'reported-user', element: <ReportedUserPage /> },
      { path: 'total-items', element: <TotalItemsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'user-profile', element: <UserProfile /> },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: '404',
    element: <Page404 />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];

export default function Router() {
  // const { isAuthenticated } = useAuth(); // Get authentication state from AuthContext
  const routingConfig = useRoutes(routes);

 
  // Check authentication before rendering routes
  if (window.location.pathname === '/') {
    // If user is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return routingConfig;
}
