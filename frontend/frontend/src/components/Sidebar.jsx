import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h1>ReviewAI</h1>

      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/repositories">Repositories</Link>
        <Link to="/reviews">Reviews</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
