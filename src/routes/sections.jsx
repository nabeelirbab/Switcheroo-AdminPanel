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

// Define your routes configuration outside of the component
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
      { path:"dashboard" ,element: <IndexPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'reported-products', element: <ProductsPage /> },
      { path: 'reported-user', element: <ReportedUserPage /> },
      { path: 'total-items', element: <TotalItemsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
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
  // Always call useRoutes unconditionally
  const routingConfig = useRoutes(routes);

  // Conditionally render redirection if the pathname matches '/'
  if (window.location.pathname === '/') {
    return <Navigate to="/login" replace />;
  }

  return routingConfig;
}
