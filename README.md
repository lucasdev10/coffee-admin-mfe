# Coffee Admin MFE

Admin Micro Frontend (MFE) for the CoffeeWorkshop e-commerce platform. This is an independent Angular 21 application that handles administrative dashboard and product management functionality.

## Overview

The Admin MFE is a standalone micro frontend that:
- Provides administrative dashboard and analytics
- Manages product catalog (create, read, update, delete operations)
- Enforces role-based access control (ADMIN role required)
- Communicates with the Shell App via NgRx shared store
- Uses Module Federation for remote module loading

**Port**: 4203 (development)  
**Framework**: Angular 21.1.0  
**Testing**: Vitest  
**State Management**: NgRx  
**Styling**: SCSS  
**Shared Library**: coffee-shared-lib

## Prerequisites

- Node.js 22.x or higher
- npm 10.x or higher
- Angular CLI 21.1.2 or higher

## Installation

Install dependencies with legacy peer dependencies flag (required for Angular 21 compatibility):

```bash
npm install --legacy-peer-deps
```

## Development

### Start Development Server

Start the Admin MFE on port 4203:

```bash
npm start
```

The application will be available at `http://localhost:4203`

### Available Scripts

- `npm start` - Start development server on port 4203
- `npm run build` - Build project for production
- `npm test` - Run unit tests with Vitest in watch mode
- `npm run test:watch` - Run tests with live reload
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run linter checks

## Project Structure

```
src/
├── app/
│   ├── admin.routes.ts           # Admin MFE routes exposed via Module Federation
│   ├── app.component.ts          # Root component
│   ├── app.config.ts             # Angular configuration
│   ├── pages/                    # Page components
│   │   ├── admin-dashboard/      # Dashboard page
│   │   ├── admin-products/       # Product list page
│   │   └── admin-product-form/   # Product form page
│   └── services/                 # Local services
├── styles.scss                   # Global styles
├── main.ts                       # Application entry point
└── index.html                    # HTML template

webpack.config.js                 # Module Federation configuration
```

## Module Federation

The Admin MFE is configured as a **remote** in the Module Federation setup:

- **Remote Name**: `admin`
- **Exposed Module**: `./Routes` → `admin.routes.ts`
- **Entry Point**: `/remoteEntry.js`

### Shared Dependencies

The following dependencies are configured as singletons and shared with the Shell App:

- @angular/core
- @angular/common
- @angular/router
- @angular/material
- @ngrx/store
- @ngrx/effects
- rxjs

## State Management

The Admin MFE integrates with the Shell App's global NgRx store:

### Global Store Integration

- **Auth State**: Subscribe to user role from global store to enforce ADMIN role restriction
- **Cart State**: Access global cart state for cross-MFE communication
- **User State**: Access user profile information

### Local Store

Admin MFE maintains local state for:
- Product management operations
- UI state (filters, pagination, sorting)
- Form validation state

## Testing

### Unit Tests

Run tests with Vitest:

```bash
npm test
```

Tests are located alongside components with `.spec.ts` extension:

```
src/app/pages/admin-dashboard/admin-dashboard.component.spec.ts
src/app/pages/admin-products/admin-products.component.spec.ts
src/app/pages/admin-product-form/admin-product-form.component.spec.ts
```

### Test Coverage

Generate coverage report:

```bash
npm run test:coverage
```

## Building for Production

```bash
npm run build
```

Build artifacts are generated in the `dist/` directory.

## Integration with Shell App

The Admin MFE is loaded by the Shell App as a remote module. The Shell App:

1. Routes requests to `/admin/*` to this MFE
2. Enforces authentication and ADMIN role authorization
3. Provides shared services via Core services
4. Manages global state via NgRx store

## Features

### Admin Dashboard
- View application metrics and statistics
- Monitor user activities
- System health indicators

### Product Management
- View all products in catalog
- Create new products
- Edit existing products
- Delete products (with confirmation)
- Filter and search products

### Role-Based Access Control
- Requires ADMIN role to access Admin MFE
- Routes are protected by `roleGuard` in Shell App
- Unauthorized access redirects to login or home page

## Dependencies

### Main Dependencies
- `@angular/*` (21.1.0) - Angular framework
- `@angular/material` (21.1.5) - Material UI components
- `@ngrx/store` (21.0.1) - State management
- `@ngrx/effects` (21.0.1) - Side effects management
- `rxjs` (7.8.0) - Reactive programming
- `coffee-shared-lib` - Shared components, pipes, directives, validators

### Dev Dependencies
- `@angular-architects/module-federation` (21.2.2) - Module Federation support
- `typescript` (5.9.2) - TypeScript compiler
- `vitest` (4.0.8) - Unit testing framework

## Troubleshooting

### npm install fails with peer dependency errors

Use the `--legacy-peer-deps` flag:

```bash
npm install --legacy-peer-deps
```

### Port 4203 already in use

Kill the process using port 4203 or use a different port:

```bash
npm start -- --port 4204
```

### Module Federation remote not loading

1. Verify Admin MFE is running on port 4203
2. Check browser console for network errors
3. Verify webpack.config.js has correct configuration
4. Check Shell App's webpack.config.js for correct remote URL

## Contributing

When developing features:

1. Create components in `src/app/`
2. Write unit tests alongside components
3. Use coffee-shared-lib for reusable components
4. Follow Angular style guide
5. Test locally before committing

## Building and Deployment

For deployment instructions, see the main [CoffeeWorkshop repository](../CoffeeWorkshop/README.md).

## License

Proprietary - CoffeeWorkshop Project

## Related Repositories

- [Shell App](../CoffeeWorkshop) - Main orchestrator application
- [Products MFE](../coffee-products-mfe) - Product catalog MFE
- [Cart MFE](../coffee-cart-mfe) - Shopping cart MFE
- [Shared Library](../coffee-shared-lib) - Reusable components and utilities
