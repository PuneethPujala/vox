# Vox - Modern Full-Stack Platform

A modern full-stack application built with Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Prisma, and PostgreSQL.

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL with Prisma ORM
- **Testing:** Jest + React Testing Library
- **Code Quality:** ESLint + Prettier

## Prerequisites

- Node.js 18+
- PostgreSQL database (local or remote)
- npm or yarn

## Getting Started

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in `.env` with your PostgreSQL connection string:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 3. Set Up Database

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

This will create the necessary database tables based on the Prisma schema.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The application includes hot reload for instant feedback during development.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── layout.tsx      # Root layout with header/footer
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   └── layout/         # Layout components (Header, Footer)
│   └── lib/
│       ├── prisma.ts       # Prisma client singleton
│       └── utils.ts        # Utility functions
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment variables template
└── package.json
```

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ shadcn/ui component library
- ✅ Prisma ORM with PostgreSQL
- ✅ ESLint + Prettier for code quality
- ✅ Jest + React Testing Library for testing
- ✅ Hot reload development environment
- ✅ Responsive Vox-branded UI (header, footer, typography)

## Database Management

### Create a Migration

After updating your Prisma schema:

```bash
npm run prisma:migrate
```

### View Database with Prisma Studio

```bash
npm run prisma:studio
```

This opens a GUI at [http://localhost:5555](http://localhost:5555) to view and edit your database.

## Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Code Quality

Lint your code:

```bash
npm run lint
```

Format your code:

```bash
npm run format
```

Check if code is properly formatted:

```bash
npm run format:check
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org/docs)

## License

MIT
