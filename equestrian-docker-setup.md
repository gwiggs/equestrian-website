# Equestrian Marketplace: Docker Development Environment

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Docker Configuration Files](#docker-configuration-files)
4. [Development Workflow](#development-workflow)
5. [Optimizations](#optimizations)
6. [VS Code Integration](#vs-code-integration)
7. [AWS Integration for Hybrid Approach](#aws-integration-for-hybrid-approach)
8. [Common Issues & Troubleshooting](#common-issues--troubleshooting)

## Introduction

This document outlines the Docker-based development environment for the Equestrian Marketplace project. Using Docker ensures a consistent development experience across both macOS and Windows operating systems, eliminating "works on my machine" issues.

The development environment uses Docker containers for all services, including:
- Node.js API backend
- Next.js frontend
- PostgreSQL database
- Redis cache
- Elasticsearch for search functionality
- Development utilities

## Prerequisites

### All Platforms
- Docker Desktop (latest version)
- Git
- VS Code (recommended with Docker and Remote Containers extensions)

### Windows-Specific
- WSL2 enabled (for better Docker performance)
- Git configured with LF line endings: `git config --global core.autocrlf input`

### macOS-Specific
- No special requirements

## Docker Configuration Files

### Docker Compose Configuration

Save this as `docker-compose.yml` in your project root:

```yaml
version: "3.8"

services:
  api:
    build: 
      context: ./backend
      # Use development-specific Dockerfile
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      # Mount source code for hot reloading
      - ./backend:/app
      # Use named volume for node_modules to avoid overwriting
      - backend_node_modules:/app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://postgres:postgres@postgres:5432/equestrian
      # Enable TypeScript watching
      - TS_NODE_DEV=true
    # Restart on crash
    restart: unless-stopped
    # Add healthcheck
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      - postgres
      - redis
  
  # Frontend Next.js application  
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "8080:8080"
    volumes:
      - ./frontend:/app
      - frontend_node_modules:/app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3000
    # Enable for frontend hot reloading
    stdin_open: true
    tty: true
    depends_on:
      - api
    
  # Database with persistence
  postgres:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      # Add initialization scripts
      - ./database/init:/docker-entrypoint-initdb.d
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_DB=equestrian
    # Improve performance for development
    command: 
      - "postgres"
      - "-c"
      - "max_connections=100"
      - "-c"
      - "shared_buffers=128MB"
  
  # Redis for caching and session management
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Search engine
  elasticsearch:
    image: elasticsearch:8.7.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
  
  # Development utilities
  adminer:
    image: adminer
    ports:
      - "8081:8080"
    environment:
      - ADMINER_DEFAULT_SERVER=postgres
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:
  backend_node_modules:
  frontend_node_modules:
```

### Backend Dockerfile for Development

Save this as `backend/Dockerfile.dev`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies first (leverages Docker cache)
COPY package*.json ./
RUN npm install

# Development-specific tools
RUN npm install -g nodemon ts-node

# No need to copy source code - will be mounted

EXPOSE 3000

# Use nodemon for hot reloading
CMD ["nodemon", "--exec", "ts-node", "src/index.ts"]
```

### Frontend Dockerfile for Development

Save this as `frontend/Dockerfile.dev`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# No need to copy source code - will be mounted

EXPOSE 8080

# Development command with hot reloading
CMD ["npm", "run", "dev"]
```

### Production Dockerfiles (Reference)

Backend production Dockerfile (`backend/Dockerfile`):

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --production

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

Frontend production Dockerfile (`frontend/Dockerfile`):

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

CMD ["npm", "start"]
```

## Development Workflow

### Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-org/equestrian-marketplace.git
cd equestrian-marketplace
```

2. **Start the development environment**

```bash
docker-compose up -d
```

3. **Initialize the database (first time only)**

```bash
# Create database schema
docker-compose exec api npm run migrate

# Seed with initial data
docker-compose exec api npm run seed
```

4. **Access the applications**

- API: http://localhost:3000
- Frontend: http://localhost:8080
- API Documentation: http://localhost:3000/api-docs
- Database Admin (Adminer): http://localhost:8081 (Server: postgres, User: postgres, Password: postgres)
- Elasticsearch: http://localhost:9200

### Daily Development Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services in the background |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f [service]` | View logs (e.g., `docker-compose logs -f api`) |
| `docker-compose restart [service]` | Restart a specific service |
| `docker-compose exec [service] [command]` | Run a command in a service (e.g., `docker-compose exec api npm test`) |
| `docker-compose build [service]` | Rebuild a service (after dependency changes) |

### Development Scripts

Add these helpful scripts to your `package.json` in the project root:

```json
{
  "scripts": {
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:rebuild": "docker-compose up -d --build",
    "docker:logs": "docker-compose logs -f",
    "docker:clean": "docker-compose down -v",
    "db:seed": "docker-compose exec api npm run seed",
    "db:migrate": "docker-compose exec api npm run migrate",
    "test:docker": "docker-compose exec api npm test"
  }
}
```

## Optimizations

### Performance Optimizations

1. **Volume Mounting Strategy**

To prevent slow filesystem performance, especially on Windows:

- Use named volumes for `node_modules` (as shown in the docker-compose file)
- Consider using Docker's cached volume mounts on macOS:
  ```yaml
  volumes:
    - ./backend:/app:cached
  ```

2. **Multi-stage Builds**

The production Dockerfiles use multi-stage builds to keep final images small:
- First stage builds the application
- Second stage only includes what's needed to run it

3. **Resource Allocation**

Adjust Docker Desktop resource settings:
- Windows/Mac: Docker Desktop > Settings > Resources
- Recommended minimums: 4 CPUs, 8GB RAM, 2GB Swap

### Development Experience Optimizations

1. **Hot Reloading**

Both frontend and backend configurations support hot reloading:
- Frontend: Next.js built-in hot module replacement
- Backend: Nodemon watches for changes and restarts automatically

2. **Container Health Checks**

Health checks (included in docker-compose) help identify when services are ready.

3. **Dependency Management**

Package installation happens in Dockerfiles rather than volume mounts to:
- Ensure consistent dependencies
- Prevent "works in container but not locally" issues
- Cache dependencies for faster rebuilds

## VS Code Integration

### Remote Containers Setup

Create `.devcontainer/devcontainer.json` in your project root:

```json
{
  "name": "Equestrian Marketplace Development",
  "dockerComposeFile": "../docker-compose.yml",
  "service": "api",
  "workspaceFolder": "/app",
  "extensions": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-azuretools.vscode-docker",
    "ms-vscode.vscode-typescript-next",
    "graphql.vscode-graphql",
    "mongodb.mongodb-vscode",
    "cweijan.vscode-postgresql-client2"
  ],
  "settings": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "typescript.tsdk": "node_modules/typescript/lib"
  },
  "remoteUser": "node"
}
```

### Recommended Extensions

Additional VS Code extensions to enhance development:

1. **Docker Extension**: View and manage containers directly in VS Code
2. **Remote - Containers**: Edit code inside containers
3. **Database Clients**: Manage PostgreSQL and other database connections
4. **GitLens**: Enhanced Git capabilities
5. **Thunder Client**: REST API client alternative to Postman

### VS Code Tasks

Create `.vscode/tasks.json` for common commands:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Development Environment",
      "type": "shell",
      "command": "docker-compose up -d",
      "problemMatcher": []
    },
    {
      "label": "Stop Development Environment",
      "type": "shell",
      "command": "docker-compose down",
      "problemMatcher": []
    },
    {
      "label": "Rebuild Services",
      "type": "shell",
      "command": "docker-compose up -d --build",
      "problemMatcher": []
    },
    {
      "label": "Backend: Run Tests",
      "type": "shell",
      "command": "docker-compose exec api npm test",
      "problemMatcher": []
    },
    {
      "label": "Database: Run Migrations",
      "type": "shell",
      "command": "docker-compose exec api npm run migrate",
      "problemMatcher": []
    }
  ]
}
```

## AWS Integration for Hybrid Approach

For a hybrid approach (local development + AWS integration environments):

### GitHub Actions Workflow

Create `.github/workflows/integration-environment.yml`:

```yaml
name: Deploy Integration Environment

on:
  pull_request:
    types: [opened, synchronize]
    branches:
      - develop
      - main

jobs:
  deploy-integration:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push containers
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
        run: |
          # Build and push backend
          docker build -t $ECR_REGISTRY/equestrian-backend:pr-$PR_NUMBER ./backend
          docker push $ECR_REGISTRY/equestrian-backend:pr-$PR_NUMBER
          
          # Build and push frontend
          docker build -t $ECR_REGISTRY/equestrian-frontend:pr-$PR_NUMBER ./frontend
          docker push $ECR_REGISTRY/equestrian-frontend:pr-$PR_NUMBER
      
      - name: Deploy to ECS
        env:
          PR_NUMBER: ${{ github.event.pull_request.number }}
        run: |
          aws cloudformation deploy \
            --template-file infrastructure/integration-env.yml \
            --stack-name equestrian-pr-$PR_NUMBER \
            --parameter-overrides \
              PrNumber=$PR_NUMBER \
              BackendImage=$ECR_REGISTRY/equestrian-backend:pr-$PR_NUMBER \
              FrontendImage=$ECR_REGISTRY/equestrian-frontend:pr-$PR_NUMBER
      
      - name: Comment on PR with environment URL
        uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const prNumber = context.payload.pull_request.number;
            const envUrl = `https://pr-${prNumber}.integration.equestrian-marketplace.com`;
            github.rest.issues.createComment({
              issue_number: prNumber,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Integration environment deployed: [${envUrl}](${envUrl})`
            });
```

### AWS CloudFormation Template

Create `infrastructure/integration-env.yml`:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Parameters:
  PrNumber:
    Type: String
    Description: Pull Request number
  BackendImage:
    Type: String
    Description: Backend Docker image URI
  FrontendImage:
    Type: String
    Description: Frontend Docker image URI

Resources:
  # VPC and networking resources
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: !Sub equestrian-pr-${PrNumber}-vpc

  # Public subnets
  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub equestrian-pr-${PrNumber}-public-1

  PublicSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.2.0/24
      AvailabilityZone: !Select [1, !GetAZs '']
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub equestrian-pr-${PrNumber}-public-2

  # Internet gateway
  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: !Sub equestrian-pr-${PrNumber}-igw

  GatewayAttachment:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  # Route table
  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub equestrian-pr-${PrNumber}-public-routes

  PublicRoute:
    Type: AWS::EC2::Route
    DependsOn: GatewayAttachment
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  PublicSubnet1RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet1
      RouteTableId: !Ref PublicRouteTable

  PublicSubnet2RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet2
      RouteTableId: !Ref PublicRouteTable

  # ECS Cluster
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: !Sub equestrian-pr-${PrNumber}

  # Load Balancer
  LoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Name: !Sub equestrian-pr-${PrNumber}
      Subnets:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2
      SecurityGroups:
        - !Ref LoadBalancerSecurityGroup
      Scheme: internet-facing
      Type: application

  LoadBalancerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow HTTP/HTTPS
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0

  # HTTP Listener
  HTTPListener:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      LoadBalancerArn: !Ref LoadBalancer
      Port: 80
      Protocol: HTTP
      DefaultActions:
        - Type: forward
          TargetGroupArn: !Ref FrontendTargetGroup

  # Target Groups
  FrontendTargetGroup:
    Type: AWS::ElasticLoadBalancingV2::TargetGroup
    Properties:
      Name: !Sub equestrian-pr-${PrNumber}-frontend
      Port: 8080
      Protocol: HTTP
      TargetType: ip
      VpcId: !Ref VPC
      HealthCheckPath: /
      HealthCheckIntervalSeconds: 30
      HealthCheckTimeoutSeconds: 5
      HealthyThresholdCount: 2
      UnhealthyThresholdCount: 5

  APITargetGroup:
    Type: AWS::ElasticLoadBalancingV2::TargetGroup
    Properties:
      Name: !Sub equestrian-pr-${PrNumber}-api
      Port: 3000
      Protocol: HTTP
      TargetType: ip
      VpcId: !Ref VPC
      HealthCheckPath: /health
      HealthCheckIntervalSeconds: 30
      HealthCheckTimeoutSeconds: 5
      HealthyThresholdCount: 2
      UnhealthyThresholdCount: 5

  # API Path Listener Rule
  APIListenerRule:
    Type: AWS::ElasticLoadBalancingV2::ListenerRule
    Properties:
      ListenerArn: !Ref HTTPListener
      Priority: 10
      Conditions:
        - Field: path-pattern
          Values:
            - /api/*
      Actions:
        - Type: forward
          TargetGroupArn: !Ref APITargetGroup

  # Task Execution Role
  TaskExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: ecs-tasks.amazonaws.com
            Action: 'sts:AssumeRole'
      ManagedPolicyArns:
        - 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy'

  # RDS Database
  DatabaseSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: RDS Security Group
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 5432
          ToPort: 5432
          SourceSecurityGroupId: !Ref ContainerSecurityGroup

  ContainerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for containers
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 3000
          ToPort: 3000
          SourceSecurityGroupId: !Ref LoadBalancerSecurityGroup
        - IpProtocol: tcp
          FromPort: 8080
          ToPort: 8080
          SourceSecurityGroupId: !Ref LoadBalancerSecurityGroup

  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      Engine: postgres
      DBInstanceClass: db.t3.micro
      AllocatedStorage: 20
      StorageType: gp2
      MasterUsername: postgres
      MasterUserPassword: !Sub '{{resolve:secretsmanager:equestrian-db-password:SecretString:password}}'
      DBName: !Sub equestrian_pr_${PrNumber}
      VPCSecurityGroups:
        - !GetAtt DatabaseSecurityGroup.GroupId
      DBSubnetGroupName: !Ref DBSubnetGroup
      PubliclyAccessible: false
      BackupRetentionPeriod: 1

  DBSubnetGroup:
    Type: AWS::RDS::DBSubnetGroup
    Properties:
      DBSubnetGroupDescription: Subnets for PR database
      SubnetIds:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2

  # ECS Services and Tasks
  BackendTaskDefinition:
    Type: AWS::ECS::TaskDefinition
    Properties:
      Family: !Sub equestrian-pr-${PrNumber}-backend
      NetworkMode: awsvpc
      RequiresCompatibilities:
        - FARGATE
      Cpu: '256'
      Memory: '512'
      ExecutionRoleArn: !Ref TaskExecutionRole
      TaskRoleArn: !Ref TaskExecutionRole
      ContainerDefinitions:
        - Name: backend
          Image: !Ref BackendImage
          Essential: true
          PortMappings:
            - ContainerPort: 3000
          Environment:
            - Name: NODE_ENV
              Value: development
            - Name: DATABASE_URL
              Value: !Sub 'postgres://postgres:{{resolve:secretsmanager:equestrian-db-password:SecretString:password}}@${Database.Endpoint.Address}:5432/equestrian_pr_${PrNumber}'
          LogConfiguration:
            LogDriver: awslogs
            Options:
              awslogs-group: !Ref LogGroup
              awslogs-region: !Ref 'AWS::Region'
              awslogs-stream-prefix: backend

  FrontendTaskDefinition:
    Type: AWS::ECS::TaskDefinition
    Properties:
      Family: !Sub equestrian-pr-${PrNumber}-frontend
      NetworkMode: awsvpc
      RequiresCompatibilities:
        - FARGATE
      Cpu: '256'
      Memory: '512'
      ExecutionRoleArn: !Ref TaskExecutionRole
      TaskRoleArn: !Ref TaskExecutionRole
      ContainerDefinitions:
        - Name: frontend
          Image: !Ref FrontendImage
          Essential: true
          PortMappings:
            - ContainerPort: 8080
          Environment:
            - Name: NEXT_PUBLIC_API_URL
              Value: !Sub 'http://pr-${PrNumber}.integration.equestrian-marketplace.com/api'
          LogConfiguration:
            LogDriver: awslogs
            Options:
              awslogs-group: !Ref LogGroup
              awslogs-region: !Ref 'AWS::Region'
              awslogs-stream-prefix: frontend

  BackendService:
    Type: AWS::ECS::Service
    DependsOn: APIListenerRule
    Properties:
      ServiceName: !Sub equestrian-pr-${PrNumber}-backend
      Cluster: !Ref ECSCluster
      TaskDefinition: !Ref BackendTaskDefinition
      LaunchType: FARGATE
      DesiredCount: 1
      NetworkConfiguration:
        AwsvpcConfiguration:
          AssignPublicIp: ENABLED
          SecurityGroups:
            - !Ref ContainerSecurityGroup
          Subnets:
            - !Ref PublicSubnet1
            - !Ref PublicSubnet2
      LoadBalancers:
        - ContainerName: backend
          ContainerPort: 3000
          TargetGroupArn: !Ref APITargetGroup

  FrontendService:
    Type: AWS::ECS::Service
    DependsOn: HTTPListener
    Properties:
      ServiceName: !Sub equestrian-pr-${PrNumber}-frontend
      Cluster: !Ref ECSCluster
      TaskDefinition: !Ref FrontendTaskDefinition
      LaunchType: FARGATE
      DesiredCount: 1
      NetworkConfiguration:
        AwsvpcConfiguration:
          AssignPublicIp: ENABLED
          SecurityGroups:
            - !Ref ContainerSecurityGroup
          Subnets:
            - !Ref PublicSubnet1
            - !Ref PublicSubnet2
      LoadBalancers:
        - ContainerName: frontend
          ContainerPort: 8080
          TargetGroupArn: !Ref FrontendTargetGroup

  LogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub /ecs/equestrian-pr-${PrNumber}
      RetentionInDays: 7

Outputs:
  LoadBalancerDNS:
    Description: DNS of load balancer
    Value: !GetAtt LoadBalancer.DNSName
```

## Common Issues & Troubleshooting

### Windows-Specific Issues

1. **Line Ending Problems**
   
   **Symptom**: Scripts fail with `#!/bin/sh^M: bad interpreter` errors
   
   **Solution**: Configure Git to use LF line endings
   ```bash
   git config --global core.autocrlf input
   ```

2. **Path Length Limitations**
   
   **Symptom**: Docker fails with "filename too long" errors
   
   **Solution**: 
   - Enable long paths in Windows
   - Use shorter project/directory names
   - Move project closer to root of drive

3. **Performance Issues**
   
   **Symptom**: Very slow file access in containers
   
   **Solution**:
   - Ensure using WSL2 backend (not legacy Hyper-V)
   - Store project files in WSL2 filesystem, not Windows filesystem
   - Adjust Docker Desktop resources (CPU, Memory)

### macOS-Specific Issues

1. **Performance Issues**
   
   **Symptom**: Slow file system access
   
   **Solution**:
   - Use `:cached` volume mounts
   - Exclude node_modules from volume mounts
   - Increase Docker Desktop resources

2. **Permission Issues**
   
   **Symptom**: Permission denied errors
   
   **Solution**:
   - Check file ownership in volume mounts
   - Consider running container as non-root user with same UID/GID

### General Docker Issues

1. **Cached Layers**
   
   **Symptom**: Changes to Dockerfile not reflected in builds
   
   **Solution**: 
   ```bash
   docker-compose build --no-cache [service]
   ```

2. **Container Startup Order**
   
   **Symptom**: Services fail because dependencies aren't ready
   
   **Solution**:
   - Use `depends_on` (as shown in docker-compose)
   - Implement proper health checks
   - Add retry logic in application startup

3. **Volume Mounting Issues**
   
   **Symptom**: Changes not reflected or files missing
   
   **Solution**: 
   - Verify volume paths are correct
   - Check Docker Desktop file sharing settings
   - Use absolute paths if relative paths aren't working

4. **Node Modules Conflicts**
   
   **Symptom**: Module not found errors after package changes
   
   **Solution**:
   - Use named volumes for node_modules (as shown)
   - Rebuild container after package.json changes:
     ```bash
     docker-compose up -d --build [service]
     ```

5. **Database Connection Issues**
   
   **Symptom**: API can't connect to database
   
   **Solution**:
   - Ensure using correct host (service name in docker-compose network)
   - Verify credentials match
   - Check ports are correctly exposed
   - Wait for database to be ready before connecting
