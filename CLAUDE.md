# CLAUDE.md - AI Assistant Guide for Reviews Plethora

**Last Updated:** 2025-11-19
**Next.js Version:** 15.0.3
**Repository:** review-ai

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Directory Structure](#directory-structure)
4. [Key Patterns & Conventions](#key-patterns--conventions)
5. [Development Workflows](#development-workflows)
6. [Common Tasks Guide](#common-tasks-guide)
7. [Database Schema](#database-schema)
8. [Authentication & Authorization](#authentication--authorization)
9. [Styling Guidelines](#styling-guidelines)
10. [Important Notes for AI Assistants](#important-notes-for-ai-assistants)

---

## Project Overview

**Reviews Plethora** is a SaaS platform for collecting and managing customer reviews with AI-powered insights. Users can create review campaigns, share them with customers, and analyze feedback using AI.

### Core Features
- Multi-step campaign creation with live preview
- Public review submission pages with customizable rating components
- Dashboard for managing campaigns and viewing feedback
- AI-powered review summaries (orbious-ai integration)
- Multi-tenant architecture with Clerk authentication
- Star rating and emoji rating support

### User Flows
- **Campaign Owner:** Sign up → Create campaign → Share link → View responses → Analyze with AI
- **Reviewer:** Receive link → View campaign intro → Submit review → Done

---

## Tech Stack

### Core Framework
- **Next.js 15.0.3** - App Router with React Server Components
- **React 19 RC** - UI library (release candidate)
- **TypeScript 5** - Strict mode enabled

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **shadcn/ui** - Component library (New York style)
- **Radix UI** - 25+ accessible component primitives
- **Lucide React** - Icon library
- **class-variance-authority (CVA)** - Component variants
- **next-themes** - Dark mode support

### Authentication & Database
- **Clerk** - Complete auth solution (`@clerk/nextjs` v6.5.0, `@clerk/backend` v1.18.0)
- **MongoDB v6.11.0** - NoSQL database (direct driver, no ORM)

### State & Forms
- **Zustand v5.0.1** - Lightweight state management
- **React Hook Form v7.53.2** - Form handling
- **Zod v3.23.8** - Schema validation

### Additional Libraries
- **@tanstack/react-table** - Table component
- **recharts** - Charts
- **date-fns** - Date utilities
- **sonner** - Toast notifications
- **canvas-confetti** - Celebration animations

### Development Tools
- **pnpm** - Package manager
- **ESLint** - Linting
- **Turbopack** - Fast bundler (Next.js 15)

---

## Directory Structure

```
/home/user/review-ai/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (dashboard)/                  # Route group (no URL segment)
│   │   │   ├── dashboard/
│   │   │   │   ├── campaign/[slug]/      # Dynamic campaign routes
│   │   │   │   │   ├── edit/page.tsx     # Edit campaign
│   │   │   │   │   ├── loading.tsx       # Loading UI
│   │   │   │   │   └── page.tsx          # Campaign details
│   │   │   │   ├── developer/page.tsx    # API/Developer page
│   │   │   │   ├── feedback/page.tsx     # Feedback management
│   │   │   │   ├── new/page.tsx          # Create campaign
│   │   │   │   └── page.tsx              # Dashboard home
│   │   │   └── layout.tsx                # Dashboard layout with sidebar
│   │   ├── review/[slug]/                # Public review submission
│   │   │   └── page.tsx
│   │   ├── sign-in/[[...sign-in]]/       # Clerk auth routes
│   │   ├── sign-up/[[...sign-up]]/
│   │   ├── fonts/                        # Font files
│   │   ├── favicon.ico
│   │   ├── globals.css                   # Global styles + CSS variables
│   │   ├── layout.tsx                    # Root layout with ClerkProvider
│   │   ├── not-found.tsx                 # 404 page
│   │   └── page.tsx                      # Landing page
│   │
│   ├── components/
│   │   ├── app-sidebar.tsx               # Main dashboard sidebar
│   │   ├── campaign/                     # Campaign components
│   │   │   ├── details.tsx
│   │   │   ├── feedback-form.tsx
│   │   │   ├── index.tsx
│   │   │   └── intro.tsx
│   │   ├── craft.tsx                     # Layout primitives
│   │   ├── forms/
│   │   │   └── campaign/
│   │   │       ├── index.tsx             # Multi-step form
│   │   │       └── metadata.tsx
│   │   ├── home/                         # Landing page components
│   │   │   ├── faq.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── header.tsx
│   │   │   ├── hero.tsx
│   │   │   └── how-it-work.tsx
│   │   ├── icons/
│   │   │   └── logo.tsx
│   │   ├── layout/
│   │   │   └── dashboard.tsx
│   │   ├── magic-ui/                     # Enhanced UI
│   │   │   └── confetti.tsx
│   │   ├── shared/
│   │   │   └── are-you-sure.tsx          # Confirmation dialog
│   │   └── ui/                           # 40+ shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── emoji-rating.tsx          # Custom component
│   │       ├── form.tsx
│   │       ├── star-rating.tsx           # Custom component
│   │       ├── texture-button.tsx        # Custom component
│   │       └── ...
│   │
│   ├── hooks/                            # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-shape-confetti.ts
│   │   ├── use-stars-confetti.ts
│   │   └── use-toast.ts
│   │
│   ├── lib/
│   │   ├── clerk-sdk/
│   │   │   └── index.ts                  # Clerk backend client
│   │   ├── orbious-ai/                   # AI integration
│   │   │   ├── index.ts
│   │   │   ├── system.ts                 # AI system prompts
│   │   │   └── use-orbious-ai.ts
│   │   ├── constants.ts                  # Route constants
│   │   └── utils.ts                      # cn() utility
│   │
│   ├── server/
│   │   ├── actions/                      # Server Actions
│   │   │   ├── campaign-feedback.ts
│   │   │   ├── campaign.ts               # CRUD operations
│   │   │   └── feedback.ts
│   │   ├── dal/                          # Data Access Layer
│   │   │   ├── campaign-feedback.ts
│   │   │   └── campaign.ts
│   │   └── db/                           # Database
│   │       ├── collections.ts            # Collection names
│   │       └── index.ts                  # MongoDB connection
│   │
│   ├── shared/
│   │   └── definitions/                  # Zod schemas
│   │       ├── campaign-feedback.ts
│   │       ├── campaign.ts
│   │       └── feedback.ts
│   │
│   └── types/
│       └── index.d.ts                    # TypeScript definitions
│
├── public/                               # Static assets
│   ├── temp/                             # Temporary files
│   ├── *.svg                             # SVG assets
│   ├── hero.png
│   ├── logo.svg
│   └── social-card.png
│
├── .editorconfig
├── .eslintrc.json
├── .gitignore
├── components.json                       # shadcn/ui config
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## Key Patterns & Conventions

### 1. Component Patterns

#### Server vs Client Components
- **Default to Server Components** - All components are server components unless marked with `"use client"`
- Use **Client Components** only when needed:
  - Event handlers (onClick, onChange, etc.)
  - Hooks (useState, useEffect, custom hooks)
  - Browser APIs
  - Clerk hooks (useUser, useClerk)

**Examples:**
```typescript
// Server Component (default)
// src/app/(dashboard)/dashboard/page.tsx
export default async function Dashboard() {
  const campaigns = await getAllCampaigns();
  return <div>{/* ... */}</div>;
}

// Client Component
// src/components/app-sidebar.tsx
"use client";
import { useUser } from "@clerk/nextjs";
export function AppSidebar() {
  const { user } = useUser();
  return <div>{/* ... */}</div>;
}
```

#### Component Composition
- Use **shadcn/ui patterns** - Components are copied into the project, fully customizable
- Use **CVA (class-variance-authority)** for variant-based styling
- Use **Compound Components** pattern (e.g., Card, CardHeader, CardTitle)

### 2. File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Pages | `page.tsx` | `app/dashboard/page.tsx` |
| Layouts | `layout.tsx` | `app/(dashboard)/layout.tsx` |
| Loading States | `loading.tsx` | `app/dashboard/campaign/[slug]/loading.tsx` |
| Not Found | `not-found.tsx` | `app/not-found.tsx` |
| Components | kebab-case | `app-sidebar.tsx`, `emoji-rating.tsx` |
| Server Actions | camelCase functions | `createCampaign`, `deleteCampaign` |
| Types | PascalCase | `CampaignFormType`, `FeedbackType` |

### 3. Route Patterns

#### Route Groups
- **Pattern:** `(groupName)` - Parentheses create route groups without affecting URL
- **Example:** `app/(dashboard)/dashboard/page.tsx` → URL: `/dashboard`
- **Purpose:** Share layouts without adding URL segments

#### Dynamic Routes
- **Pattern:** `[slug]` for dynamic segments
- **Example:** `app/review/[slug]/page.tsx` → URL: `/review/campaign-id`
- **Catch-all:** `[[...sign-in]]` - Optional catch-all route (Clerk auth)

### 4. Data Fetching Patterns

```typescript
// Pattern 1: Direct async component (Server Component)
export default async function Dashboard() {
  const campaigns = await getAllCampaigns();
  return <div>{/* ... */}</div>;
}

// Pattern 2: Parallel data fetching
const [campaign, feedbacks] = await Promise.all([
  getCampaignById(slug),
  getCampaignFeedback(slug),
]);

// Pattern 3: Cached fetching with revalidation
import { unstable_cache } from "next/cache";

const fetchData = unstable_cache(
  async (slug: string) => {
    return await getCampaignById(slug);
  },
  ["campaign"],
  { revalidate: 3600 } // 1 hour
);
```

### 5. Server Actions Pattern

**Location:** `src/server/actions/`
**Convention:** Use `"use server"` directive

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { campaignFormSchema } from "@/shared/definitions/campaign";

export async function createCampaign(data: CampaignFormType) {
  // 1. Validate input with Zod
  const validateFields = campaignFormSchema.safeParse(data);
  if (!validateFields.success) {
    return { error: "Invalid fields" };
  }

  // 2. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  // 3. Database operation (via DAL)
  await insertCampaign({
    ...validateFields.data,
    userId,
  });

  // 4. Revalidate and redirect
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
```

### 6. Data Access Layer (DAL) Pattern

**Separation of Concerns:**
- **Actions** (`src/server/actions/`) - Business logic, validation, auth checks
- **DAL** (`src/server/dal/`) - Pure database queries
- **DB** (`src/server/db/`) - Connection management

```typescript
// DAL Example: src/server/dal/campaign.ts
import { db } from "@/server/db";
import { collections } from "@/server/db/collections";

export async function getCampaignById(id: string) {
  const campaign = await db
    .collection(collections.campaigns)
    .findOne({ _id: new ObjectId(id), isDeleted: false });

  return campaign;
}
```

### 7. Form Handling Pattern

```typescript
// 1. Define Zod schema in src/shared/definitions/
import { z } from "zod";

export const campaignFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  ctaText: z.string().min(1),
  ratingComponent: z.enum(["star", "emoji"]),
});

export type CampaignFormType = z.infer<typeof campaignFormSchema>;

// 2. Use with react-hook-form in component
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm<CampaignFormType>({
  resolver: zodResolver(campaignFormSchema),
  defaultValues: {
    name: "",
    description: "",
    ctaText: "Share your feedback",
    ratingComponent: "star",
  },
});

// 3. Server-side validation in action
const validateFields = campaignFormSchema.safeParse(data);
if (!validateFields.success) {
  return { error: "Invalid fields" };
}
```

### 8. Styling Approach

- **Tailwind CSS** with CSS variables for theming
- **HSL color system** for better theme control
- **CSS variables pattern** in `src/app/globals.css`:
  ```css
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    /* ... */
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    /* ... */
  }
  ```
- **cn() utility** - Combines `clsx` and `tailwind-merge`:
  ```typescript
  import { cn } from "@/lib/utils";

  <div className={cn("base-class", conditional && "conditional-class")} />
  ```

### 9. Import Aliases

Use `@/` prefix for all imports:
```typescript
import { Button } from "@/components/ui/button";
import { db } from "@/server/db";
import { createCampaign } from "@/server/actions/campaign";
```

**Configured in:**
- `tsconfig.json`: `"@/*": ["./src/*"]`
- `components.json`: Aliases for components, utils, ui

---

## Development Workflows

### Local Development

```bash
# Install dependencies
pnpm install

# Start dev server (uses Turbopack)
pnpm dev

# Access at http://localhost:3000
```

### Environment Variables

Create `.env.local` file:
```bash
# MongoDB
MONGO_URL=mongodb://localhost:27017/reviews-plethora

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Optional: Clerk webhook secret
CLERK_WEBHOOK_SECRET=whsec_...
```

### Building & Production

```bash
# Production build
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
# Run ESLint
pnpm lint

# Auto-fix issues
pnpm lint --fix
```

### Adding shadcn/ui Components

```bash
# Add a new component (requires shadcn CLI)
npx shadcn@latest add [component-name]

# Example:
npx shadcn@latest add dialog
```

---

## Common Tasks Guide

### Adding a New Page

1. Create file in `src/app/` directory:
   ```typescript
   // src/app/about/page.tsx
   export default function AboutPage() {
     return <div>About</div>;
   }
   ```

2. If it needs layout, create `layout.tsx`:
   ```typescript
   // src/app/about/layout.tsx
   export default function AboutLayout({ children }) {
     return <div className="container">{children}</div>;
   }
   ```

### Adding a New Server Action

1. Create Zod schema in `src/shared/definitions/`:
   ```typescript
   // src/shared/definitions/my-feature.ts
   import { z } from "zod";

   export const myFeatureSchema = z.object({
     field: z.string().min(1),
   });

   export type MyFeatureType = z.infer<typeof myFeatureSchema>;
   ```

2. Create DAL function in `src/server/dal/`:
   ```typescript
   // src/server/dal/my-feature.ts
   import { db } from "@/server/db";
   import { collections } from "@/server/db/collections";

   export async function getMyFeature(id: string) {
     return await db.collection(collections.myFeature).findOne({ _id: id });
   }
   ```

3. Create action in `src/server/actions/`:
   ```typescript
   // src/server/actions/my-feature.ts
   "use server";

   import { auth } from "@clerk/nextjs/server";
   import { myFeatureSchema } from "@/shared/definitions/my-feature";

   export async function createMyFeature(data: MyFeatureType) {
     const { userId } = await auth();
     if (!userId) throw new Error("Unauthorized");

     const validated = myFeatureSchema.parse(data);
     // ... database logic
   }
   ```

### Adding a Protected Route

```typescript
// src/app/protected/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <div>Protected content</div>;
}
```

### Adding a Client Component with State

```typescript
// src/components/my-component.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <Button onClick={() => setCount(count + 1)}>
      Count: {count}
    </Button>
  );
}
```

### Adding a New Database Collection

1. Add to `src/server/db/collections.ts`:
   ```typescript
   export const collections = {
     campaigns: "campaigns",
     campaignFeedbacks: "campaign_feedbacks",
     usersFeedback: "users_feedback",
     myNewCollection: "my_new_collection", // Add this
   };
   ```

2. Create indexes if needed (run in MongoDB):
   ```javascript
   db.my_new_collection.createIndex({ userId: 1 });
   ```

---

## Database Schema

**Database:** MongoDB
**Collections:** 3 main collections

### Collection: `campaigns`

```typescript
interface Campaign {
  _id: ObjectId;
  name: string;
  description?: string;
  ctaText: string;                    // Call-to-action text
  ratingComponent: "star" | "emoji";  // Type of rating widget
  userId: string;                     // Clerk user ID
  isDeleted: boolean;                 // Soft delete flag
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `userId` - For user-specific queries
- `isDeleted` - For filtering deleted campaigns

### Collection: `campaign_feedbacks`

```typescript
interface CampaignFeedback {
  _id: ObjectId;
  campaignId: string;                // References campaigns._id
  title: string;                     // Review title
  feedback: string;                  // Review content
  rating: number;                    // 1-5 for stars, 1-5 for emojis
  reviewerName?: string;             // Optional reviewer name
  reviewerEmail?: string;            // Optional reviewer email
  createdAt: Date;
}
```

**Indexes:**
- `campaignId` - For fetching campaign reviews

### Collection: `users_feedback`

```typescript
interface UserFeedback {
  _id: ObjectId;
  userId: string;                    // Clerk user ID
  feedback: string;                  // General feedback content
  createdAt: Date;
}
```

**Note:** Soft deletes are used for campaigns (`isDeleted: false` filter in queries)

---

## Authentication & Authorization

### Clerk Integration

**Provider Setup:** Root layout wraps app with `ClerkProvider`:
```typescript
// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Server-Side Auth

```typescript
import { auth, currentUser } from "@clerk/nextjs/server";

// Get user ID only
const { userId } = await auth();

// Get full user object
const user = await currentUser();
```

### Client-Side Auth

```typescript
"use client";
import { useUser, useAuth, useClerk } from "@clerk/nextjs";

function MyComponent() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { userId, signOut } = useAuth();
  const clerk = useClerk();

  return <div>{user?.emailAddresses[0].emailAddress}</div>;
}
```

### Auth Routes

- **Sign In:** `/sign-in` - Handled by Clerk catch-all route `app/sign-in/[[...sign-in]]/page.tsx`
- **Sign Up:** `/sign-up` - Handled by Clerk catch-all route `app/sign-up/[[...sign-up]]/page.tsx`

### Backend SDK

```typescript
// src/lib/clerk-sdk/index.ts
import { createClerkClient } from "@clerk/backend";

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Usage in server actions
const user = await clerkClient.users.getUser(userId);
```

---

## Styling Guidelines

### Tailwind Configuration

**Style:** New York (shadcn/ui)
**Dark Mode:** Class-based (`dark` class on `<html>`)
**CSS Variables:** Enabled for theming

### Color System

Colors are defined as HSL values in CSS variables:
```css
/* Light mode */
--primary: 0 0% 9%;
--secondary: 0 0% 96.1%;

/* Dark mode */
.dark {
  --primary: 0 0% 98%;
  --secondary: 0 0% 14.9%;
}
```

### Common Patterns

```typescript
// Using cn() for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  isPending && "pending-class"
)} />

// Using CVA for component variants
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Custom Components

**Location:** `src/components/ui/`

- `star-rating.tsx` - Custom star rating component
- `emoji-rating.tsx` - Custom emoji rating component
- `texture-button.tsx` - Custom styled button

### Responsive Design

Use Tailwind responsive prefixes:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## Important Notes for AI Assistants

### DO's

1. **Always validate with Zod** - Both client and server-side
2. **Check authentication** - Use `auth()` in server actions
3. **Use Server Components by default** - Only use client components when necessary
4. **Filter soft-deleted records** - Always include `isDeleted: false` in queries
5. **Use type-safe imports** - Import types from Zod schemas
6. **Follow DAL pattern** - Separate business logic (actions) from data queries (DAL)
7. **Use path aliases** - Always use `@/` prefix
8. **Revalidate after mutations** - Use `revalidatePath()` or `revalidateTag()`
9. **Handle errors gracefully** - Return error messages from server actions
10. **Use parallel fetching** - Use `Promise.all()` when possible

### DON'Ts

1. **Don't fetch data in client components** - Use server components or server actions
2. **Don't expose secrets** - Never log or return sensitive data
3. **Don't skip validation** - Always validate user input with Zod
4. **Don't use direct MongoDB ObjectId strings** - Use `new ObjectId(id)`
5. **Don't create API routes** - Use server actions instead (project convention)
6. **Don't forget soft delete checks** - Always filter `isDeleted: false`
7. **Don't use `any` type** - Use proper TypeScript types
8. **Don't mutate state directly** - Use React state setters or Zustand actions
9. **Don't forget error boundaries** - Wrap risky operations in try-catch
10. **Don't use old Next.js patterns** - This is App Router, not Pages Router

### Common Pitfalls

1. **ObjectId conversion:** MongoDB ObjectIds must be converted:
   ```typescript
   // Wrong
   const campaign = await db.collection("campaigns").findOne({ _id: id });

   // Correct
   import { ObjectId } from "mongodb";
   const campaign = await db.collection("campaigns").findOne({
     _id: new ObjectId(id)
   });
   ```

2. **Client/Server boundary:** Can't pass functions or class instances:
   ```typescript
   // Wrong
   <ClientComponent callback={() => doSomething()} />

   // Correct - Use server actions
   async function handleAction() {
     "use server";
     doSomething();
   }
   <ClientComponent action={handleAction} />
   ```

3. **Async components must be Server Components:**
   ```typescript
   // Wrong
   "use client";
   export default async function Page() { /* ... */ }

   // Correct - Remove "use client"
   export default async function Page() { /* ... */ }
   ```

4. **Form actions require FormData:**
   ```typescript
   // Server action signature
   export async function createCampaign(formData: FormData) {
     const data = {
       name: formData.get("name") as string,
       // ...
     };
   }
   ```

### Testing Strategy

**Current Status:** No testing infrastructure exists.

**Recommendations when adding tests:**
- Use Jest + React Testing Library for unit/integration tests
- Use Playwright for E2E tests
- Mock MongoDB with `mongodb-memory-server`
- Mock Clerk with `@clerk/testing`

### Performance Considerations

1. **Use loading.tsx** - Provide loading states for better UX
2. **Use Suspense boundaries** - For streaming SSR
3. **Optimize images** - Use Next.js `<Image>` component
4. **Cache database queries** - Use `unstable_cache` for static data
5. **Minimize client bundles** - Keep components server-side when possible

### Security Considerations

1. **Always validate input** - Client and server-side with Zod
2. **Sanitize user input** - Especially for MongoDB queries (injection risk)
3. **Use parameterized queries** - Avoid string concatenation in queries
4. **Check authorization** - Verify user owns resource before mutations
5. **Rate limit** - Consider adding rate limiting for public endpoints
6. **CORS configuration** - Review if adding API routes

### AI Integration (orbious-ai)

**Location:** `src/lib/orbious-ai/`

- Custom AI integration for review summaries
- System prompts in `system.ts`
- Hook: `use-orbious-ai.ts` for client-side usage

**Usage:**
```typescript
import { useOrbiousAI } from "@/lib/orbious-ai/use-orbious-ai";

function MyComponent() {
  const { generateSummary, isLoading } = useOrbiousAI();

  const summary = await generateSummary(reviews);
}
```

---

## Quick Reference

### File Locations Cheat Sheet

| What | Where |
|------|-------|
| Pages | `src/app/**/page.tsx` |
| Layouts | `src/app/**/layout.tsx` |
| Server Actions | `src/server/actions/*.ts` |
| Database Queries | `src/server/dal/*.ts` |
| Zod Schemas | `src/shared/definitions/*.ts` |
| UI Components | `src/components/ui/*.tsx` |
| Custom Hooks | `src/hooks/*.tsx` |
| Types | `src/types/index.d.ts` |
| Constants | `src/lib/constants.ts` |
| Utilities | `src/lib/utils.ts` |

### Common Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Environment Variables

```bash
MONGO_URL
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

---

## Additional Resources

- **Next.js 15 Docs:** https://nextjs.org/docs
- **Clerk Docs:** https://clerk.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com
- **Radix UI:** https://radix-ui.com
- **Zod:** https://zod.dev
- **React Hook Form:** https://react-hook-form.com

---

**Generated by Claude**
**Last Updated:** 2025-11-19