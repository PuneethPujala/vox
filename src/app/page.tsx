export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="text-center space-y-6">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center mb-4">
            <span className="text-white font-bold text-3xl">V</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Welcome to Vox</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern full-stack platform built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui,
            Prisma, and PostgreSQL.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">⚡</span>
            </div>
            <h3 className="text-lg font-semibold">Fast Development</h3>
            <p className="text-sm text-muted-foreground">
              Hot reload enabled for rapid development. Make changes and see them instantly.
            </p>
          </div>

          <div className="border rounded-lg p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 font-semibold">🎨</span>
            </div>
            <h3 className="text-lg font-semibold">Beautiful UI</h3>
            <p className="text-sm text-muted-foreground">
              Tailwind CSS and shadcn/ui provide a beautiful, responsive design system.
            </p>
          </div>

          <div className="border rounded-lg p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 font-semibold">🗄️</span>
            </div>
            <h3 className="text-lg font-semibold">Type-Safe Database</h3>
            <p className="text-sm text-muted-foreground">
              Prisma provides type-safe database access with PostgreSQL.
            </p>
          </div>
        </section>

        <section className="bg-muted rounded-lg p-8 space-y-4">
          <h2 className="text-2xl font-semibold">Getting Started</h2>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="text-muted-foreground">1.</span>
              <div>
                <p className="font-medium">Set up your database</p>
                <p className="text-muted-foreground">Configure your DATABASE_URL in .env file</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-muted-foreground">2.</span>
              <div>
                <p className="font-medium">Run migrations</p>
                <code className="text-xs bg-background px-2 py-1 rounded">
                  npm run prisma:migrate
                </code>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-muted-foreground">3.</span>
              <div>
                <p className="font-medium">Start building!</p>
                <p className="text-muted-foreground">Edit src/app/page.tsx to get started</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
