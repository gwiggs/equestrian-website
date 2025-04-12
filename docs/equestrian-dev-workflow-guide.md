# Equestrian Marketplace: Development Workflow Guide

This document outlines the development workflow, Git strategy, and code quality tools for the Equestrian Marketplace project.

## Table of Contents
1. [Git Strategy](#git-strategy)
2. [Branching Workflow](#branching-workflow)
3. [Code Quality Tools](#code-quality-tools)
4. [Docker Development Environment](#docker-development-environment)
5. [Local vs. Container Development](#local-vs-container-development)
6. [Recommended Workflow](#recommended-workflow)

## Git Strategy

### Platform: GitHub

GitHub is recommended for this project because:
- User-friendly interface ideal for beginners
- Excellent documentation and community support
- Free tier is sufficient for initial development
- Built-in project management tools (Issues, Projects)
- Easy integration with CI/CD tools

### Repository Structure

```
equestrian-marketplace/
├── .github/                   # GitHub workflows and templates
├── backend/                   # Node.js API backend
├── frontend/                  # Next.js/React frontend
├── database/                  # Database migration scripts, seeds
├── docs/                      # Project documentation
├── infrastructure/            # Infrastructure as Code files
└── docker-compose.yml         # Development environment setup
```

## Branching Workflow

For solo development, a simplified GitFlow approach is recommended:

### Main Branches

1. **`main`** - Production-ready code
   - Always deployable
   - Never commit directly to main
   - Merge from `develop` when ready to deploy

2. **`develop`** - Main development branch
   - Contains completed features ready for testing
   - Base branch for feature branches
   - Merge to `main` when ready for production

### Supporting Branches

3. **Feature Branches**
   - Branch from: `develop`
   - Merge back to: `develop`
   - Naming: `feature/horse-listing-page`, `feature/user-auth`
   - Focus on one specific feature or component

4. **Bugfix Branches**
   - Branch from: `develop`
   - Merge back to: `develop`
   - Naming: `fix/search-pagination`, `fix/image-upload`

5. **Hotfix Branches** (for production issues)
   - Branch from: `main`
   - Merge back to: `main` AND `develop`
   - Naming: `hotfix/critical-auth-issue`

### Commit Practices

- **Commit Frequently** with smaller, focused changes
- **Use Descriptive Messages** in the imperative mood
- **Consider Conventional Commits Format**:
  - Format: `type(scope): description`
  - Example: `feat(search): implement horse breed filtering`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Workflow Example

```bash
# Start a new feature
git checkout develop
git pull origin develop
git checkout -b feature/horse-search-component

# Work on your feature, making regular commits
git add .
git commit -m "Add initial search form structure"
git add .
git commit -m "Implement breed filter dropdown"

# When feature is complete, merge back to develop
git checkout develop
git pull origin develop
git merge feature/horse-search-component
git push origin develop

# When ready to deploy to production
git checkout main
git pull origin main
git merge develop
git push origin main
```

## Code Quality Tools

### Pre-commit Hooks

Pre-commit hooks are scripts that run automatically before each commit, ensuring code quality standards are met.

#### Setting Up with Husky

```bash
# Install Husky
npm install husky --save-dev
npx husky install
npm set-script prepare "husky install"

# Create a pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run format-check"
```

### Linting with ESLint

ESLint analyzes code for potential errors, style issues, and suspicious patterns.

#### Installation

```bash
npm install eslint --save-dev
npx eslint --init
```

#### Configuration (.eslintrc.js)

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',  // If using React
    'plugin:@typescript-eslint/recommended',  // If using TypeScript
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',  // For TypeScript
  parserOptions: {
    ecmaFeatures: {
      jsx: true,  // If using React
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',  // If using React
    '@typescript-eslint',  // If using TypeScript
  ],
  rules: {
    // Equestrian marketplace specific rules
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'camelcase': ['error', { properties: 'never' }],
    'jsx-a11y/alt-text': 'error',  // Important for horse images
    'no-eval': 'error',
    'react/no-danger': 'error',
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
};
```

### Code Formatting with Prettier

Prettier ensures consistent code formatting across the project.

#### Installation

```bash
npm install prettier --save-dev
npm install eslint-config-prettier eslint-plugin-prettier --save-dev
```

#### Configuration (.prettierrc)

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100
}
```

#### Package.json Scripts

```json
"scripts": {
  "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
  "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
  "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,scss}\"",
  "format-check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,css,scss}\"",
  
  "docker:lint": "docker-compose exec api npm run lint",
  "docker:format": "docker-compose exec api npm run format"
}
```

## Docker Development Environment

The project uses Docker for consistent development environments across platforms.

### Core Docker Components

```yaml
# docker-compose.yml
version: "3.8"

services:
  api:
    build: 
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://postgres:postgres@postgres:5432/equestrian
    depends_on:
      - postgres
  
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "8080:8080"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3000
  
  postgres:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=equestrian
```

### Backend Dockerfile.dev

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies first (leverages Docker cache)
COPY package*.json ./
RUN npm install

# No need to copy source code - will be mounted
EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### Frontend Dockerfile.dev

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# No need to copy source code - will be mounted
EXPOSE 8080

CMD ["npm", "run", "dev"]
```

## Local vs. Container Development

This project uses a hybrid approach where:

1. **Docker containers** run the actual application environment
2. **Local tools** handle code quality and Git workflows

### Local Development Tools (on your machine)

- Git for version control
- Node.js (same version as containers) for local scripts
- ESLint, Prettier for real-time code quality feedback
- Husky for pre-commit hooks
- VS Code or your preferred editor

### Containerized Runtime (in Docker)

- Node.js runtime environment
- PostgreSQL database
- Redis cache
- Other services (search, etc.)

### Managing Version Consistency

Use Node Version Manager (nvm) to maintain version consistency:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Install and use the same Node version as your container
nvm install 18
nvm use 18
```

### Package Dependencies

Ensure your `package.json` clearly separates runtime and development dependencies:

```json
"dependencies": {
  // Runtime dependencies used in Docker
  "express": "^4.18.2",
  "react": "^18.2.0"
},
"devDependencies": {
  // Local development tools
  "eslint": "^8.38.0",
  "prettier": "^2.8.7",
  "husky": "^8.0.3"
}
```

## Recommended Workflow

### Initial Setup

```bash
# Clone repository
git clone https://github.com/your-username/equestrian-marketplace.git
cd equestrian-marketplace

# Set up local development tools
npm install
npx husky install

# Start development environment
docker-compose up -d

# Verify services are running
docker-compose ps
```

### Daily Development Flow

1. **Start the environment**
   ```bash
   docker-compose up -d
   ```

2. **Create/checkout feature branch**
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/new-feature
   ```

3. **Write code with real-time linting** in your editor

4. **Test changes in Docker environment**
   - Watch for automatic reloading of changes
   - View logs if needed: `docker-compose logs -f api`

5. **Commit changes** (pre-commit hooks will run automatically)
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push branch and create PR**
   ```bash
   git push -u origin feature/new-feature
   # Create PR on GitHub
   ```

7. **Merge to develop** after self-review

8. **Stop environment when done**
   ```bash
   docker-compose down
   ```

### Useful Commands

```bash
# View all running containers
docker-compose ps

# Rebuild containers after dependency changes
docker-compose up -d --build

# View logs
docker-compose logs -f [service]

# Run commands in containers
docker-compose exec api npm test
docker-compose exec postgres psql -U postgres -d equestrian

# Stop and remove all containers
docker-compose down
```

This workflow combines the benefits of containerized development (consistency, isolation) with the convenience of local code quality tools, creating an optimal development experience even for a solo developer.
