# Cosmetics E-Commerce Platform - Codebase Structure

## 📋 Overview
A modern Next.js 16 e-commerce platform for cosmetics built with:
- **Framework**: Next.js 16.1.1 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4.1 + shadcn/ui components
- **Authentication**: Supabase Auth with SSR
- **Language**: TypeScript

---

## 🏗️ Architecture Overview

```
cosmetics/
├── app/                    # Next.js App Router (Pages & Routes)
├── components/             # React Components
│   ├── auth/              # Authentication components
│   ├── cart/              # Shopping cart components
│   ├── checkout/          # Checkout flow components
│   ├── common/            # Shared/common components
│   ├── forms/             # Reusable form components
│   ├── icons/             # Custom icon components
│   ├── layout/            # Layout components (Header, Footer)
│   ├── product/           # Product-related components
│   ├── providers/         # Context providers
│   ├── skeletons/         # Loading skeleton components
│   ├── ui/                # shadcn/ui base components
│   └── error-boundaries/  # Error boundary components
├── hooks/                 # Custom React Hooks
│   ├── auth/              # Authentication hooks
│   ├── cart/              # Cart management hooks
│   ├── ui/                # UI interaction hooks
│   └── api/               # API/data fetching hooks
├── lib/                   # Core Business Logic
│   ├── actions/           # Next.js Server Actions
│   ├── config/            # Configuration files
│   ├── constants/         # Application constants
│   ├── errors/            # Custom error classes
│   ├── formatters/        # Data formatting utilities
│   ├── mappers/           # Data transformation mappers
│   ├── schemas/           # Zod validation schemas
│   ├── services/          # Business logic services
│   ├── supabase/          # Supabase client setup
│   ├── validators/        # Validation utilities
│   └── utils.ts           # Core utility functions
├── middleware/            # Next.js Middleware
├── public/                # Static Assets
├── types/                 # TypeScript Type Definitions
├── utils/                 # Pure Utility Functions
│   ├── helpers/           # Helper functions
│   ├── http/              # HTTP utilities
│   └── analytics/         # Analytics utilities
├── tests/                 # Test Files
├── docs/                  # Documentation
├── scripts/               # Build/Deployment Scripts
└── .env.*                 # Environment Configuration
```

---

## 📁 Directory Structure

### `/app` - Next.js App Router

#### Route Groups (Layout Organization)
- **`(auth)/`** - Authentication routes
  - `login/page.tsx` - User login page
  - `register/page.tsx` - User registration page

- **`(checkout)/`** - Checkout flow routes
  - `cart/page.tsx` - Shopping cart page
  - `address/page.tsx` - Address selection/entry
  - `payment/page.tsx` - Payment processing
  - `confirmation/page.tsx` - Order confirmation

- **`(main)/`** - Main application routes
  - `products/page.tsx` - Product listing page

#### Core Routes
- `page.tsx` - Homepage (featured products, categories, testimonials)
- `layout.tsx` - Root layout with ServerHeader & Footer
- `globals.css` - Global styles

#### Dynamic Routes
- `product/[slug]/page.tsx` - Individual product detail page
- `products/` - Additional product routes

#### Admin Routes
- `admin/page.tsx` - Admin dashboard
- `admin/products/page.tsx` - Product management
- `admin/orders/page.tsx` - Order management
- `admin/payments/page.tsx` - Payment management
- `admin/stock/page.tsx` - Inventory management

#### API Routes
- `api/auth/[...nextauth]/` - Authentication API handlers

#### User Routes
- `account/` - User account management

---

### `/components` - React Components

#### Component Organization by Feature

**`/auth`** - Authentication Components
- `LoginForm.tsx` - Login form component
- `RegisterForm.tsx` - Registration form component

**`/cart`** - Shopping Cart Components
- `CartSheet.tsx` - Cart sidebar/sheet component
- Additional cart-related UI components

**`/checkout`** - Checkout Components
- `PlaceOrderButton.tsx` - Order placement button
- Checkout flow UI components

**`/common`** - Shared/Common Components
- Reusable components used across multiple features
- Shared UI patterns and utilities

**`/forms`** - Reusable Form Components
- Form field components
- Form validation displays
- Form layout components

**`/icons`** - Custom Icon Components
- Custom SVG icon components
- Icon wrappers and utilities

**`/layout`** - Layout Components
- `Header.tsx` - Client-side header (navigation, search, cart)
- `ServerHeader.tsx` - Server-side header wrapper
- `Footer.tsx` - Site footer
- Layout wrappers and containers

**`/product`** - Product Components
- `ProductCard.tsx` - Product card for listings
- `ProductInfo.tsx` - Product details display
- `ProductImageGallery.tsx` - Product image carousel
- `ProductFilters.tsx` - Product filtering UI
- `AddToCartButton.tsx` - Add to cart action button

