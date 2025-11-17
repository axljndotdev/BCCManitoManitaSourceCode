# 🚀 Deployment Guide - Secret Santa App

This guide will help you deploy your Secret Santa app **completely FREE** using Render (backend) and Neon (database).

---

## 📋 Prerequisites

1. A GitHub account
2. A Render account (free) - https://render.com
3. A Neon account (free) - https://neon.tech

---

## Step 1: Set Up Free PostgreSQL Database (Neon)

### 1.1 Create Neon Account
1. Go to https://neon.tech
2. Sign up with GitHub (free, no credit card required)
3. Click "Create Project"

### 1.2 Get Database Connection String
1. After creating your project, go to **Dashboard**
2. Click on your project
3. Go to **Connection Details**
4. Copy the **Connection String** (looks like this):
   ```
   postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. **Save this for later** - you'll need it in Step 2

### 1.3 Initialize Database Schema (Do this in Step 3 after deployment)
**Note:** You'll set up the database tables in **Step 3** after deploying to Render. Skip this for now and come back after Step 2.

---

## Step 2: Deploy to Render (Free Hosting)

### 2.1 Push Code to GitHub
1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

### 2.2 Connect Render to GitHub
1. Go to https://render.com and sign up (free)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Select your Secret Santa repository

### 2.3 Configure Render
Render will auto-detect your `render.yaml` file. Verify these settings:

- **Name:** `secret-santa-app` (or your preferred name)
- **Environment:** `Node`
- **Build Command:** `npm install --include=dev && npm run build`
- **Start Command:** `npm start`
- **Plan:** `Free`

### 2.4 Add Environment Variables
In Render dashboard, go to **Environment** tab and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Your Neon connection string from Step 1.2 |

### 2.5 Deploy!
1. Click **Create Web Service**
2. Render will build and deploy your app (takes 2-5 minutes)
3. Once complete, you'll get a URL like: `https://secret-santa-app.onrender.com`

---

## Step 3: Initialize Your Database

After deployment, you need to create the database tables. Choose one option:

### Option A: Using Local Development (Recommended - Easiest)
1. First, enable the UUID extension in Neon:
   - Go to Neon dashboard → **SQL Editor**
   - **Make sure you're connected to the same database** from Step 1.2 (check the database name at the top)
   - Run this command:
     ```sql
     CREATE EXTENSION IF NOT EXISTS "pgcrypto";
     ```
   - You should see: `CREATE EXTENSION`

2. On your local computer, create a `.env` file in your project root:
   ```bash
   DATABASE_URL="your-neon-connection-string-from-step-1.2"
   ```
   **Important:** Don't commit this file - it's just for running migrations locally.

3. Run the migration command to create tables:
   ```bash
   npm run db:push
   ```
4. You should see: `✅ Tables created successfully`
5. You can now delete the `.env` file (the environment variable is already set on Render)

### Option B: Using Neon SQL Editor (Manual)
1. Go to Neon dashboard → **SQL Editor**
2. First, enable the UUID extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   ```
3. Then create the tables:
   ```sql
   CREATE TABLE participants (
     id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
     pin VARCHAR(10) NOT NULL UNIQUE,
     full_name TEXT NOT NULL,
     codename TEXT NOT NULL,
     gender VARCHAR(20) NOT NULL,
     wishlist TEXT NOT NULL,
     approved BOOLEAN NOT NULL DEFAULT false,
     has_drawn BOOLEAN NOT NULL DEFAULT false,
     assigned_to_pin VARCHAR(10)
   );

   CREATE TABLE admin_settings (
     id VARCHAR PRIMARY KEY DEFAULT 'singleton',
     draw_enabled BOOLEAN NOT NULL DEFAULT false,
     admin_pin VARCHAR(20) NOT NULL DEFAULT 'ADMIN-2025'
   );

   INSERT INTO admin_settings (id, draw_enabled, admin_pin) 
   VALUES ('singleton', false, 'ADMIN-2025');
   ```

---

## 🎉 You're Live!

Your app is now deployed! Visit your Render URL to see it in action.

### Important Notes:

**Free Tier Limitations:**
- Render free tier **spins down after 15 minutes** of inactivity
- First request after sleep takes ~30-50 seconds (cold start)
- Neon free tier: 0.5 GB storage (plenty for this app)

**Keeping Your App Active:**
- Use a service like [UptimeRobot](https://uptimerobot.com/) (free) to ping your app every 5 minutes
- This prevents it from sleeping

**Costs:**
- Neon: **$0/month** (free tier is permanent)
- Render: **$0/month** (free tier is permanent)
- **Total: $0/month** ✅

---

## 🔧 Updating Your App

Whenever you make changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

2. Render automatically detects changes and redeploys!

---

## 🆘 Troubleshooting

### App won't start
- Check Render logs in dashboard → **Logs** tab
- Verify DATABASE_URL is set correctly
- Make sure database tables are created

### Database connection errors
- Verify your Neon connection string includes `?sslmode=require`
- Check Neon dashboard to ensure database is active

### Build failures
- Check that all dependencies are in `package.json`
- Verify Node.js version matches (20.x)

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Neon Documentation](https://neon.tech/docs/introduction)
- [Drizzle ORM Docs](https://orm.drizzle.team/)

---

## 🌟 Bonus: Custom Domain (Optional)

Render allows custom domains on the free tier!

1. Go to Render dashboard → **Settings**
2. Click **Add Custom Domain**
3. Follow instructions to update your DNS records
4. Free SSL certificate included automatically

---

**Need help?** Check the Render or Neon community forums, or review the logs in your Render dashboard.
