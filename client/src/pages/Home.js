export default function FilmSolutionsLandingPage() {
  const features = [
    {
      title: "Trending Dashboard",
      description:
        "Browse movie data in a clean dashboard that highlights what is trending right now.",
      icon: "🎬",
    },
    {
      title: "Data Visualizations",
      description:
        "Explore weekly trends, genre distribution, and popularity patterns through interactive charts.",
      icon: "📊",
    },
    {
      title: "Recommendation Engine",
      description:
        "Get smarter movie suggestions based on genre and cast similarities from saved watch history.",
      icon: "✨",
    },
    {
      title: "Cloud Deployment",
      description:
        "Deployed with a live domain, HTTPS, and backend hosting on AWS for a real-world full-stack setup.",
      icon: "☁️",
    },
  ];

  const techStack = [
    {
      category: "Frontend",
      items: ["React", "Responsive UI", "Recharts"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express.js", "REST API"],
    },
    {
      category: "Database",
      items: ["SQLite", "Prisma"],
    },
    {
      category: "Infrastructure",
      items: ["AWS EC2", "PM2", "Route 53", "HTTPS / TLS"],
    },
  ];

  const architecture = [
    "User Browser",
    "React Frontend",
    "Node.js + Express API",
    "SQLite Database",
    "External Movie API",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-yellow-400/10 to-transparent" />
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 py-20 lg:flex-row lg:items-center lg:px-10">
          <div className="max-w-3xl flex-1">
            <div className="mb-4 inline-flex items-center rounded-full border border-red-400/30 bg-white/5 px-4 py-2 text-sm text-red-200 backdrop-blur">
              Full-Stack Movie Discovery Platform
            </div>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Film Solutions
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Discover trending movies, explore data-rich visualizations, and generate better recommendations through a modern full-stack app built with React, Node.js, Express, SQLite, and AWS.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://film-solutions.org"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-red-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
              >
                View Live Project
              </a>
              <a
                href="#features"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-2xl font-bold">React</p>
                <p className="mt-1 text-sm text-slate-300">Frontend experience</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-2xl font-bold">AWS</p>
                <p className="mt-1 text-sm text-slate-300">Live cloud deployment</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-2xl font-bold">Charts</p>
                <p className="mt-1 text-sm text-slate-300">Real movie trend insights</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                  Project Snapshot
                </p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-slate-800/70 p-4">
                    <p className="text-sm text-slate-400">Purpose</p>
                    <p className="mt-1 font-medium text-white">
                      Build a polished movie recommendation and analytics platform
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-800/70 p-4">
                    <p className="text-sm text-slate-400">Core Value</p>
                    <p className="mt-1 font-medium text-white">
                      Combines data visualization, recommendations, and real deployment experience
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-800/70 p-4">
                    <p className="text-sm text-slate-400">Deployment</p>
                    <p className="mt-1 font-medium text-white">
                      film-solutions.org · HTTPS · AWS EC2 · PM2
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10" id="about">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
              About the Project
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">A portfolio project built like a real product</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Film Solutions was created to show full-stack development in action. The app brings together trending movie data, recommendation logic, and chart-based insights in a clean user experience. It demonstrates how a modern web application can move from local development into a live deployed environment with a real domain and secure HTTPS.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-lg font-semibold">Problem Solved</p>
              <p className="mt-3 text-slate-300">
                Helps users discover movies more intelligently instead of browsing random titles without context.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-lg font-semibold">Why It Matters</p>
              <p className="mt-3 text-slate-300">
                Shows practical skills in frontend development, backend APIs, databases, data visualization, and AWS hosting.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10" id="features">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">
            Key Features
          </p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            What Film Solutions already does well
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg transition hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10" id="stack">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
            Tech Stack
          </p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Tools behind the platform
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {techStack.map((group) => (
            <div key={group.category} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold">{group.category}</h3>
              <ul className="mt-4 space-y-3 text-slate-300">
                {group.items.map((item) => (
                  <li key={item} className="rounded-xl bg-slate-900/70 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10" id="architecture">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">
            Architecture
          </p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            How the system flows
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="flex flex-col items-center gap-4">
              {architecture.map((step, index) => (
                <div key={step} className="flex w-full flex-col items-center gap-4">
                  <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 px-6 py-4 text-center font-medium shadow-lg">
                    {step}
                  </div>
                  {index < architecture.length - 1 && (
                    <div className="text-2xl text-slate-400">↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-semibold">Deployment Details</h3>
            <div className="mt-6 space-y-4 text-slate-300">
              <div className="rounded-2xl bg-slate-900/70 p-4">Hosted on AWS EC2</div>
              <div className="rounded-2xl bg-slate-900/70 p-4">Managed with PM2</div>
              <div className="rounded-2xl bg-slate-900/70 p-4">Connected to Route 53 domain</div>
              <div className="rounded-2xl bg-slate-900/70 p-4">Secured with HTTPS / TLS</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-red-600/20 via-yellow-400/10 to-red-600/20 p-8 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-200">
              Portfolio Value
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              This project proves real full-stack ability
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-200">
              Film Solutions is more than a classroom exercise. It brings together frontend design, backend development, database work, chart integration, deployment, domain setup, and secure hosting into one polished showcase project.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
