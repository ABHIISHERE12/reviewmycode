function Repositories() {
  const repos = ["AI-Code-Review", "MERN-Ecommerce", "DevOps-Pipeline"];

  return (
    <div>
      <h1>Repositories</h1>

      <div className="repo-grid">
        {repos.map((repo) => (
          <div className="card" key={repo}>
            <h3>{repo}</h3>

            <p>Status: Connected</p>

            <button>Analyze</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Repositories;
