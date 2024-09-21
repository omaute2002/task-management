import jwt, { JwtPayload } from "jsonwebtoken";

// Hardcoded secrets
const SECRET_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const EXPIRES_IN = "7d";

// Define a user interface for stricter type safety
interface User {
  _id: string;
  email: string;
  username: string;
}

export const generateToken = (user: User) => {
  const userPayload = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    SECRET_KEY,
    {
      expiresIn: EXPIRES_IN,
    }
  );

  return userPayload;
};

// Verify a jwt token
export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    return await jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string): { id: string, email: string, username: string } | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded
      ? { id: decoded.id as string, email: decoded.email as string, username: decoded.username as string }
      : null;
  } catch (error) {
    return null;
  }
};

export const validateJWT = async (token: string): Promise<JwtPayload | false> => {
  try {
    console.log("Token received:", token);
    console.log("Secret key used:", SECRET_KEY);
    const decoded = await jwt.verify(token, SECRET_KEY) as JwtPayload;

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decoded.exp && decoded.exp < currentTime) {
      return false; // Token has expired
    }

    return decoded; // Valid token, return the decoded payload
  } catch (error) {
    console.error("JWT validation error:", error);
    return false; // Invalid token
  }
};
