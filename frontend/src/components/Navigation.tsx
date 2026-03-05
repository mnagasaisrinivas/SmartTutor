
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SmartTutor</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Button 
              variant={isActive("/dashboard") ? "default" : "ghost"}
              asChild
            >
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button 
              variant={isActive("/ask-question") ? "default" : "ghost"}
              asChild
            >
              <Link to="/ask-question">Ask Question</Link>
            </Button>
            <Button 
              variant={isActive("/practice") ? "default" : "ghost"}
              asChild
            >
              <Link to="/practice">Practice</Link>
            </Button>
            <Button 
              variant={isActive("/quiz") ? "default" : "ghost"}
              asChild
            >
              <Link to="/quiz">Quiz</Link>
            </Button>
            <Button 
              variant={isActive("/study-notes") ? "default" : "ghost"}
              asChild
            >
              <Link to="/study-notes">Notes</Link>
            </Button>
            <Button 
              variant={isActive("/saved-content") ? "default" : "ghost"}
              asChild
            >
              <Link to="/saved-content">Saved</Link>
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600 hidden md:block">
                Welcome, {user.name}
              </span>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
