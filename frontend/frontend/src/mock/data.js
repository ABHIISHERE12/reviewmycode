export const mockUser = {
  name: "Alex Developer",
  username: "alexdev",
  avatarUrl: "https://i.pravatar.cc/150?u=alexdev",
  githubConnected: true,
  followers: 124,
  following: 32,
  plan: "Pro",
};

export const mockStats = {
  totalReposAnalyzed: 14,
  prsReviewed: 128,
  securityIssuesFound: 3,
  timeSaved: "42 hrs",
  overallHealthScore: 92,
};

export const mockRepositories = [
  {
    id: "repo-1",
    name: "ecommerce-frontend",
    description: "Next.js storefront with Stripe integration",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 124,
    lastUpdated: "2 hours ago",
    healthScore: 95,
    openPrCount: 3,
    isPrivate: false,
  },
  {
    id: "repo-2",
    name: "auth-service",
    description: "Go microservice for user authentication",
    language: "Go",
    languageColor: "#00ADD8",
    stars: 45,
    lastUpdated: "1 day ago",
    healthScore: 78,
    openPrCount: 1,
    isPrivate: true,
  },
  {
    id: "repo-3",
    name: "design-system",
    description: "React component library with Storybook",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 210,
    lastUpdated: "3 days ago",
    healthScore: 88,
    openPrCount: 5,
    isPrivate: false,
  },
  {
    id: "repo-4",
    name: "data-pipeline",
    description: "Python ETL scripts for analytics",
    language: "Python",
    languageColor: "#3572A5",
    stars: 12,
    lastUpdated: "1 week ago",
    healthScore: 91,
    openPrCount: 0,
    isPrivate: true,
  },
];

export const mockPullRequests = [
  {
    id: "pr-1",
    repoId: "repo-1",
    title: "feat: add stripe checkout webhook support",
    author: {
      name: "Sarah Jenkins",
      avatarUrl: "https://i.pravatar.cc/150?u=sarah",
    },
    branch: "feat/stripe-webhooks",
    status: "open", // open, merged, closed
    filesChanged: 12,
    commitCount: 4,
    riskLevel: "medium", // low, medium, high
    createdAt: "3 hours ago",
  },
  {
    id: "pr-2",
    repoId: "repo-1",
    title: "fix: mobile navigation menu overflow issue",
    author: {
      name: "David Chen",
      avatarUrl: "https://i.pravatar.cc/150?u=david",
    },
    branch: "fix/mobile-nav",
    status: "merged",
    filesChanged: 2,
    commitCount: 1,
    riskLevel: "low",
    createdAt: "1 day ago",
  },
  {
    id: "pr-3",
    repoId: "repo-2",
    title: "security: update jwt signing algorithm to RS256",
    author: {
      name: "Alex Developer",
      avatarUrl: "https://i.pravatar.cc/150?u=alexdev",
    },
    branch: "security/jwt-rs256",
    status: "open",
    filesChanged: 5,
    commitCount: 3,
    riskLevel: "high",
    createdAt: "4 hours ago",
  },
];

export const mockAiAnalysis = {
  prId: "pr-1",
  summary: "This PR introduces the necessary webhook handlers for Stripe integration. The implementation is generally solid, but lacks sufficient error handling in the event signature verification step. Additionally, there are a few performance bottlenecks when parsing large payloads.",
  scores: {
    security: 65,
    performance: 82,
    maintainability: 90,
  },
  issues: [
    {
      id: "issue-1",
      severity: "high", // high, medium, low
      category: "Security",
      title: "Missing Webhook Signature Verification",
      description: "The incoming Stripe webhook is not properly verifying the `Stripe-Signature` header. This leaves the endpoint vulnerable to replay attacks.",
      file: "src/api/webhooks/stripe.ts",
      line: 42,
      suggestion: "Use `stripe.webhooks.constructEvent(payload, sig, endpointSecret)` to securely parse and verify the event.",
    },
    {
      id: "issue-2",
      severity: "medium",
      category: "Performance",
      title: "Synchronous Database Write in Webhook Handler",
      description: "Database updates are performed synchronously before responding to the webhook. This might cause Stripe to timeout on slow DB queries.",
      file: "src/api/webhooks/stripe.ts",
      line: 65,
      suggestion: "Consider acknowledging the webhook immediately with a 200 OK, and queuing the database update asynchronously via a message broker or background job.",
    },
    {
      id: "issue-3",
      severity: "low",
      category: "Maintainability",
      title: "Hardcoded Webhook Secret",
      description: "A fallback webhook secret is hardcoded in the function if the environment variable is missing.",
      file: "src/api/webhooks/stripe.ts",
      line: 12,
      suggestion: "Throw an error or fail application startup if the essential environment variable `STRIPE_WEBHOOK_SECRET` is missing instead of falling back to a dummy string.",
    }
  ]
};
//tjis is a mock line
