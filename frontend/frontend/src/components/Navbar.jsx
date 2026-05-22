import { Search, Bell, Sparkles } from "lucide-react";
import { GithubIcon } from "./GithubIcon";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const pathName = location.pathname === "/" ? "Dashboard" : location.pathname.substring(1);
  const title = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <header className="h-20 px-6 md:px-10 flex items-center justify-between sticky top-0 z-40 bg-background/40 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-100 tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="relative hidden md:block group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
          <div className="relative flex items-center bg-surface border border-border rounded-full px-4 py-2 w-64 lg:w-80 transition-colors focus-within:border-primary/50 focus-within:bg-panel focus-within:ring-1 focus-within:ring-primary/50">
            <Search className="text-gray-500 w-4 h-4 mr-3 shrink-0" />
            <input 
              type="text" 
              placeholder="Ask AI or search repos..." 
              className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder:text-gray-600"
            />
            <div className="absolute right-2 px-2 py-0.5 rounded-md bg-white/5 text-gray-500 text-xs font-mono border border-white/10 flex items-center gap-1">
              <Sparkles size={10} className="text-primary" /> AI
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#24292e]/50 border border-white/10 text-sm text-gray-300">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <GithubIcon size={14} />
            <span>Connected</span>
          </div>

          <button className="relative p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger border-2 border-background" />
          </button>

          <div className="h-8 w-px bg-border mx-1" />

          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-500 opacity-0 group-hover:opacity-40 transition-opacity" />
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
