# 🎟️ Round-Robin Coupon Distribution System 🎟️

## 🌐 Live Demo

- ✨ **Admin Dashboard**: [https://assignment-mocha-eight.vercel.app/](https://assignment-mocha-eight.vercel.app/)
- 🎁 **User Interface**: [https://assignment-user-omega.vercel.app/](https://assignment-user-omega.vercel.app/)

## 📋 Project Overview

This project is a comprehensive coupon distribution system that implements a round-robin distribution mechanism to ensure fair access to coupons for users. The system consists of three main components:

1. **🖥️ Backend API Service**: Built with Node.js, Express, and MongoDB
2. **⚙️ Admin Dashboard**: Next.js application for administrators to manage coupons
3. **👤 User Frontend**: Next.js application for users to claim coupons

## ✨ Key Features

### 🔄 Core Functionality

- **🔁 Round-Robin Distribution**: Coupons are distributed sequentially to users without repetition
- **🚪 Guest Access**: Users can claim coupons without creating an account
- **🛡️ Abuse Prevention**: IP tracking and cookie-based session tracking prevent multiple claims
- **🔐 Administrative Control**: Full management of coupons through a dedicated admin interface

### 📊 Admin Dashboard

The admin dashboard provides a complete management interface for administrators:

- **🔑 Authentication**: Secure login and registration system for administrators
- **📈 Dashboard Overview**: Summary statistics and recent activity
- **🎫 Coupon Management**: 
  - View all coupons with filtering and sorting
  - Create individual coupons or bulk upload multiple codes
  - Toggle coupon availability on/off
  - Delete unused coupons
- **📝 Claim Tracking**: View claim history with user IP and browser information

### 💻 User Interface

The user interface is straightforward and focused on ease of use:

- **🎁 Available Coupons**: Users can view available coupons they're eligible to claim
- **🖱️ One-Click Claiming**: Simple process to claim a coupon
- **⏱️ Cooldown Enforcement**: Visual feedback when users are within the cooldown period
- **📱 Responsive Design**: Works across desktop and mobile devices

## 🏗️ Technical Architecture

### 🔙 Backend API

The backend implements RESTful endpoints with JWT authentication for admin functions:

**👑 Admin Endpoints**:
- Authentication routes for login/registration
- CRUD operations for coupon management
- Claim history and dashboard statistics

**👥 User Endpoints**:
- View available coupons
- Claim specific coupon by ID
- Claim next available coupon (round-robin)
- Check eligibility status

### 🔒 Security Measures

- **🔐 JWT Authentication**: Secure admin access with tokens
- **✅ Data Validation**: Input validation on all endpoints
- **🛡️ Cross-Origin Protection**: Configured CORS for frontend domains

### 🚀 Deployment

The system is deployed across multiple platforms:
- 🌐 Backend: Render.com
- 🖥️ Admin Frontend: Vercel
- 📱 User Frontend: Vercel

## 💻 Technology Stack

- **⚙️ Backend**: Node.js, Express, MongoDB, JWT
- **🎨 Admin Frontend**: Next.js, TypeScript, Tailwind CSS
- **🎨 User Frontend**: Next.js, TypeScript, Tailwind CSS

## 🔄 Round-Robin Implementation

The system implements round-robin distribution by:

1. 📋 Storing coupons in sequential order within the database
2. 🎯 When a user requests a coupon, they receive the oldest available coupon
3. ✅ Once claimed, the coupon is marked as used and cannot be claimed again
4. 🔍 IP and session tracking ensure a single user cannot claim multiple coupons within the cooldown period

This approach ensures fair distribution while preventing abuse of the system.

---

✨ The Round-Robin Coupon Distribution System provides a complete solution for businesses looking to distribute promotional codes to users in an equitable and controlled manner, with powerful administration tools and a straightforward user experience. ✨
