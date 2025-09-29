import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'student' | 'company' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType 
}) => {
  const { user, loading, getUserType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // In development mode, allow access without authentication
      if (process.env.NODE_ENV === 'development') {
        return;
      }

      if (!user) {
        navigate('/auth');
        return;
      }

      if (requiredUserType && getUserType() !== requiredUserType) {
        navigate('/role-selection');
        return;
      }
    }
  }, [user, loading, requiredUserType, navigate, getUserType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // In development mode, allow access without authentication
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  if (requiredUserType && getUserType() !== requiredUserType) {
    return null;
  }

  return <>{children}</>;
};