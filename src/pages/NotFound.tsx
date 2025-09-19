import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background radial-glow">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold font-display text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
        <p className="text-lg text-muted-foreground">Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="inline-block btn-primary px-6 py-3 rounded-lg text-white hover:bg-primary/90 transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