**`/providers`** - Context Providers
- React Context providers
- Theme providers
- State management providers

**`/skeletons`** - Loading Skeleton Components
- `ProductGridSkeleton.tsx` - Product grid loading state
- Page-level skeleton loaders
- Component-specific loading states

**`/ui`** - Reusable UI Components (shadcn/ui)
- `badge.tsx` - Badge component
- `button.tsx` - Button component
- `card.tsx` - Card container
- `input.tsx` - Input field
- `select.tsx` - Select dropdown
- `sheet.tsx` - Side sheet/drawer
- `skeleton.tsx` - Loading skeleton
- `tabs.tsx` - Tab navigation
- `accordion.tsx` - Accordion component
- `checkbox.tsx` - Checkbox input
- `label.tsx` - Form label
- `navigation-menu.tsx` - Navigation menu
- `radio-group.tsx` - Radio button group
- `slider.tsx` - Range slider
- `Pagination.tsx` - Pagination component
- Additional shadcn/ui components

**`/error-boundaries`** - Error Boundary Components
- Error boundary wrappers
- Error fallback UI components
- Error reporting components

---

### `/hooks` - Custom React Hooks

#### Hook Organization by Feature

**`/auth`** - Authentication Hooks
- `useAuth.ts` - Authentication state hook
- `useSession.ts` - Session management hook
- `useLogin.ts` - Login functionality hook
- `useLogout.ts` - Logout functionality hook

**`/cart`** - Cart Management Hooks
- `useCart.ts` - Cart state and operations hook
- `useCartItems.ts` - Cart items management hook
- `useAddToCart.ts` - Add to cart hook
- `useRemoveFromCart.ts` - Remove from cart hook

**`/ui`** - UI Interaction Hooks
- `useToast.ts` - Toast notification hook
- `useDialog.ts` - Dialog/modal hook
- `useMediaQuery.ts` - Responsive breakpoint hook
- `useDebounce.ts` - Debounce utility hook

**`/api`** - API/Data Fetching Hooks
- `useProducts.ts` - Product data fetching hook
- `useProduct.ts` - Single product fetching hook
- `useCategories.ts` - Category data fetching hook
- `useOrders.ts` - Order data fetching hook

---

### `/lib` - Core Business Logic

#### `/actions` - Server Actions (Next.js Server Actions)
- `auth.ts` - Authentication actions (login, register, logout)
- `cart.ts` - Cart management actions (add, update, remove)
- `checkout.ts` - Checkout process actions
- `order.ts` - Order management actions
- `product.ts` - Product-related actions
- `payment.ts` - Payment processing actions

#### `/config` - Configuration Files
- `app.config.ts` - Application configuration
- `db.config.ts` - Database configuration
- `env.config.ts` - Environment variable validation
- `routes.config.ts` - Route definitions

#### `/constants` - Application Constants
- `routes.ts` - Route path constants
- `api.ts` - API endpoint constants
- `messages.ts` - User-facing messages
- `limits.ts` - Application limits (pagination, etc.)
- `status.ts` - Status codes and enums

#### `/errors` - Custom Error Classes
- `AppError.ts` - Base application error
- `ValidationError.ts` - Validation error
- `NotFoundError.ts` - Resource not found error
- `AuthError.ts` - Authentication error
- `DatabaseError.ts` - Database operation error

#### `/formatters` - Data Formatting Utilities
- `currency.ts` - Currency formatting
- `date.ts` - Date/time formatting
- `text.ts` - Text formatting utilities
- `number.ts` - Number formatting

#### `/mappers` - Data Transformation Mappers
- `product.mapper.ts` - Product data transformation
- `order.mapper.ts` - Order data transformation
- `cart.mapper.ts` - Cart data transformation
- `user.mapper.ts` - User data transformation

#### `/schemas` - Zod Validation Schemas
- `auth.schema.ts` - Authentication schemas
- `product.schema.ts` - Product validation schemas
- `cart.schema.ts` - Cart validation schemas
- `order.schema.ts` - Order validation schemas
- `address.schema.ts` - Address validation schemas

#### `/services` - Business Logic Services
- `auth.service.ts` - Authentication business logic
- `cart.service.ts` - Cart business logic
- `order.service.ts` - Order processing logic
- `payment.service.ts` - Payment processing logic
- `product.service.ts` - Product business logic
- `email.service.ts` - Email sending service
- `notification.service.ts` - Notification service

#### `/supabase` - Database Clients
- `server.ts` - Server-side Supabase client (SSR-safe)
- `client.ts` - Client-side Supabase client
- `types.ts` - Supabase generated types

#### `/validators` - Validation Utilities
- `product.validator.ts` - Product validation
- `order.validator.ts` - Order validation
- `address.validator.ts` - Address validation
- `payment.validator.ts` - Payment validation

