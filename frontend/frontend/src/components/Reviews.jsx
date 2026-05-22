function Reviews() {
  const reviews = [
    {
      id: 1,
      file: "server.js",
      issue: "Possible SQL Injection",
      severity: "High",
    },
    {
      id: 2,
      file: "auth.js",
      issue: "Missing Error Handling",
      severity: "Medium",
    },
  ];

  return (
    <div>
      <h1>AI Reviews</h1>

      {reviews.map((review) => (
        <div className="card review-card" key={review.id}>
          <h3>{review.file}</h3>

          <p>{review.issue}</p>

          <span>{review.severity}</span>
        </div>
      ))}
    </div>
  );
}

export default Reviews;
