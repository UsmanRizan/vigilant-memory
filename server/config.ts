import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error(
    "Missing MONGODB_URI. Set it in your environment before starting the server.",
  );
}

export const MONGODB_URI = mongoUri;
