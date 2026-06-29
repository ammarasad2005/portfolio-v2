# Next.js + MongoDB Authentication System

A complete, secure, and production-ready authentication system built with:

- **Next.js 14** (App Router)
- **MongoDB** + **Mongoose**
- **bcrypt** for password hashing
- **Server Actions** for form handling
- **HTTP-only Cookies** for session management
- **Tailwind CSS** for beautiful UI

##  Features

-  User Signup with email + password
-  Secure Login with password verification
-  Protected Dashboard route
-  Logout functionality (cookie cleared)
-  Password hashing (bcrypt, 12 rounds)
-  Duplicate email prevention
-  Beautiful modern UI with loading states
-  Error handling & success feedback
-  Unique branded footer with copyright

## Getting Started

### 1. Clone or Download

```bash
git clone <your-repo>
cd nextjs-mongodb-auth
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Copy the example file and add your MongoDB connection string:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your MongoDB URI:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/authdb
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
app/
├── actions/
│   └── auth.ts          # Server actions: signup, login, logout, getCurrentUser
├── dashboard/
│   └── page.tsx         # Protected dashboard (checks cookie)
├── lib/
│   └── db.ts            # MongoDB connection with caching
├── login/
│   └── page.tsx         # Login form with loading & error states
├── models/
│   └── User.ts          # Mongoose User schema
├── signup/
│   └── page.tsx         # Signup form
├── layout.tsx           # Root layout with navigation + footer
├── page.tsx             # Landing page
└── globals.css          # Tailwind + custom styles
```

##  Security Highlights

- Passwords are **never stored in plaintext**
- Uses **bcrypt** with 12 salt rounds
- Sessions stored in **HTTP-only, Secure cookies** (no client access)
- All sensitive operations run on the **server**
- Protected routes redirect unauthenticated users

##  Notes

- Make sure MongoDB is running and accessible
- The app uses a single User collection
- For production, consider adding:
  - Rate limiting
  - Email verification
  - Password reset flow
  - JWT alternative (optional)

---

**Built by Ammar** • All rights reserved © 2026
