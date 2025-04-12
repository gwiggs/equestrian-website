# Equestrian Marketplace: Architecture & Development Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Architectural Overview](#architectural-overview)
3. [Technology Stack](#technology-stack)
4. [Development Approach](#development-approach)
5. [Microservices Architecture](#microservices-architecture)
6. [CI/CD Pipeline Implementation](#cicd-pipeline-implementation)
7. [Database Design Considerations](#database-design-considerations)
8. [Security Considerations](#security-considerations)
9. [Scaling Strategy](#scaling-strategy)
10. [Development Roadmap](#development-roadmap)
11. [Frontend Component Design](#frontend-component-design)
12. [Microservice Implementation Details](#microservice-implementation-details)
13. [Database Optimization for Equestrian Data](#database-optimization-for-equestrian-data)
14. [Infrastructure Setup](#infrastructure-setup)
15. [Securing Marketplace Transactions](#securing-marketplace-transactions)
16. [SEO Optimization for Marketplace Listings](#seo-optimization-for-marketplace-listings)

## Introduction

This document outlines the architectural design and development approach for an equestrian marketplace platform. The platform aims to connect buyers and sellers in the equestrian world, similar to car sales or real estate websites, but specialized for horses, equipment, and related services.

Key features will include:
- User accounts (buyers and sellers)
- Listing management for horses and equipment
- Advanced search and filtering
- Messaging between parties
- Payment processing
- Review systems

This architecture is designed to provide a solid foundation that can support additional features and enhancements over time without requiring significant rewrites.

## Architectural Overview

The architecture follows a microservices-based approach, with clearly defined domains separated by business function. This approach allows for:

1. **Scalability**: Individual services can be scaled based on demand
2. **Maintainability**: Services can be developed, tested, and deployed independently
3. **Resilience**: Failures in one service don't necessarily affect others
4. **Technology flexibility**: Different services can use different technologies when appropriate

The system will initially be structured as a "modular monolith" with clear domain boundaries, allowing for easy extraction into separate microservices as the application grows.

## Technology Stack

### Recommended Stack

**Backend:**
- Node.js with Express (primary API services)
- TypeScript (for type safety and improved developer experience)
- PostgreSQL (primary relational database)
- Redis (caching, session management)
- RabbitMQ/Kafka (event messaging between services)

**Frontend:**
- React.js (component library)
- Next.js (server-side rendering for SEO benefits)
- TypeScript
- Redux or Context API (state management)
- Tailwind CSS (utility-first styling)

**Infrastructure:**
- Docker (containerization)
- Kubernetes (orchestration)
- Nginx (reverse proxy/API gateway)
- AWS/Azure/GCP (cloud infrastructure)
- Terraform (infrastructure as code)

**Monitoring & Observability:**
- Prometheus (metrics collection)
- Grafana (visualization)
- ELK Stack (logging)
- Jaeger (distributed tracing)

## Development Approach

### Backend-First Development

Starting with the backend provides several advantages:
1. Defines data models and business rules first
2. Creates clear API contracts
3. Validates core functionality
4. Enables parallel development of frontend components

### Design Philosophy

#### 1. Domain-Driven Design (DDD)

Organize code around business domains:
- **Listings Domain**: Horse listings, equipment, services
- **Users Domain**: Buyers, sellers, administrators
- **Transactions Domain**: Inquiries, offers, payments
- **Reviews Domain**: Feedback, ratings

This approach maintains clear separation of concerns and makes the codebase more intuitive.

#### 2. API-First Development

- Design APIs before implementing them
- Create OpenAPI/Swagger documentation
- Implement versioning from the start (e.g., `/api/v1/listings`)
- Use consistent patterns for all endpoints

**Example API Structure:**
```
/api/v1/users
/api/v1/listings
/api/v1/messages
/api/v1/transactions
/api/v1/reviews
```

#### 3. Test-Driven Development (TDD)

- Write tests before implementing features
- Focus on unit tests for business logic
- Add integration tests for API endpoints
- Implement end-to-end tests for critical user journeys

#### 4. Clean Architecture

Organize with clear separation:
- **Controllers**: Handle HTTP requests/responses
- **Services**: Implement business logic
- **Repositories**: Manage data access
- **Domain Models**: Define core entities

#### 5. Infrastructure as Code

- Use Docker for consistent environments
- Implement CI/CD pipelines early
- Automate deployment processes
- Use Terraform or similar for infrastructure management

## Microservices Architecture

### Core Microservices

1. **User Service**
   - User registration and authentication
   - Profile management
   - Role-based permissions
   - OAuth integration for social login

2. **Listing Service**
   - Horse/equipment listings creation and management
   - Media handling for photos/videos
   - Listing validation and approval
   - Category and attribute management

3. **Search Service**
   - Indexing all listings
   - Advanced filtering (breed, age, discipline, price range)
   - Geographic search capabilities
   - Search analytics

4. **Messaging Service**
   - Buyer-seller communications
   - Notification system (email, SMS, in-app)
   - Message history and archiving
   - Automated messaging

5. **Transaction Service**
   - Payment processing
   - Offers and counteroffers
   - Escrow functionality (if applicable)
   - Transaction history

6. **Review Service**
   - Seller/buyer ratings
   - Review moderation
   - Reputation calculations
   - Fraud detection

### Communication Patterns

#### Synchronous Communication
- REST APIs for direct requests
- gRPC for high-performance internal service communication

#### Asynchronous Communication
- Message queues (RabbitMQ, Kafka) for events
- Event-driven architecture for cross-service operations

**Example Events:**
- `listing.created`
- `user.registered`
- `message.sent`
- `offer.accepted`

### Deployment Architecture

#### Infrastructure Components

1. **API Gateway**
   - Entry point for all client requests
   - Routes requests to appropriate microservices
   - Handles authentication/authorization
   - Rate limiting and throttling

2. **Service Registry/Discovery**
   - Tracks available service instances
   - Enables services to find each other

3. **Configuration Server**
   - Centralized configuration management
   - Environment-specific settings

4. **Monitoring & Observability**
   - Distributed tracing across services
   - Centralized logging
   - Performance metrics

#### Deployment Options

1. **Container Orchestration (Kubernetes)**
   - Each microservice packaged as Docker containers
   - Deployed as pods in Kubernetes
   - Horizontal scaling for high-traffic services
   - Rolling updates for zero downtime

2. **Serverless Components (Optional)**
   - Event-driven functions for notifications, image processing
   - API Gateway for routing
   - Managed databases for certain data needs

3. **Hybrid Approach (Recommended)**
   - Core services on Kubernetes
   - Event-driven functions as serverless
   - Managed services for databases and message queues

### Implementation Path

For a new project, consider this incremental approach:

1. **Start with a "modular monolith"**
   - Single application with clear domain boundaries
   - Separate modules that could become microservices later
   - Shared database but with schema separation

2. **Extract high-value services first**
   - Begin with the Search service (often benefits most from independent scaling)
   - Then separate the Listing service (core of your marketplace)
   - Gradually extract other services as needed

3. **Implement infrastructure incrementally**
   - Start with Docker containers
   - Add Kubernetes when you have 3+ services
   - Implement monitoring early

## CI/CD Pipeline Implementation

A robust CI/CD pipeline is essential for maintaining quality and enabling frequent releases.

### Pipeline Components

1. **Source Control Management**
   - Git repository (GitHub, GitLab, Bitbucket)
   - Branch protection rules
   - Pull request workflows

2. **Continuous Integration (CI)**
   - Automated testing
   - Code quality analysis
   - Security scanning
   - Container image building

3. **Continuous Delivery/Deployment (CD)**
   - Infrastructure provisioning
   - Environment configuration
   - Automated deployments
   - Post-deployment verification

### Implementation Timeline

#### Initial Setup (Week 1-2)

1. **Repository Structure**
   - Monorepo approach for initial development
   - Separate directories for services, shared libraries
   - Infrastructure as Code (IaC) in dedicated directory

2. **Pipeline Configuration**
   - Set up GitHub Actions, GitLab CI, or Jenkins
   - Create initial pipeline YAML files
   - Define environments (dev, staging, prod)

3. **Docker Configuration**
   - Create Dockerfiles for services
   - Set up multi-stage builds for efficiency
   - Implement Docker Compose for local development

**Example GitHub Actions Workflow:**

```yaml
name: Equestrian Marketplace CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run tests
        run: npm run test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: yourusername/equestrian-marketplace:${{ github.sha }}

  deploy-dev:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up kubectl
        uses: azure/k8s-set-context@v1
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG_DEV }}
      - name: Deploy to development
        run: |
          kubectl set image deployment/marketplace-api marketplace-api=yourusername/equestrian-marketplace:${{ github.sha }} --namespace=dev
          kubectl rollout status deployment/marketplace-api --namespace=dev
```

#### Advanced Pipeline Features (Week 3-8)

1. **Staging and Production Deployment**

```yaml
  deploy-staging:
    needs: deploy-dev
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        # Similar to deploy-dev but with staging environment

  deploy-production:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        # Production deployment with approval step
```

2. **Database Migrations**

```yaml
  database-migrations:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - name: Run migrations
        run: npm run migrate:up
      - name: Verify migration
        run: npm run migrate:status
```

3. **Quality Gates**
   - Code coverage thresholds
   - Performance testing
   - Accessibility checks
   - Security scanning (OWASP, dependency checks)

4. **Deployment Strategies**
   - Blue/Green deployment
   - Canary releases
   - Feature flags for controlled rollouts

### CI/CD Best Practices

1. **Infrastructure as Code**
   - Never make manual infrastructure changes
   - Store all Kubernetes manifests in Git
   - Use Helm charts for complex deployments
   - Use Terraform for cloud resources

2. **Secrets Management**
   - Never store secrets in code
   - Use environment variables for local development
   - Use a secrets management solution (HashiCorp Vault, AWS Secrets Manager)
   - Rotate credentials regularly

3. **Pipeline as Code**
   - Store pipeline configurations in the same repository as your code
   - Version pipeline changes alongside application changes
   - Test pipeline changes in isolation

4. **Developer Experience**
   - Make local development match CI environment
   - Create development environment setup scripts
   - Document CI/CD workflows clearly
   - Establish quick feedback loops

## Database Design Considerations

### Data Modeling Approach

1. **Initial Schema Design**
   - Start with normalized schema for core entities
   - Define clear relationships between entities
   - Use foreign keys to maintain referential integrity
   - Consider soft deletes for most entities

2. **PostgreSQL-Specific Features**
   - Use JSON/JSONB columns for flexible attributes
   - Implement full-text search capabilities
   - Use array types where appropriate
   - Consider partitioning for large tables (e.g., messages, transaction history)

3. **Sample Core Entities**

**Users:**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(20) NOT NULL, -- buyer, seller, admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);
```

**Listings:**
```sql
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    category VARCHAR(50) NOT NULL, -- horse, equipment, service
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, sold, expired
    location_name VARCHAR(255),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    attributes JSONB, -- flexible attributes based on category
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    views_count INTEGER DEFAULT 0
);
```

### Database Migration Strategy

1. **Use a Migration Tool**
   - Sequelize, Knex, or TypeORM for Node.js
   - Implement versioned migrations
   - Include both up and down migration scripts

2. **Migration Best Practices**
   - Never modify existing migrations
   - Make migrations small and focused
   - Run migrations automatically in CI/CD pipeline
   - Test migrations with production-like data volumes

3. **Zero-Downtime Migrations**
   - Add new columns as nullable first
   - Deploy code that can work with both old and new schema
   - Backfill data as needed
   - Make schema changes required only after code is fully deployed

### Scaling Considerations

1. **Read/Write Splitting**
   - Primary database for writes
   - Read replicas for heavy read operations

2. **Caching Strategy**
   - Redis for frequently accessed data
   - Cache invalidation strategy (TTL, event-based)
   - Consider cache-aside pattern for listings data

3. **Data Partitioning**
   - Vertical partitioning (splitting tables by column)
   - Horizontal partitioning (sharding) for high-volume tables
   - Consider time-based partitioning for historical data

## Security Considerations

### Authentication & Authorization

1. **User Authentication**
   - JWT-based authentication
   - OAuth integration for social login
   - 2FA for sensitive operations
   - Password policies and secure storage

2. **Authorization Framework**
   - Role-based access control (RBAC)
   - Permission-based checks for API endpoints
   - Resource ownership validation

3. **API Security**
   - Rate limiting
   - CORS configuration
   - Input validation and sanitization
   - Output encoding

### Data Protection

1. **Encryption**
   - Data-at-rest encryption for databases
   - TLS for all connections
   - Encrypt sensitive user data (PII)

2. **PII Handling**
   - Identify and classify PII
   - Implement data minimization
   - Retention policies
   - Right to be forgotten compliance

3. **Secure Development Practices**
   - Regular dependency scanning
   - Static application security testing (SAST)
   - Dynamic application security testing (DAST)
   - Regular penetration testing

## Scaling Strategy

### Vertical Scaling

1. **Resource Optimization**
   - Profile and optimize existing services
   - Increase resources for critical components
   - Database query optimization

### Horizontal Scaling

1. **Stateless Services**
   - Design services to be stateless
   - Store session data in Redis
   - Enable easy replication of service instances

2. **Database Scaling**
   - Read replicas for read-heavy operations
   - Connection pooling
   - Eventual consideration of sharding

3. **Caching Strategy**
   - Implement Redis/Memcached for hot data
   - CDN for static assets
   - Consider distributed caching

### Load Balancing

1. **Service Load Balancing**
   - Kubernetes service mesh (Istio, Linkerd)
   - Health checks and circuit breaking
   - Traffic splitting for canary deployments

2. **Global Load Balancing**
   - Consider multi-region deployment
   - CDN for global content delivery
   - Geo-routing for reduced latency

## Development Roadmap

### Phase 1: Foundation (Months 1-2)

1. **Core Infrastructure**
   - Set up CI/CD pipeline
   - Configure development, staging, and production environments
   - Implement base services structure

2. **Auth Service**
   - User registration and authentication
   - Basic profile management
   - Role-based access control

3. **Listing Service**
   - Basic CRUD operations for listings
   - Image upload and management
   - Simple search functionality

### Phase 2: Core Marketplace (Months 3-4)

1. **Search Enhancements**
   - Advanced filtering
   - Geolocation-based search
   - Search analytics

2. **Messaging System**
   - User-to-user messaging
   - Notifications
   - Message history

3. **Payment Integration**
   - Connect payment processor
   - Basic transaction handling
   - Order history

### Phase 3: Advanced Features (Months 5-6)

1. **Reviews and Ratings**
   - Seller/buyer feedback system
   - Rating aggregation
   - Review moderation

2. **Analytics Dashboard**
   - User engagement metrics
   - Listing performance
   - Conversion tracking

3. **Mobile Responsiveness**
   - Progressive web app features
   - Mobile-specific UX enhancements
   - Push notifications

### Phase 4: Scaling and Optimization (Months 7-8)

1. **Performance Optimization**
   - Application performance monitoring
   - Database query optimization
   - Load testing and scaling

2. **Internationalization**
   - Multi-language support
   - Region-specific features
   - Currency conversion

3. **Advanced Security**
   - 2FA implementation
   - Advanced fraud detection
   - Security audit and penetration testing

---

This architecture and development guide serves as a reference for building the equestrian marketplace platform. The approach outlined here focuses on creating a solid foundation that can evolve over time, with clear separation of concerns and a path to scale as the platform grows.

## Frontend Component Design

### Component Architecture

A well-structured frontend architecture is critical for maintainability and scalability. For the equestrian marketplace, we recommend following an Atomic Design methodology:

1. **Atoms** (Basic Components)
   - Buttons, inputs, labels, icons
   - Typography elements
   - Form controls

2. **Molecules** (Composite Components)
   - Search bars (input + button)
   - Form groups
   - Card elements
   - Rating displays

3. **Organisms** (Complex Components)
   - Navigation headers
   - Listing cards
   - User profiles
   - Message threads
   - Advanced filters

4. **Templates** (Page Layouts)
   - Listing detail template
   - Search results template
   - User dashboard template
   - Checkout flow template

5. **Pages** (Complete Views)
   - Homepage
   - Listing detail page
   - Search results page
   - User profile page

### Key Component Examples

#### Listing Card Component

```jsx
import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

const ListingCard = ({ 
  title, 
  price, 
  location, 
  imageUrl, 
  category, 
  breed, 
  age, 
  featured 
}) => {
  return (
    <div className={`rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg ${featured ? 'border-2 border-amber-500' : ''}`}>
      <div className="relative">
        <img 
          src={imageUrl || '/placeholder-horse.jpg'} 
          alt={title}
          className="h-48 w-full object-cover"
        />
        {featured && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            Featured
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100">
            <Heart size={18} className="text-gray-600" />
          </button>
          <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100">
            <MessageCircle size={18} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          <p className="text-lg font-bold text-green-600">${price.toLocaleString()}</p>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          <p>{location}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {category && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                {category}
              </span>
            )}
            {breed && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                {breed}
              </span>
            )}
            {age && (
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs">
                {age} years
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
```

#### Advanced Search Filter Component

```jsx
import React, { useState } from 'react';
import { Slider } from 'your-ui-library'; // Use your chosen UI library

const EquineSearchFilters = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 50000],
    breed: [],
    ageRange: [0, 30],
    discipline: [],
    gender: [],
    height: [],
    location: '',
    radius: 50,
    sortBy: 'relevance'
  });

  const disciplines = [
    'Dressage', 'Jumping', 'Eventing', 'Western', 'Trail', 
    'Endurance', 'Racing', 'Driving', 'Therapy'
  ];

  const breeds = [
    'Thoroughbred', 'Arabian', 'Quarter Horse', 'Warmblood', 
    'Friesian', 'Andalusian', 'Morgan', 'Appaloosa', 'Tennessee Walker'
  ];

  const handleChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const handleMultiSelect = (field, value) => {
    const currentValues = filters[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setFilters({
      ...filters,
      [field]: newValues
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({
      category: '',
      priceRange: [0, 50000],
      breed: [],
      ageRange: [0, 30],
      discipline: [],
      gender: [],
      height: [],
      location: '',
      radius: 50,
      sortBy: 'relevance'
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Refine Search</h2>
      
      {/* Category Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {['Horses', 'Equipment', 'Services'].map(cat => (
            <button
              key={cat}
              className={`px-3 py-2 rounded-md text-sm ${
                filters.category === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => handleChange('category', cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </label>
        <Slider
          range
          min={0}
          max={100000}
          step={1000}
          value={filters.priceRange}
          onChange={value => handleChange('priceRange', value)}
        />
      </div>
      
      {/* Breed Selection (if category is Horses) */}
      {filters.category === 'Horses' && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Breed</label>
          <div className="grid grid-cols-2 gap-2">
            {breeds.map(breed => (
              <label key={breed} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.breed.includes(breed)}
                  onChange={() => handleMultiSelect('breed', breed)}
                />
                <span className="text-sm">{breed}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      {/* Age Range (if category is Horses) */}
      {filters.category === 'Horses' && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Age: {filters.ageRange[0]} - {filters.ageRange[1]} years
          </label>
          <Slider
            range
            min={0}
            max={30}
            value={filters.ageRange}
            onChange={value => handleChange('ageRange', value)}
          />
        </div>
      )}
      
      {/* Location search */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Location</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="City, State or ZIP"
          value={filters.location}
          onChange={e => handleChange('location', e.target.value)}
        />
        <div className="mt-2">
          <label className="block text-sm font-medium mb-2">
            Within {filters.radius} miles
          </label>
          <Slider
            min={5}
            max={200}
            value={filters.radius}
            onChange={value => handleChange('radius', value)}
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-2 mt-6">
        <button
          onClick={handleApply}
          className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default EquineSearchFilters;
```

### State Management

For an equestrian marketplace with complex state requirements:

1. **Global State**
   - User authentication state
   - Shopping cart/saved listings
   - Notifications
   - Site-wide preferences

2. **Local Component State**
   - Form inputs
   - UI toggles
   - Pagination state
   - Sorting preferences

3. **Recommended Approach**
   - Context API for authentication and user preferences
   - Redux for complex global state (shopping cart, notifications)
   - React Query for server state (listings, search results)

### Responsive Design Strategy

1. **Mobile-First Approach**
   - Design for mobile devices first
   - Enhance for larger screens
   - Use responsive units (rem, %, vh/vw)

2. **Breakpoint Strategy**
   - xs: < 640px (mobile)
   - sm: 640px - 768px (large mobile/small tablet)
   - md: 768px - 1024px (tablet/small laptop)
   - lg: 1024px - 1280px (desktop)
   - xl: > 1280px (large desktop)

3. **Performance Considerations**
   - Lazy loading for images
   - Skeleton loaders for content
   - Code splitting for route-based components
   - Image optimization for equine photographs

### Accessibility Considerations

1. **WCAG Compliance**
   - Aim for WCAG 2.1 AA compliance
   - Implement proper heading structure
   - Ensure sufficient color contrast
   - Add aria attributes where appropriate

2. **Keyboard Navigation**
   - Ensure all interactive elements are keyboard accessible
   - Implement focus indicators
   - Create logical tab order

3. **Screen Reader Support**
   - Add alt text for images
   - Use semantic HTML
   - Implement aria-live regions for dynamic content

## Microservice Implementation Details

### User Service

The User Service handles all aspects of user management, including authentication, profile management, and permissions.

#### Key Features

1. **Authentication**
   - Email/password registration and login
   - OAuth integration (Google, Facebook, Apple)
   - JWT token issuance and validation
   - Refresh token rotation

2. **Profile Management**
   - Basic profile information (name, contact details)
   - Seller-specific information (business details, verification)
   - Buyer preferences
   - Notification settings

3. **Permission Management**
   - Role-based access control
   - Fine-grained permissions
   - Seller verification status

#### API Endpoints

```
POST /api/v1/users/register - Register new user
POST /api/v1/users/login - Login
POST /api/v1/users/refresh-token - Refresh access token
GET /api/v1/users/me - Get current user profile
PUT /api/v1/users/me - Update user profile
GET /api/v1/users/:id - Get public user profile
POST /api/v1/users/verify-email - Verify email address
POST /api/v1/users/forgot-password - Initiate password reset
POST /api/v1/users/reset-password - Complete password reset
PUT /api/v1/users/avatar - Update profile picture
GET /api/v1/users/me/saved-listings - Get saved listings
POST /api/v1/users/me/saved-listings/:listingId - Save a listing
DELETE /api/v1/users/me/saved-listings/:listingId - Remove saved listing
```

#### Implementation Example (User Registration Service)

```typescript
// src/services/user-service.ts
import { hash } from 'bcrypt';
import { UserRepository } from '../repositories/user-repository';
import { EmailService } from './email-service';
import { User, UserRole } from '../models/user';
import { BadRequestError, ConflictError } from '../errors';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}

  async registerUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    userType: 'buyer' | 'seller';
  }): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Validate password strength
    if (userData.password.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters');
    }

    // Hash password
    const passwordHash = await hash(userData.password, 10);

    // Create user
    const user = await this.userRepository.create({
      email: userData.email,
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      userType: userData.userType,
      role: userData.userType === 'seller' ? UserRole.SELLER : UserRole.BUYER,
      isVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Generate verification token
    const verificationToken = this.generateVerificationToken();
    await this.userRepository.saveVerificationToken(user.id, verificationToken);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.firstName,
      verificationToken
    );

    return user;
  }

  private generateVerificationToken(): string {
    // Generate a random token
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Additional methods for user management...
}
```

### Listing Service

The Listing Service manages all aspects of creating, updating, and managing listings in the marketplace.

#### Key Features

1. **Listing Management**
   - Create, update, delete listings
   - Listing approval workflow for admins
   - Listing status management (active, sold, expired)
   - Featured listings and promotion options

2. **Media Management**
   - Image upload and storage
   - Video support
   - Image optimization
   - Gallery management

3. **Attribute Management**
   - Category-specific attributes
   - Custom fields for different horse types
   - Equipment specifications
   - Service details

#### API Endpoints

```
GET /api/v1/listings - List all listings with filters
GET /api/v1/listings/:id - Get specific listing
POST /api/v1/listings - Create new listing
PUT /api/v1/listings/:id - Update listing
DELETE /api/v1/listings/:id - Delete listing
POST /api/v1/listings/:id/media - Upload media to listing
DELETE /api/v1/listings/:id/media/:mediaId - Remove media
PUT /api/v1/listings/:id/status - Update listing status
GET /api/v1/listings/categories - Get all categories
GET /api/v1/listings/attributes - Get attributes by category
```

#### Domain Model (Listing Entity)

```typescript
// src/models/listing.ts
export enum ListingStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  SOLD = 'sold',
  EXPIRED = 'expired',
}

export enum ListingCategory {
  HORSE = 'horse',
  EQUIPMENT = 'equipment',
  SERVICE = 'service',
}

export interface ListingMedia {
  id: string;
  url: string;
  thumbnailUrl: string;
  type: 'image' | 'video';
  isFeatured: boolean;
  sortOrder: number;
}

export interface HorseAttributes {
  breed: string;
  age: number;
  gender: 'stallion' | 'mare' | 'gelding';
  height: number; // in hands
  color: string;
  discipline: string[];
  temperament: string;
  healthRecords: boolean;
  training: string;
  // Additional horse-specific attributes
}

export interface EquipmentAttributes {
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  brand: string;
  model: string;
  ageYears: number;
  category: string; // saddle, bridle, etc.
  size: string;
  color: string;
  // Additional equipment-specific attributes
}

export interface ServiceAttributes {
  serviceType: string; // training, lessons, boarding, etc.
  availability: string;
  experience: number; // years
  credentials: string[];
  // Additional service-specific attributes
}

export type ListingAttributes = HorseAttributes | EquipmentAttributes | ServiceAttributes;

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: ListingCategory;
  status: ListingStatus;
  locationName: string;
  latitude?: number;
  longitude?: number;
  attributes: ListingAttributes;
  media: ListingMedia[];
  isFeatured: boolean;
  featuredUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  viewsCount: number;
  isNegotiable: boolean;
}
```

### Search Service

The Search Service provides advanced search capabilities for the marketplace, allowing users to find exactly what they're looking for efficiently.

#### Key Features

1. **Full-Text Search**
   - Search across listing titles and descriptions
   - Keyword highlighting
   - Spelling correction and suggestions

2. **Advanced Filtering**
   - Category-specific filters
   - Price range filtering
   - Geographic location filtering
   - Multi-select attribute filtering

3. **Sorting and Ranking**
   - Relevance-based sorting
   - Price sorting (high to low, low to high)
   - Date sorting (newest first)
   - Distance-based sorting

#### Technologies

For the search service, we recommend using Elasticsearch which provides:
- High-performance full-text search
- Complex query capabilities
- Geospatial search
- Aggregations for faceted navigation

#### Implementation Example (Search Index Update)

```typescript
// src/services/search-indexing-service.ts
import { Client } from '@elastic/elasticsearch';
import { Listing } from '../models/listing';

export class SearchIndexingService {
  constructor(private readonly esClient: Client) {}

  async indexListing(listing: Listing): Promise<void> {
    // Prepare the document for indexing
    const searchDoc = this.transformListingToSearchDocument(listing);
    
    // Index the document
    await this.esClient.index({
      index: 'listings',
      id: listing.id,
      document: searchDoc,
      refresh: true, // Make the document immediately searchable
    });
  }

  async updateListingIndex(listing: Listing): Promise<void> {
    await this.indexListing(listing);
  }

  async removeListingFromIndex(listingId: string): Promise<void> {
    await this.esClient.delete({
      index: 'listings',
      id: listingId,
    });
  }

  private transformListingToSearchDocument(listing: Listing): any {
    // Base fields that all listings have
    const searchDoc = {
      id: listing.id,
      sellerId: listing.sellerId,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      currency: listing.currency,
      category: listing.category,
      status: listing.status,
      location: listing.locationName,
      isFeatured: listing.isFeatured,
      createdAt: listing.createdAt.toISOString(),
      // Add a location field for geo queries if latitude and longitude exist
      ...(listing.latitude && listing.longitude
        ? {
            geo: {
              lat: listing.latitude,
              lon: listing.longitude,
            },
          }
        : {}),
    };

    // Add category-specific fields
    switch (listing.category) {
      case 'horse':
        const horseAttrs = listing.attributes as HorseAttributes;
        return {
          ...searchDoc,
          breed: horseAttrs.breed,
          age: horseAttrs.age,
          gender: horseAttrs.gender,
          height: horseAttrs.height,
          color: horseAttrs.color,
          discipline: horseAttrs.discipline,
        };

      case 'equipment':
        const equipAttrs = listing.attributes as EquipmentAttributes;
        return {
          ...searchDoc,
          condition: equipAttrs.condition,
          brand: equipAttrs.brand,
          model: equipAttrs.model,
          equipmentCategory: equipAttrs.category,
        };

      case 'service':
        const serviceAttrs = listing.attributes as ServiceAttributes;
        return {
          ...searchDoc,
          serviceType: serviceAttrs.serviceType,
          experience: serviceAttrs.experience,
        };

      default:
        return searchDoc;
    }
  }
}
```

### Messaging Service

The Messaging Service enables communication between buyers and sellers, facilitating negotiations and questions about listings.

#### Key Features

1. **Direct Messaging**
   - Private conversations between users
   - Listing-specific inquiries
   - Message history
   - Read receipts

2. **Notifications**
   - In-app notifications
   - Email notifications
   - Push notifications (for mobile)
   - Notification preferences

#### API Endpoints

```
GET /api/v1/messages/conversations - Get all conversations
GET /api/v1/messages/conversations/:id - Get specific conversation
POST /api/v1/messages/conversations - Start new conversation
GET /api/v1/messages/conversations/:id/messages - Get messages in conversation
POST /api/v1/messages/conversations/:id/messages - Send message
PUT /api/v1/messages/messages/:id/read - Mark message as read
GET /api/v1/notifications - Get notifications
PUT /api/v1/notifications/:id/read - Mark notification as read
PUT /api/v1/notifications/preferences - Update notification preferences
```

### Transaction Service

The Transaction Service handles all aspects of payments, offers, and financial transactions between buyers and sellers.

#### Key Features

1. **Payment Processing**
   - Integration with payment gateways (Stripe, PayPal)
   - Secure transaction handling
   - Payment status tracking
   - Refund processing

2. **Offer Management**
   - Make offers on listings
   - Accept/reject offers
   - Counteroffer functionality
   - Offer expiration management

#### Implementation Considerations

- Use a reliable payment processor with strong API documentation
- Implement webhooks for payment status updates
- Store minimal payment information (use payment processor tokens)
- Implement strong audit logging for all financial transactions

## Database Optimization for Equestrian Data

### Specialized Schemas for Equestrian Data

1. **Horse Listing Schema Extensions**

```sql
CREATE TABLE horse_details (
    id UUID PRIMARY KEY REFERENCES listings(id),
    breed VARCHAR(100) NOT NULL,
    age_years INT,
    age_months INT,
    gender VARCHAR(20) NOT NULL, -- stallion, mare, gelding
    height_hands DECIMAL(3,1), -- in hands (e.g., 16.2)
    color VARCHAR(50),
    markings TEXT,
    registration_number VARCHAR(100),
    registration_association VARCHAR(100),
    pedigree JSONB, -- Store complex pedigree information
    health_records JSONB, -- Vaccination records, health history
    discipline VARCHAR(100)[], -- Array of disciplines (dressage, jumping, etc.)
    training_level VARCHAR(100),
    temperament TEXT,
    is_kid_safe BOOLEAN,
    is_beginner_safe BOOLEAN,
    is_mare_in_foal BOOLEAN,
    stud_fee DECIMAL(10,2), -- If stallion available for breeding
    last_wormed DATE,
    last_vaccinated DATE,
    last_dental DATE,
    last_farrier DATE,
    video_urls TEXT[] -- Videos of horse in action
);

CREATE INDEX idx_horse_breed ON horse_details(breed);
CREATE INDEX idx_horse_gender ON horse_details(gender);
CREATE INDEX idx_horse_age ON horse_details(age_years);
CREATE INDEX idx_horse_height ON horse_details(height_hands);
CREATE INDEX idx_horse_disciplines ON horse_details USING GIN(discipline);
```

2. **Equipment Schema Optimization**

```sql
CREATE TABLE equipment_details (
    id UUID PRIMARY KEY REFERENCES listings(id),
    category VARCHAR(50) NOT NULL, -- saddle, bridle, blanket, etc.
    sub_category VARCHAR(50), -- english saddle, western saddle
    brand VARCHAR(100),
    model VARCHAR(100),
    condition VARCHAR(20) NOT NULL, -- new, like-new, good, fair, poor
    age_years INT,
    size VARCHAR(50), -- size designation appropriate for category
    color VARCHAR(50),
    material VARCHAR(50), -- leather, synthetic, etc.
    suitable_disciplines VARCHAR(100)[], -- disciplines this equipment is designed for
    specifications JSONB, -- Varied specs based on equipment type
    includes_items TEXT[] -- Additional items included in sale
);

CREATE INDEX idx_equipment_category ON equipment_details(category);
CREATE INDEX idx_equipment_brand ON equipment_details(brand);
CREATE INDEX idx_equipment_condition ON equipment_details(condition);
```

3. **Service Schema Optimization**

```sql
CREATE TABLE service_details (
    id UUID PRIMARY KEY REFERENCES listings(id),
    service_type VARCHAR(50) NOT NULL, -- training, lessons, boarding, etc.
    provider_experience_years INT,
    provider_credentials TEXT[],
    location_type VARCHAR(50), -- on-site, provider location, virtual
    facility_amenities JSONB, -- For boarding/training services
    availability JSONB, -- Complex availability schedule
    duration VARCHAR(50), -- session length or service duration
    skill_level VARCHAR(50)[], -- beginner, intermediate, advanced
    suitable_disciplines VARCHAR(100)[], -- disciplines covered by service
    insurance_provider VARCHAR(100),
    is_certified BOOLEAN,
    certification_details JSONB
);

CREATE INDEX idx_service_type ON service_details(service_type);
CREATE INDEX idx_service_location ON service_details(location_type);
```

### Query Optimization for Equestrian Data

1. **Common Query Patterns**

For horses, common queries include:
- Breed + Age + Gender combinations
- Discipline + Training Level
- Price Range + Location
- Height + Age for rider suitability

2. **Optimization Techniques**

```sql
-- Create composite indexes for common query patterns
CREATE INDEX idx_horse_search_1 ON horse_details(breed, gender, age_years);
CREATE INDEX idx_horse_search_2 ON horse_details USING GIN(discipline) INCLUDE (training_level);

-- Create a GiST index for location-based searches
CREATE INDEX idx_listing_location ON listings USING GIST(ll_to_earth(latitude, longitude));

-- Create functional indexes for common computations
CREATE INDEX idx_horse_price_per_year ON listings ((price / NULLIF(horse_details.age_years, 0))) 
WHERE listings.category = 'horse' AND horse_details.age_years > 0;
```

3. **Full-Text Search Optimization**

```sql
-- Create a full text search vector for horse listings
ALTER TABLE listings ADD COLUMN search_vector tsvector;

CREATE FUNCTION update_listing_search_vector() RETURNS trigger AS $
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
  
  -- Add horse-specific attributes if available
  IF NEW.category = 'horse' THEN
    SELECT setweight(to_tsvector('english', 
      COALESCE(h.breed, '') || ' ' || 
      COALESCE(h.color, '') || ' ' || 
      COALESCE(h.training_level, '') || ' ' ||
      COALESCE(array_
      COALESCE(array_to_string(h.discipline, ' '), '')), 'C')
    INTO NEW.search_vector
    FROM horse_details h
    WHERE h.id = NEW.id;
  END IF;
  
  RETURN NEW;
END
$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_listing_search_vector
BEFORE INSERT OR UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION update_listing_search_vector();

-- Create index for the search vector
CREATE INDEX idx_listing_search ON listings USING GIN(search_vector);
```

### Data Partitioning for Scale

As your equestrian marketplace grows, consider implementing partitioning:

1. **Time-Based Partitioning**

```sql
-- Partition messages by month
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE messages_y2025m01 PARTITION OF messages
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
    
CREATE TABLE messages_y2025m02 PARTITION OF messages
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
    
-- Add trigger to automatically create new partitions
```

2. **Regional Partitioning**

For a global equestrian marketplace, consider partitioning by geographic region:

```sql
-- Partition listings by region
CREATE TABLE listings (
    id UUID NOT NULL,
    /* other columns */
    region VARCHAR(20) NOT NULL
) PARTITION BY LIST (region);

CREATE TABLE listings_na PARTITION OF listings
    FOR VALUES IN ('north_america');
    
CREATE TABLE listings_europe PARTITION OF listings
    FOR VALUES IN ('europe');
    
CREATE TABLE listings_asia PARTITION OF listings
    FOR VALUES IN ('asia');
    
CREATE TABLE listings_other PARTITION OF listings
    FOR VALUES IN ('other');
```

### Caching Strategy for Equestrian Data

1. **Redis Caching for Frequent Queries**

```typescript
// src/services/listing-cache-service.ts
import Redis from 'ioredis';
import { Listing } from '../models/listing';

export class ListingCacheService {
  constructor(private readonly redisClient: Redis) {}

  private readonly LISTING_KEY_PREFIX = 'listing:';
  private readonly LISTING_TTL = 3600; // 1 hour in seconds
  
  private readonly FEATURED_LISTINGS_KEY = 'featured_listings';
  private readonly FEATURED_LISTINGS_TTL = 300; // 5 minutes
  
  private readonly BREED_STATS_KEY_PREFIX = 'breed_stats:';
  private readonly BREED_STATS_TTL = 86400; // 24 hours

  async cacheListing(listing: Listing): Promise<void> {
    const key = `${this.LISTING_KEY_PREFIX}${listing.id}`;
    await this.redisClient.setex(
      key,
      this.LISTING_TTL,
      JSON.stringify(listing)
    );
  }

  async getCachedListing(listingId: string): Promise<Listing | null> {
    const key = `${this.LISTING_KEY_PREFIX}${listingId}`;
    const cachedData = await this.redisClient.get(key);
    
    if (!cachedData) {
      return null;
    }
    
    return JSON.parse(cachedData) as Listing;
  }

  async invalidateListingCache(listingId: string): Promise<void> {
    const key = `${this.LISTING_KEY_PREFIX}${listingId}`;
    await this.redisClient.del(key);
  }

  async cacheFeaturedListings(listingIds: string[]): Promise<void> {
    await this.redisClient.setex(
      this.FEATURED_LISTINGS_KEY,
      this.FEATURED_LISTINGS_TTL,
      JSON.stringify(listingIds)
    );
  }

  // Cache breed-specific statistics (avg price, count, etc.)
  async cacheBreedStats(breed: string, stats: any): Promise<void> {
    const key = `${this.BREED_STATS_KEY_PREFIX}${breed.toLowerCase()}`;
    await this.redisClient.setex(
      key,
      this.BREED_STATS_TTL,
      JSON.stringify(stats)
    );
  }
}
```

## Infrastructure Setup

### Kubernetes Cluster Setup

For a production-ready equestrian marketplace, a properly configured Kubernetes cluster is essential.

#### Cluster Architecture

1. **Node Types**
   - **Control Plane Nodes**: Manage the cluster (minimum 3 for high availability)
   - **Application Nodes**: Run your microservices (auto-scaling based on load)
   - **Database Nodes**: Dedicated nodes for database workloads
   - **Utility Nodes**: Run CI/CD, monitoring, and other support services

2. **Resource Planning**

For initial deployment:
- Control Plane: 3 x 2 vCPU, 4GB RAM
- Application: 3-5 x 4 vCPU, 8GB RAM (auto-scaling)
- Database: 2 x 8 vCPU, 32GB RAM (for primary and standby)
- Utility: 2 x 4 vCPU, 8GB RAM

#### Terraform Infrastructure Definition

```hcl
# main.tf - Example Terraform configuration for AWS EKS

provider "aws" {
  region = "us-west-2"
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "3.14.0"

  name = "equestrian-marketplace-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-west-2a", "us-west-2b", "us-west-2c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  single_nat_gateway = false
  one_nat_gateway_per_az = true
  
  tags = {
    Environment = "production"
    Project     = "equestrian-marketplace"
  }
}

module "eks" {
  source = "terraform-aws-modules/eks/aws"
  version = "18.20.5"

  cluster_name    = "equestrian-marketplace"
  cluster_version = "1.23"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  # Control plane config
  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = true
  
  # Node groups
  eks_managed_node_groups = {
    application = {
      name = "application-nodes"
      
      instance_types = ["m5.large"]
      capacity_type  = "ON_DEMAND"
      
      min_size     = 3
      max_size     = 10
      desired_size = 3
      
      labels = {
        role = "application"
      }
    }
    
    database = {
      name = "database-nodes"
      
      instance_types = ["r5.2xlarge"]
      capacity_type  = "ON_DEMAND"
      
      min_size     = 2
      max_size     = 4
      desired_size = 2
      
      labels = {
        role = "database"
      }
      
      taints = [{
        key    = "dedicated"
        value  = "database"
        effect = "NO_SCHEDULE"
      }]
    }
    
    utility = {
      name = "utility-nodes"
      
      instance_types = ["m5.xlarge"]
      capacity_type  = "ON_DEMAND"
      
      min_size     = 2
      max_size     = 2
      desired_size = 2
      
      labels = {
        role = "utility"
      }
    }
  }
  
  # Add-ons
  cluster_addons = {
    coredns = {
      resolve_conflicts = "OVERWRITE"
    }
    kube-proxy = {
      resolve_conflicts = "OVERWRITE"
    }
    vpc-cni = {
      resolve_conflicts = "OVERWRITE"
    }
  }
  
  tags = {
    Environment = "production"
    Project     = "equestrian-marketplace"
  }
}

# PostgreSQL RDS instance (alternative to running in Kubernetes)
resource "aws_db_instance" "postgres" {
  allocated_storage    = 100
  engine               = "postgres"
  engine_version       = "14.3"
  instance_class       = "db.r5.large"
  name                 = "equestrian_marketplace"
  username             = "admin"
  password             = var.db_password # stored in a secure location
  parameter_group_name = "default.postgres14"
  skip_final_snapshot  = false
  final_snapshot_identifier = "equestrian-marketplace-final"
  backup_retention_period = 7
  multi_az             = true
  storage_encrypted    = true
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.default.name
  
  tags = {
    Environment = "production"
    Project     = "equestrian-marketplace"
  }
}
```

### Kubernetes Manifests

1. **Namespace Configuration**

```yaml
# namespaces.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: equestrian-prod
  labels:
    name: equestrian-prod
    environment: production
---
apiVersion: v1
kind: Namespace
metadata:
  name: equestrian-staging
  labels:
    name: equestrian-staging
    environment: staging
---
apiVersion: v1
kind: Namespace
metadata:
  name: equestrian-dev
  labels:
    name: equestrian-dev
    environment: development
---
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
  labels:
    name: monitoring
---
apiVersion: v1
kind: Namespace
metadata:
  name: ci-cd
  labels:
    name: ci-cd
```

2. **Microservice Deployment**

```yaml
# user-service.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: equestrian-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: your-registry/user-service:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-credentials
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: key
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: equestrian-prod
spec:
  selector:
    app: user-service
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

3. **API Gateway Configuration**

```yaml
# api-gateway.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-gateway
  namespace: equestrian-prod
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - api.equestrian-marketplace.com
    secretName: equestrian-tls
  rules:
  - host: api.equestrian-marketplace.com
    http:
      paths:
      - path: /api/v1/users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 80
      - path: /api/v1/listings
        pathType: Prefix
        backend:
          service:
            name: listing-service
            port:
              number: 80
      - path: /api/v1/search
        pathType: Prefix
        backend:
          service:
            name: search-service
            port:
              number: 80
      - path: /api/v1/messages
        pathType: Prefix
        backend:
          service:
            name: messaging-service
            port:
              number: 80
      - path: /api/v1/transactions
        pathType: Prefix
        backend:
          service:
            name: transaction-service
            port:
              number: 80
```

### Monitoring Setup

```yaml
# prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |-
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    rule_files:
      - /etc/prometheus/rules/*.rules
    
    scrape_configs:
      - job_name: 'kubernetes-apiservers'
        kubernetes_sd_configs:
        - role: endpoints
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        relabel_configs:
        - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
          action: keep
          regex: default;kubernetes;https
      
      - job_name: 'kubernetes-nodes'
        kubernetes_sd_configs:
        - role: node
        relabel_configs:
        - action: labelmap
          regex: __meta_kubernetes_node_label_(.+)
      
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
        - role: pod
        relabel_configs:
        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
          action: keep
          regex: true
        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
          action: replace
          target_label: __metrics_path__
          regex: (.+)
        - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
          action: replace
          regex: ([^:]+)(?::\d+)?;(\d+)
          replacement: $1:$2
          target_label: __address__
```

## Securing Marketplace Transactions

### Payment Gateway Integration

1. **Stripe Integration for Payments**

```typescript
// src/services/payment-service.ts
import Stripe from 'stripe';
import { TransactionRepository } from '../repositories/transaction-repository';
import { ListingService } from './listing-service';
import { NotificationService } from './notification-service';
import { Transaction, TransactionStatus } from '../models/transaction';

export class PaymentService {
  private stripe: Stripe;

  constructor(
    private transactionRepository: TransactionRepository,
    private listingService: ListingService,
    private notificationService: NotificationService
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(params: {
    listingId: string;
    buyerId: string;
    amount: number;
    currency: string;
    paymentMethodId?: string;
  }): Promise<{ clientSecret: string; transactionId: string }> {
    // Check if listing exists and is available
    const listing = await this.listingService.getListingById(params.listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }
    
    if (listing.status !== 'active') {
      throw new Error('Listing is not available for purchase');
    }

    // Create a transaction record
    const transaction = await this.transactionRepository.create({
      buyerId: params.buyerId,
      sellerId: listing.sellerId,
      listingId: params.listingId,
      amount: params.amount,
      currency: params.currency,
      status: TransactionStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create a Payment Intent with Stripe
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Convert to cents
      currency: params.currency.toLowerCase(),
      payment_method: params.paymentMethodId,
      confirmation_method: 'manual',
      confirm: !!params.paymentMethodId,
      metadata: {
        transactionId: transaction.id,
        listingId: params.listingId,
        buyerId: params.buyerId,
        sellerId: listing.sellerId,
      },
    });

    // Update transaction with payment intent ID
    await this.transactionRepository.update(transaction.id, {
      paymentIntentId: paymentIntent.id,
      updatedAt: new Date(),
    });

    return {
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction.id,
    };
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const { transactionId, listingId, buyerId, sellerId } = paymentIntent.metadata;
    
    // Update transaction status
    await this.transactionRepository.update(transactionId, {
      status: TransactionStatus.COMPLETED,
      processedAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Update listing status
    await this.listingService.updateListingStatus(listingId, 'sold');
    
    // Notify buyer and seller
    await this.notificationService.notifyPaymentSuccess(buyerId, sellerId, listingId);
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const { transactionId, buyerId } = paymentIntent.metadata;
    
    // Update transaction status
    await this.transactionRepository.update(transactionId, {
      status: TransactionStatus.FAILED,
      failureReason: paymentIntent.last_payment_error?.message,
      updatedAt: new Date(),
    });
    
    // Notify buyer
    await this.notificationService.notifyPaymentFailure(buyerId, transactionId);
  }

  // Additional methods for refunds, disputes, etc.
}
```

### Escrow Service

For high-value horse transactions, an escrow service can provide additional security:

```typescript
// src/services/escrow-service.ts
import { EscrowRepository } from '../repositories/escrow-repository';
import { ListingService } from './listing-service';
import { NotificationService } from './notification-service';
import { PaymentService } from './payment-service';
import { Escrow, EscrowStatus } from '../models/escrow';

export class EscrowService {
  constructor(
    private escrowRepository: EscrowRepository,
    private listingService: ListingService,
    private paymentService: PaymentService,
    private notificationService: NotificationService
  ) {}

  async createEscrow(params: {
    listingId: string;
    buyerId: string;
    amount: number;
    currency: string;
    terms: string;
    inspectionPeriodDays: number;
  }): Promise<Escrow> {
    const listing = await this.listingService.getListingById(params.listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }
    
    if (listing.status !== 'active') {
      throw new Error('Listing is not available for escrow');
    }

    // Create escrow record
    const escrow = await this.escrowRepository.create({
      buyerId: params.buyerId,
      sellerId: listing.sellerId,
      listingId: params.listingId,
      amount: params.amount,
      currency: params.currency,
      terms: params.terms,
      status: EscrowStatus.CREATED,
      inspectionPeriodDays: params.inspectionPeriodDays,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days to fund
    });

    // Update listing status
    await this.listingService.updateListingStatus(params.listingId, 'pending_escrow');
    
    // Notify seller
    await this.notificationService.notifyEscrowCreated(listing.sellerId, escrow.id);
    
    return escrow;
  }

  async fundEscrow(escrowId: string, paymentMethodId: string): Promise<void> {
    const escrow = await this.escrowRepository.findById(escrowId);
    if (!escrow) {
      throw new Error('Escrow not found');
    }
    
    if (escrow.status !== EscrowStatus.CREATED) {
      throw new Error('Escrow is not in a fundable state');
    }

    // Process payment
    const { transactionId } = await this.paymentService.createPaymentIntent({
      listingId: escrow.listingId,
      buyerId: escrow.buyerId,
      amount: escrow.amount,
      currency: escrow.currency,
      paymentMethodId,
    });

    // Update escrow status
    await this.escrowRepository.update(escrowId, {
      status: EscrowStatus.FUNDED,
      transactionId,
      fundedAt: new Date(),
      updatedAt: new Date(),
      inspectionStartDate: new Date(),
      inspectionEndDate: new Date(Date.now() + escrow.inspectionPeriodDays * 24 * 60 * 60 * 1000),
    });

    // Update listing status
    await this.listingService.updateListingStatus(escrow.listingId, 'in_escrow');
    
    // Notify seller
    await this.notificationService.notifyEscrowFunded(escrow.sellerId, escrowId);
  }

  async approveEscrow(escrowId: string, buyerId: string): Promise<void> {
    const escrow = await this.escrowRepository.findById(escrowId);
    if (!escrow) {
      throw new Error('Escrow not found');
    }
    
    if (escrow.buyerId !== buyerId) {
      throw new Error('Unauthorized');
    }
    
    if (escrow.status !== EscrowStatus.FUNDED) {
      throw new Error('Escrow is not in a approvable state');
    }

    // Update escrow status
    await this.escrowRepository.update(escrowId, {
      status: EscrowStatus.APPROVED,
      approvedAt: new Date(),
      updatedAt: new Date(),
    });

    // Release funds to seller (typically through a separate process)
    
    // Update listing status
    await this.listingService.updateListingStatus(escrow.listingId, 'sold');
    
    // Notify seller
    await this.notificationService.notifyEscrowApproved(escrow.sellerId, escrowId);
  }

  // Additional methods for disputes, refunds, etc.
}
```

### Fraud Prevention

1. **Transaction Monitoring**

```typescript
// src/services/fraud-prevention-service.ts
import { Transaction } from '../models/transaction';
import { UserService } from './user-service';
import { ListingService } from './listing-service';
import { TransactionRepository } from '../repositories/transaction-repository';

export class FraudPreventionService {
  constructor(
    private userService: UserService,
    private listingService: ListingService,
    private transactionRepository: TransactionRepository
  ) {}

  async assessRisk(transaction: Transaction): Promise<{
    riskScore: number;
    riskFactors: string[];
    isHighRisk: boolean;
  }> {
    const riskFactors = [];
    let riskScore = 0;

    // Check buyer account age
    const buyer = await this.userService.getUserById(transaction.buyerId);
    const buyerAccountAgeInDays = (Date.now() - buyer.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    if (buyerAccountAgeInDays < 7) {
      riskFactors.push('New buyer account');
      riskScore += 25;
    }

    // Check listing price vs. market average
    const listing = await this.listingService.getListingById(transaction.listingId);
    const avgPriceForCategory = await this.listingService.getAveragePriceForCategory(
      listing.category,
      listing.attributes
    );
    
    if (listing.price < avgPriceForCategory * 0.5) {
      riskFactors.push('Listing price significantly below market average');
      riskScore += 20;
    }

    // Check for multiple failed payment attempts
    const recentFailedTransactions = await this.transactionRepository.countRecentFailedTransactions(
      transaction.buyerId,
      24 // hours
    );
    
    if (recentFailedTransactions > 2) {
      riskFactors.push('Multiple recent failed payment attempts');
      riskScore += 30;
    }

    // Check for suspicious location/IP address
    // This would integrate with an IP risk assessment service
    
    // Check for unusual transaction time
    const transactionHour = transaction.createdAt.getHours();
    if (transactionHour >= 1 && transactionHour <= 5) {
      riskFactors.push('Transaction attempted during unusual hours');
      riskScore += 10;
    }

    return {
      riskScore,
      riskFactors,
      isHighRisk: riskScore >= 50,
    };
  }

  async monitorForUnusualActivity(): Promise<void> {
    // Scheduled job to look for unusual patterns
    const unusualTransactions = await this.transactionRepository.findUnusualPatterns();
    
    for (const transaction of unusualTransactions) {
      // Flag for review, notify admin, etc.
    }
  }

  // Additional methods for specific fraud detection scenarios
}
```

2. **Identity Verification for High-Value Transactions**

```typescript
// src/services/identity-verification-service.ts
import { VerificationProvider } from '../integrations/verification-provider';
import { UserRepository } from '../repositories/user-repository';
import { NotificationService } from './notification-service';

export class IdentityVerificationService {
  constructor(
    private verificationProvider: VerificationProvider,
    private userRepository: UserRepository,
    private notificationService: NotificationService
  ) {}

  async initiateVerification(userId: string): Promise<{
    verificationId: string;
    redirectUrl: string;
  }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create verification session with third-party provider
    const verificationSession = await this.verificationProvider.createSession({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });

    // Update user record with verification ID
    await this.userRepository.update(userId, {
      verificationId: verificationSession.id,
      verificationStatus: 'pending',
      updatedAt: new Date(),
    });

    return {
      verificationId: verificationSession.id,
      redirectUrl: verificationSession.url,
    };
  }

  async handleVerificationWebhook(event: any): Promise<void> {
    const { verificationId, status, userId } = event;

    // Update user verification status
    await this.userRepository.update(userId, {
      verificationStatus: status,
      verificationCompletedAt: new Date(),
      updatedAt: new Date(),
    });

    // Notify user
    await this.notificationService.notifyVerificationStatus(userId, status);
  }

  async requireVerificationForTransaction(
    userId: string,
    transactionAmount: number
  ): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    
    // Require verification for high-value transactions
    const requiresVerification = 
      transactionAmount > 10000 && 
      user.verificationStatus !== 'verified';
    
    return requiresVerification;
  }
}
```

## SEO Optimization for Marketplace Listings

### Server-Side Rendering Strategy

Use Next.js for server-side rendering to ensure that listing pages are fully rendered for search engines:

```jsx
// pages/listings/[id].js
import { useRouter } from 'next/router';
import Head from 'next/head';
import ListingDetail from '../../components/listings/ListingDetail';
import { getListingById } from '../../services/api';

export default function ListingPage({ listing, error }) {
  const router = useRouter();

  // If the page is still generating via SSR
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // If there was an error fetching the listing
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Head>
        <title>{listing.title} | Equestrian Marketplace</title>
        <meta name="description" content={`${listing.title} - ${listing.description.substring(0, 160)}`} />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={`${listing.title} | Equestrian Marketplace`} />
        <meta property="og:description" content={listing.description.substring(0, 160)} />
        <meta property="og:image" content={listing.media[0]?.url