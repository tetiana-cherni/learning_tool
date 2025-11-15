import express from "express";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

import pkg from "express-openid-connect";
const { auth, requiresAuth } = pkg;

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.AUTH0_DOMAIN!,
    baseURL: process.env.BASE_URL!,
    clientID: process.env.AUTH0_CLIENT_ID!,
    secret: process.env.AUTH0_CLIENT_SECRET!,
    idpLogout: true,
  })
);

app.get("/", (req, res) => {
  res.send(
    req.oidc?.isAuthenticated()
      ? `Hi ${req.oidc.user?.name}! <a href="/logout">Log out</a>`
      : `<a href="/login">Login</a>`
  );
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(`Name: ${req.oidc.user?.name} <br> Email: ${req.oidc.user?.email}`);
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.BASE_URL}`)
);


// run with npx ts-node src/server.ts