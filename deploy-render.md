# 🚀 Render Deployment Guide | DevTrackr

Since you have already verified the Docker build locally, deploying to **Render** is the fastest and most reliable path to a live public URL. This demonstrates your ability to use **Industry-Standard Containerisation** to outshine in technical interviews.

---

## 🏗️ Prerequisites
1. **GitHub Account**: Your code must be pushed to a GitHub repository.
2. **MongoDB Atlas**: Ensure your database cluster is live and allows access from **Anywhere** (`0.0.0.0/0`) in the Network Access settings.

---

## 📦 Step 1: Create a Render Web Service

1. Login to **[Render.com](https://dashboard.render.com/)**.
2. Click **New +** → **Web Service**.
3. Connect your **GitHub Repository**.

---

## 🛠️ Step 2: Configure Settings

In the Render creation screen, use these exact settings:

- **Name**: `devtrackr`
- **Region**: Select the one closest to you (e.g., Singapore or Oregon).
- **Runtime**: Select **Docker**. (Render will automatically find your `Dockerfile`).
- **Plan**: **Free** (or Starter for more power).

---

## 🔑 Step 3: Add Environment Variables

Click the **Advanced** button and add these variables:

| Key | Value |
|:---|:---|
| `NODE_ENV` | `production` |
| `PORT` | `8080` ← **Must match the Dockerfile `EXPOSE 8080`** |
| `MONGODB_URI` | *Your Atlas Connection String* |
| `JWT_SECRET` | *Any strong random string* |
| `JWT_REFRESH_SECRET` | *Any strong random string (different from above)* |
| `CLIENT_URL` | `https://YOUR-APP-NAME.onrender.com` ← **Set your actual Render URL here** |

> ⚠️ **`PORT` MUST be `8080`** — that's what the Dockerfile exposes. If you set it to `5001`, Render won't route traffic correctly.

> ⚠️ **`CLIENT_URL` MUST be your full Render URL** — e.g., `https://devtrackr-abc1.onrender.com`. Without this, CORS will block login requests.

---

## 🚀 Step 4: Deploy!

Click **Create Web Service**. 
- Render will start the "Multi-stage build".
- It will first build your **React Frontend** (Stage 1).
- Then it will setup your **Node Backend** (Stage 2).
- Once finished, it will provide a URL like `devtrackr-xxxx.onrender.com`.

---

## 🛠️ Troubleshooting Login Issues

If login still fails after deploying:

1. **Check Render Logs** → Go to your service → **Logs** tab. Look for CORS errors or DB connection failures.

2. **Verify MongoDB Atlas Network Access** → Go to Atlas → Network Access → Ensure `0.0.0.0/0` is whitelisted.

3. **Check `CLIENT_URL`** → In Render → Environment → Make sure `CLIENT_URL` exactly matches your live URL (no trailing slash).

4. **Redeploy after env var changes** → Render does NOT auto-redeploy when you change env vars. Go to **Manual Deploy** → **Deploy latest commit**.

5. **Health check** → Visit `https://your-app.onrender.com/api/v1/health` — it should return `{"success":true}`.

---

## 📊 Why this is "MAANG Level":
- **Container Portability**: You aren't just uploading files; you are deploying an **Immutable Container**.
- **Production Efficiency**: Using a multi-stage Docker build ensures the final image is small, secure, and fast.
- **Unified Architecture**: Serving the frontend from the Node server is a classic architectural choice for secure, state-managed applications.

---
**Congratulations! You are now a Full-Stack Cloud Engineer.** 🌍
