import PropTypes from 'prop-types';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  const authenticated = !!user;
  return authenticated;
};

// ProtectedRoute component to handle authentication checks
const ProtectedRoute = ({ element, ...rest }) =>
  isAuthenticated() ? element : <Navigate to="/404" replace />;

// Define PropTypes validation for ProtectedRoute
ProtectedRoute.propTypes = {
  element: PropTypes.node.isRequired,
};

// Lazy load other pages
const IndexPage = lazy(() => import('src/pages/app'));
const UserPage = lazy(() => import('src/pages/user'));
const LoginPage = lazy(() => import('src/pages/login'));
const ReportedUserPage = lazy(() => import('src/pages/reported-user'));
const ProductsPage = lazy(() => import('src/pages/products'));
const TotalItemsPage = lazy(() => import('src/pages/items'));
const NotificationsPage = lazy(() => import('src/pages/notifications'));
const NotificationsDetailsPage = lazy(() => import('src/sections/Notifications/Notification-details'));
const Page404 = lazy(() => import('src/pages/page-not-found'));
const UserProfile = lazy(() => import('src/pages/user-profile'));

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
      { path: 'dashboard', element: <ProtectedRoute element={<IndexPage />} /> },
      { path: 'user', element: <ProtectedRoute element={<UserPage />} /> },
      { path: 'reported-products', element: <ProtectedRoute element={<ProductsPage />} /> },
      { path: 'reported-user', element: <ProtectedRoute element={<ReportedUserPage />} /> },
      { path: 'total-items', element: <ProtectedRoute element={<TotalItemsPage />} /> },
      { path: 'notifications', element: <ProtectedRoute element={<NotificationsPage />} /> },
      { path: 'notifications/:notificationId', element: <NotificationsDetailsPage /> },
      { path: 'user-profile/:userId', element: <ProtectedRoute element={<UserProfile />} /> },
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

// Router component
export default function Router() {
  const routingConfig = useRoutes(routes);
  if (!isAuthenticated() && window.location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return routingConfig;
}
