# Equestrian Marketplace Authentication Implementation

This document provides instructions on how to implement and run the authentication feature for the Equestrian Marketplace application.

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Technical Stack](#technical-stack)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Testing the Authentication Flow](#testing-the-authentication-flow)
8. [Next Steps](#next-steps)

## Overview

The authentication system provides a complete user registration and login flow, including email verification, password recovery, and profile management. This forms the foundation of the Equestrian Marketplace platform and is the first feature to implement.

## Features

- **User Registration**: Create buyer or seller accounts
- **Email Verification**: Verify user emails to ensure authenticity
- **User Login**: Authenticate users with JWT tokens
- **Password Recovery**: Reset forgotten passwords via email
- **Profile Management**: View and update user profiles
- **Password Change**: Change password while logged in
- **Role-based Authorization**: Different permissions for buyers and sellers
- **Protected Routes**: Secure areas that require authentication

## Technical Stack

### Backend
- Node.js with Express
- PostgreSQL database
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email sending

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Axios for API requests
- Tailwind CSS for styling

## Backend Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set Up Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Update the values in the `.env` file to match your environment.

3. **Run Database Migrations**:
   ```bash
   npm run migrate
   ```

4. **Set Up Email Service**:
   For development, create a free [Mailtrap](https://mailtrap.io/) account and update the credentials in your `.env` file.

## Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Set Up Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Update `REACT_APP_API_URL` to point to your backend server.

## Running the Application

### Using Docker Compose (Recommended)

1. **Start the Services**:
   ```bash
   docker-compose up -d
   ```

2. **Run Migrations in Docker**:
   ```bash
   docker-compose exec api npm run migrate
   ```

3. Access the application at:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001

### Running Locally (Alternative)

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## Testing the Authentication Flow

### Registration and Email Verification
1. Navigate to the registration page at `/register`
2. Fill out the form with valid details
3. Submit the form
4. Check Mailtrap for the verification email
5. Click the verification link to verify your email
6. Log in with your new account

### Password Recovery
1. Navigate to the login page at `/login`
2. Click on "Forgot password?"
3. Enter your email address
4. Check Mailtrap for the password reset email
5. Click the reset link
6. Set a new password
7. Log in with your new password

### Profile Management
1. Log in to your account
2. Navigate to the profile page at `/profile`
3. Edit your profile information
4. Save the changes
5. Verify that the changes have been applied

## Next Steps

After implementing the authentication feature, you can proceed to implement:

1. **Listing Management**: Allow sellers to create and manage their listings
2. **Search Functionality**: Enable users to search for horses, equipment, or services
3. **Messaging System**: Implement private messaging between buyers and sellers
4. **Payment Integration**: Add payment processing capabilities
5. **Review and Rating System**: Allow users to leave feedback after transactions

By starting with the authentication feature, you've established a solid foundation for all other features in the Equestrian Marketplace application.

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Ensure PostgreSQL is running
   - Check the DATABASE_URL in your .env file
   - Make sure the database exists and is accessible

2. **Email Sending Errors**:
   - Verify your Mailtrap credentials
   - Check the email service configuration in your .env file

3. **JWT Authentication Issues**:
   - Ensure the JWT_SECRET is set in your .env file
   - Check that tokens are being stored correctly in localStorage
   - Verify that the Authorization header is being set correctly

4. **CORS Errors**:
   - Make sure the backend CORS configuration allows your frontend origin
   - Check that API requests include the correct headers