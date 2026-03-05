
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter">SmartTutor</h1>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
            {[
              { to: "/dashboard", label: "Dashboard" },
              { to: "/ask-question", label: "Ask AI" },
              { to: "/practice", label: "Practice" },
              { to: "/quiz", label: "Quiz" },
              { to: "/study-notes", label: "Notes" },
              { to: "/saved-content", label: "Library" }
            ].map((item) => (
              <Button 
                key={item.to}
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-lg font-bold text-xs uppercase tracking-widest px-4 transition-all",
                  isActive(item.to) 
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                )}
                asChild
              >
                <Link to={item.to}>{item.label}</Link>
              </Button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block leading-tight">
                  <p className="text-xs font-black text-slate-900 truncate max-w-[120px]">
                    {user.full_name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]">
                    {user.email}
                  </p>
                </div>
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                    {getInitials(user.full_name)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="h-9 w-9 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Helper for conditional classes
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default Navigation;
