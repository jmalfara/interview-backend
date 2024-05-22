import * as dotenv from "dotenv";
dotenv.config();

export type Config = {
  nodeEnv: string;
};

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || "production",
};
