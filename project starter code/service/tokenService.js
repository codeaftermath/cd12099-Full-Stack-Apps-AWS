import jwt from "jsonwebtoken";
import { PRIVATE_KEY, PUBLIC_KEY } from "../../keys.js"; // TODO ML : Improve by storing key pairs in a secrets manager

class TokenService {
  generateTokens(id) {
    const accessToken = jwt.sign(
      {
        id: id,
        tokenType: 'ACCESS_TOKEN',
      },
      PRIVATE_KEY,
      { expiresIn: 30, algorithm: "RS256" }
    );
    const refreshToken = jwt.sign(
      {
        id: id,
        tokenType: 'REFRESH_TOKEN',
      },
      PRIVATE_KEY,
      { expiresIn: 300, algorithm: "RS256" }
    );
    return { accessToken, refreshToken };
  }

  decodeToken(token) {
    const decodedToken = jwt.decode(token);
    if (!decodedToken) {
      throw new Error("Failed to decode JWT token");
    }
    return decodedToken;
  }

  verifyToken(token) {
    const decodedToken = jwt.verify(token, PUBLIC_KEY)
    return decodedToken;
  }
}

export default new TokenService();