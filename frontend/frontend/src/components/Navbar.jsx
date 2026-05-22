function Navbar() {
  return (
    <div className="navbar">
      <div>
        <h2>AI Code Reviewer</h2>
      </div>

      <div className="navbar-right">
        <input type="text" placeholder="Search..." />

        <button>🔔</button>

        <div className="profile">
          <img src="https://i.pravatar.cc/40" alt="profile" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
