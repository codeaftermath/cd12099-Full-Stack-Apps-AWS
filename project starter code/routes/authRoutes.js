import express from "express";
import tokenService from "../service/tokenService.js";

export const router = express.Router();

router.post("/token", async (req, res) => {
  console.log("Generating token ...");
  try {
    const { id, secret } = req.body;

    // TODO ML: Should lookup user id from directory
    if (id != "test") {
      return res.status(401).send("Unauthorized");
    }

    // TODO ML: Should verify hashed password with salt against value stored in secret store
    if (secret != "SuperSecretSaltedPasswordHash") {
      return res.status(401).send();
    }

    // Generate access token after credentials verified
    const { accessToken, refreshToken: newRefreshToken } =
      tokenService.generateTokens(id);
    return res.json({
      access_token: accessToken,
      refresh_token: newRefreshToken,
      token_type: "bearer",
    });
  } catch (error) {
    console.error("Request /token error", error);
    return res.status(500).send("Failed to generate token");
  }
});
