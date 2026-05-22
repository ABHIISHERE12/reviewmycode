import { Search, Bell } from "lucide-react";

function Navbar() {
  return (
    <div className="navbar animate-fade-in">
      <div>
        <h2>Dashboard</h2>
      </div>

      <div className="navbar-right">
        <div className="search-bar">
          <Search className="search-icon" />
          <input type="text" placeholder="Search repositories, issues..." />
        </div>

        <button className="icon-btn">
          <Bell size={20} />
        </button>

        <div className="profile">
          <img src="https://i.pravatar.cc/150?img=11" alt="profile" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
