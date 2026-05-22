import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderGit2, ShieldAlert } from "lucide-react";

function Sidebar() {
  return (
    <div className="sidebar">
      <h1>
        <ShieldAlert size={28} color="var(--accent-color)" />
        ReviewAI
      </h1>

      <nav>
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/repositories"
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <FolderGit2 size={20} />
          Repositories
        </NavLink>
        
        <NavLink 
          to="/reviews"
          className={({ isActive }) => isActive ? "active" : ""}
        >
          <ShieldAlert size={20} />
          Reviews
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
