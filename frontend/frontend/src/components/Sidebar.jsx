import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderGit2, ShieldAlert, Settings, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Repositories", icon: FolderGit2, path: "/repositories" },
    { name: "Pull Requests", icon: FolderGit2, path: "/pr" },
    { name: "AI Reviews", icon: ShieldAlert, path: "/reviews" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <motion.aside 
      initial={{ width: 260 }}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-surface/50 border-r border-border backdrop-blur-xl relative flex flex-col z-20 h-full"
    >
      <div className="p-6 flex items-center justify-between">
        <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <ShieldAlert size={18} className="text-white" />
          </div>
          {!collapsed && (
            <motion.h1 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 whitespace-nowrap"
            >
              ReviewAI
            </motion.h1>
          )}
        </div>
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-surface border border-border rounded-full p-1 text-gray-400 hover:text-white hover:border-gray-500 transition-colors z-30"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="flex-1 px-4 flex flex-col gap-2 mt-4 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink 
            key={item.name}
            to={item.path} 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon size={20} className={`shrink-0 z-10 ${isActive ? 'text-primary' : 'group-hover:text-gray-300 transition-colors'}`} />
                {!collapsed && (
                  <span className="font-medium whitespace-nowrap z-10">{item.name}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className={`p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex flex-col gap-3 overflow-hidden ${collapsed ? 'items-center px-2' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
            <span className="text-indigo-400 text-xs font-bold">PRO</span>
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-gray-200 whitespace-nowrap">Enterprise Plan</p>
              <p className="text-xs text-gray-400 mt-1">Unlimited Repositories</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
