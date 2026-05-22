function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="card">
          <h3>Total Reviews</h3>
          <p>128</p>
        </div>

        <div className="card">
          <h3>Repositories</h3>
          <p>12</p>
        </div>

        <div className="card">
          <h3>Security Issues</h3>
          <p>8</p>
        </div>

        <div className="card">
          <h3>AI Suggestions</h3>
          <p>342</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
