import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfileProps {
  showRole?: boolean;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  showRole = true, 
  className = "" 
}) => {
  const { user } = useAuth();

  if (!user) return null;

  // Get user data from metadata or user object
  const userName = user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   user.user_metadata?.display_name ||
                   user.email?.split('@')[0] || 
                   'User';
  
  const userEmail = user.email || '';
  const userAvatar = user.user_metadata?.avatar_url || 
                     user.user_metadata?.picture || 
                     '';
  
  const userRole = user.user_metadata?.user_type || 'student';
  
  // Get initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={userAvatar} alt={userName} />
        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>
      <div className="text-right">
        <p className="text-sm font-medium text-foreground truncate max-w-32">
          {userName}
        </p>
        {showRole && (
          <p className="text-xs text-muted-foreground capitalize">
            {userRole}
          </p>
        )}
      </div>
    </div>
  );
};
