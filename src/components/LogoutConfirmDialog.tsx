import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface LogoutConfirmDialogProps {
  children: React.ReactNode;
}

export const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await signOut();
    
    if (!error) {
      navigate('/');
      setOpen(false);
    }
    
    setLoading(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="glass-card-premium">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to logout? You'll need to sign in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Logging out...' : 'Logout'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};