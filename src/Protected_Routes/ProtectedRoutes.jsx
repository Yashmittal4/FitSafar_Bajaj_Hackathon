import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';  

export const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminRoute = () => {
  const { user } = useAuth();
  return user && user.email === 'yashmittal4949@gmail.com' ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};