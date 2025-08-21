# Quick Database Setup Guide

## 🚀 Get Your Database Running in 5 Minutes

### Step 1: Create Free Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Click "Sign Up" (use GitHub or email)
3. Create new project:
   - **Project name**: `serene-spaces`
   - **Database name**: `serene_spaces`
   - **Region**: Choose closest to you
4. **Copy the connection string** (looks like: `postgresql://username:password@host/database?sslmode=require`)

### Step 2: Create Environment File

In your project root, create a file called `.env.local` with this content:

```bash
# Database - Replace with your actual Neon connection string
DATABASE_URL="your-neon-connection-string-here"

# App
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Gmail OAuth2 (for email functionality)
GOOGLE_CLIENT_ID="your_oauth2_client_id"
GOOGLE_CLIENT_SECRET="your_oauth2_client_secret"
GMAIL_USER="loveserenespaces@gmail.com"
```

**⚠️ IMPORTANT**: Replace `your-neon-connection-string-here` with the actual connection string from Neon!

### Step 3: Run Database Setup

Open your terminal in the project directory and run:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

### Step 4: Test Database Connection

Visit: `http://localhost:3000/api/db-test`

You should see:

```json
{
  "success": true,
  "message": "Database connection successful!",
  "database": {
    "connection": "✅ Connected",
    "tables": [...],
    "counts": {
      "customers": 0,
      "serviceRequests": 0,
      "invoices": 0
    }
  }
}
```

### Step 5: Test Admin Functionality

1. Go to `http://localhost:3000/admin`
2. Navigate to Customers, Service Requests, or Invoices
3. Everything should now show real data (even if empty initially)

## 🔧 What This Fixes

✅ **Customers API** - Now shows real customers from database  
✅ **Service Requests API** - Now shows real service requests from database  
✅ **Invoices API** - Now uses database instead of memory  
✅ **Admin Dashboard** - Shows real counts and data  
✅ **All Admin Pages** - Fully functional with database

## 🚨 Troubleshooting

**If you see "Database connection failed":**

- Check your `.env.local` file exists
- Verify the `DATABASE_URL` is correct
- Make sure you ran `npx prisma generate` and `npx prisma migrate dev`

**If you see "PrismaClient not found":**

- Run `npx prisma generate`

**If you see "Table doesn't exist":**

- Run `npx prisma migrate dev --name init`

## 🎯 Next Steps

Once your database is connected:

1. **Test creating a customer** in the admin panel
2. **Test creating an invoice**
3. **Test the service request form**
4. **Everything should work with real data!**

Your admin system will be fully functional! 🎉
