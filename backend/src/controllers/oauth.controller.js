import User from "../models/User.js";
import { generateTokenPair } from "../utils/jwt.js";
import env from "../config/env.js";

// Helper: derive the server's public base URL from the incoming request
const getServerBaseUrl = (req) => {
  const protocol = req.protocol; // respects trust proxy
  const host = req.get("host");  // includes port if non-standard
  return `${protocol}://${host}`;
};

// GOOGLE OAUTH
export const googleAuth = (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${getServerBaseUrl(req)}/api/v1/auth/callback/google`,
    client_id: env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  res.redirect(`${rootUrl}?${qs.toString()}`);
};

export const googleCallback = async (req, res, next) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.redirect(`${env.CLIENT_URL}/login?error=OAuthFailed`);
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${getServerBaseUrl(req)}/api/v1/auth/callback/google`,
        grant_type: "authorization_code",
      }),
    });
    
    if (!tokenRes.ok) throw new Error("Failed to fetch Google tokens");
    const { access_token, id_token } = await tokenRes.json();

    // Get user info
    const userRes = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
      headers: { Authorization: `Bearer ${id_token}` },
    });

    if (!userRes.ok) throw new Error("Failed to fetch Google user profile");
    const googleUser = await userRes.json();

    // Find or create user
    let user = await User.findOne({ email: googleUser.email });
    
    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // random secure password
      });
    }

    const tokens = generateTokenPair(user);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    // Redirect to frontend with tokens
    res.redirect(`${env.CLIENT_URL}/oauth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.redirect(`${env.CLIENT_URL}/login?error=OAuthFailed`);
  }
};

// GITHUB OAUTH
export const githubAuth = (req, res) => {
  const rootUrl = "https://github.com/login/oauth/authorize";
  const options = {
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${getServerBaseUrl(req)}/api/v1/auth/callback/github`,
    scope: "user:email",
  };

  const qs = new URLSearchParams(options);
  res.redirect(`${rootUrl}?${qs.toString()}`);
};

export const githubCallback = async (req, res, next) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.redirect(`${env.CLIENT_URL}/login?error=OAuthFailed`);
    }

    // Exchange code for token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenRes.ok) throw new Error("Failed to fetch GitHub token");
    const { access_token } = await tokenRes.json();

    // Get user profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!userRes.ok) throw new Error("Failed to fetch GitHub user");
    const githubUser = await userRes.json();

    // Get user emails (GitHub primary email)
    const emailRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!emailRes.ok) throw new Error("Failed to fetch GitHub emails");
    const emails = await emailRes.json();
    
    const primaryEmail = emails.find((e) => e.primary)?.email || emails[0]?.email;
    if (!primaryEmail) throw new Error("No email found associated with GitHub account");

    // Find or create user
    let user = await User.findOne({ email: primaryEmail });
    
    if (!user) {
      user = await User.create({
        name: githubUser.name || githubUser.login,
        email: primaryEmail,
        githubUsername: githubUser.login,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // random secure password
      });
    } else if (!user.githubUsername) {
      // If user exists but has no github username linked, link it now
      user.githubUsername = githubUser.login;
    }

    const tokens = generateTokenPair(user);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    // Redirect to frontend with tokens
    res.redirect(`${env.CLIENT_URL}/oauth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
  } catch (error) {
    console.error("GitHub OAuth Error:", error);
    res.redirect(`${env.CLIENT_URL}/login?error=OAuthFailed`);
  }
};
