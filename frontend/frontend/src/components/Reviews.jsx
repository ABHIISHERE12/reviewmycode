import { AlertTriangle, Info, ShieldAlert, FileText, ChevronRight } from "lucide-react";

function Reviews() {
  const reviews = [
    {
      id: 1,
      file: "server.js",
      issue: "Possible SQL Injection vulnerability detected in user input query.",
      severity: "High",
    },
    {
      id: 2,
      file: "auth.js",
      issue: "Missing Error Handling in JWT verification middleware.",
      severity: "Medium",
    },
    {
      id: 3,
      file: "components/Button.jsx",
      issue: "Unused prop 'variant' passed to component.",
      severity: "Low",
    },
  ];

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'High': return <ShieldAlert size={18} color="var(--danger-color)" />;
      case 'Medium': return <AlertTriangle size={18} color="var(--warning-color)" />;
      case 'Low': return <Info size={18} color="var(--accent-color)" />;
      default: return null;
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'High': return 'badge-danger';
      case 'Medium': return 'badge-warning';
      case 'Low': return 'badge-success';
      default: return '';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">AI Reviews</h1>
        <p className="page-description">Detailed analysis and security suggestions from ReviewAI.</p>
      </div>

      <div className="reviews-list delay-1">
        {reviews.map((review) => (
          <div className="review-item" key={review.id}>
            <div className="review-info">
              {getSeverityIcon(review.severity)}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="review-file flex-center">
                    <FileText size={14} />
                    {review.file}
                  </span>
                  <span className={`badge ${getSeverityBadgeClass(review.severity)}`}>
                    {review.severity}
                  </span>
                </div>
                <span className="review-issue">{review.issue}</span>
              </div>
            </div>

            <button className="icon-btn">
              <ChevronRight size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