#### Root Files
- `utils.ts` - Core utility functions (cn helper for className merging, etc.)

---

### `/types` - TypeScript Definitions

- `supabase.ts` - Database type definitions:
  - `Product` - Product entity
  - `ProductImage` - Product image metadata
  - `ProductVariant` - Product variant options
  - `Category` - Product category
  - `Cart` - Shopping cart
  - `CartItem` - Cart item
  - `Address` - Shipping/billing address
  - `PaymentMethod` - Payment method enum

---

### `/middleware` - Next.js Middleware

- `middleware.ts` - Main middleware file for:
  - Supabase session management
  - Cookie handling
  - Request/response interception
  - Route protection
  - Authentication checks

---

### `/public` - Static Assets

- `hero-image.jpg` - Homepage hero image
- `hero-bg.jpg` - Background image
- SVG icons (file, globe, next, vercel, window)
- Product images
- Brand assets
- Favicon and app icons

---

### `/utils` - Pure Utility Functions

#### `/helpers` - Helper Functions
- `array.helpers.ts` - Array manipulation utilities
- `object.helpers.ts` - Object manipulation utilities
- `string.helpers.ts` - String manipulation utilities
- `date.helpers.ts` - Date manipulation utilities

#### `/http` - HTTP Utilities
- `client.ts` - HTTP client wrapper
- `interceptors.ts` - Request/response interceptors
- `errors.ts` - HTTP error handling

#### `/analytics` - Analytics Utilities
- `tracking.ts` - Event tracking
- `pageview.ts` - Page view tracking
- `conversion.ts` - Conversion tracking

---

### `/tests` - Test Files

- `__mocks__/` - Mock implementations
- `__fixtures__/` - Test data fixtures
- `unit/` - Unit tests
- `integration/` - Integration tests
- `e2e/` - End-to-end tests
- `utils/` - Test utilities and helpers

---

### `/docs` - Documentation

- `api/` - API documentation
- `architecture/` - Architecture decisions and diagrams
- `deployment/` - Deployment guides
- `development/` - Development setup guides
- `contributing.md` - Contribution guidelines

---

### `/scripts` - Build/Deployment Scripts

- `build.sh` - Build script
- `deploy.sh` - Deployment script
- `seed.ts` - Database seeding script
- `migrate.ts` - Database migration script
- `generate-types.ts` - Type generation script

---

## 🔑 Key Design Patterns

### 1. **Server Components First**
- Most components are Server Components by default
- Client components marked with `"use client"`
- Data fetching happens in Server Components

### 2. **Server Actions Pattern**
- Business logic in `/lib/actions`
- All actions marked with `"use server"`
- Direct database operations from server actions

### 3. **Route Groups**
- `(auth)`, `(checkout)`, `(main)` - Organize routes without affecting URL structure
- Allows shared layouts per route group

### 4. **Component Composition**
- shadcn/ui components for base UI
- Feature-specific components build on top
- Reusable, composable design

### 5. **Type Safety**
- TypeScript throughout
- Supabase types for database entities
- Strong typing for props and actions

---

## 🔐 Authentication Flow

1. **Middleware** (`middleware/middleware.ts`)
   - Intercepts all requests
   - Manages Supabase session via cookies
   - Refreshes session automatically

2. **Server Client** (`lib/supabase/server.ts`)
   - Creates SSR-safe Supabase client
   - Uses Next.js cookies() API
   - Handles session in Server Components

3. **Client Client** (`lib/supabase/client.ts`)
   - Browser-side Supabase client
   - Used in Client Components
   - For real-time subscriptions

4. **Auth Helper** (`auth.ts`)
   - Simple session getter
   - Used in Server Components/Actions

---

## 🛒 Shopping Cart Architecture

### Cart Management
- **Server Actions**: `lib/actions/cart.ts`
- **Storage**: 
  - Authenticated users: Linked to `user_id` in database
  - Guest users: Stored in database with `cartId` cookie
- **Components**: `CartSheet.tsx` for UI

### Flow
1. User adds product → `addToCart` server action
2. System finds/creates cart (user-based or cookie-based)
3. Updates/creates cart item
4. Cart persisted in Supabase `carts` and `cart_items` tables

---

## 🎨 Styling Architecture

### Tailwind CSS 4.1
- Utility-first CSS framework
- Custom configuration in `tailwind.config.ts`
- PostCSS processing

### shadcn/ui Components
- Radix UI primitives
- Customizable via `components.json`
- Style: "new-york"
- Theme: "stone" base color
- CSS variables for theming

### Component Styling
- `cn()` utility for className merging
- Variant-based styling (CVA - class-variance-authority)
- Responsive design with Tailwind breakpoints

---

## 📊 Data Flow

### Server-Side Data Fetching
```
Page Component (Server)
  ↓
createClient() from lib/supabase/server
  ↓
Supabase Query
  ↓
Data returned to Component
  ↓
Rendered as HTML
```

### Client-Side Interactions
```
User Action (Client Component)
  ↓
Server Action (lib/actions/*)
  ↓
Supabase Mutation
  ↓
Response/Redirect
```

---

## 🗄️ Database Schema (Inferred from Types)

### Core Tables
- `products` - Product catalog
- `product_images` - Product image metadata
- `product_variants` - Product variants/options
- `categories` - Product categories
- `carts` - Shopping carts
- `cart_items` - Cart line items
- `orders` - Customer orders
- `addresses` - Shipping/billing addresses
- `testimonials` - Customer reviews

---

## 🚀 Key Features

### Implemented
- ✅ Product catalog with images
- ✅ Category browsing
- ✅ Shopping cart (guest & authenticated)
- ✅ Checkout flow (address, payment, confirmation)
- ✅ User authentication
- ✅ Admin dashboard structure
- ✅ Responsive design
- ✅ Image optimization (Next.js Image)

### Architecture Ready For
- ✅ Service layer (`/lib/services`)
- ✅ Custom hooks (`/hooks`)
- ✅ Constants management (`/lib/constants`)
- ✅ Validation schemas (`/lib/schemas`)
- ✅ Error handling (`/lib/errors`)
- ✅ Data formatters (`/lib/formatters`)
- ✅ Data mappers (`/lib/mappers`)
- ✅ Configuration management (`/lib/config`)
- ✅ Testing infrastructure (`/tests`)
- ✅ Documentation (`/docs`)

---

## 📝 Configuration Files

- `next.config.ts` - Next.js configuration (image domains)
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui configuration
- `package.json` - Dependencies & scripts
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration

---

## 🔄 Development Workflow

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Lint code

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📦 Dependencies

### Core
- `next` - React framework
- `react` / `react-dom` - UI library
- `typescript` - Type safety

### Database & Auth
- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - SSR support

### UI & Styling
- `tailwindcss` - CSS framework
- `@radix-ui/*` - UI primitives
- `lucide-react` - Icons
- `class-variance-authority` - Component variants
- `clsx` / `tailwind-merge` - Class utilities

### Utilities
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT handling

---

## 🎯 Best Practices Followed

1. **Separation of Concerns**
   - Components for UI
   - Actions for business logic
   - Types for data structures

2. **Type Safety**
   - TypeScript throughout
   - Typed database queries
   - Typed component props

3. **Performance**
   - Server Components by default
   - Image optimization
   - Code splitting via route groups

4. **Security**
   - Server-side authentication
   - Cookie-based session management
   - Environment variables for secrets

5. **Maintainability**
   - Clear folder structure
   - Reusable components
   - Consistent naming conventions

---

## 🔮 Architecture Benefits

### Scalability
- **Modular Structure**: Clear separation of concerns allows easy scaling
- **Service Layer**: Business logic isolated in services for reusability
- **Hook System**: Shared state and logic through custom hooks
- **Component Organization**: Feature-based component structure

### Maintainability
- **Type Safety**: Comprehensive TypeScript coverage
- **Validation**: Zod schemas for runtime validation
- **Error Handling**: Custom error classes for better error management
- **Documentation**: Dedicated docs folder for knowledge sharing

### Developer Experience
- **Clear Structure**: Intuitive folder organization
- **Reusable Components**: Well-organized component library
- **Utility Functions**: Pure utilities separated from business logic
- **Testing Ready**: Test infrastructure in place

### Best Practices
- **Separation of Concerns**: UI, business logic, and data access separated
- **Single Responsibility**: Each module has a clear purpose
- **DRY Principle**: Reusable hooks, components, and utilities
- **Type Safety**: End-to-end TypeScript coverage

## 🎓 Architecture Patterns Used

1. **Layered Architecture**
   - Presentation Layer (`/components`, `/app`)
   - Business Logic Layer (`/lib/services`, `/lib/actions`)
   - Data Access Layer (`/lib/supabase`, `/lib/mappers`)
   - Utilities Layer (`/utils`, `/lib/utils.ts`)

2. **Feature-Based Organization**
   - Components organized by feature domain
   - Hooks organized by feature domain
   - Services organized by business domain

3. **Server Actions Pattern**
   - Next.js Server Actions for mutations
   - Server Components for data fetching
   - Client Components for interactivity

4. **Custom Hooks Pattern**
   - Encapsulated state and side effects
   - Reusable business logic
   - Clean component code

5. **Service Layer Pattern**
   - Business logic abstraction
   - Reusable across Server Actions and API routes
   - Testable business logic
