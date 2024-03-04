import dotenv from "dotenv";
dotenv.config();

type IENV = {
  PORT: string | number;
  DB_URL: string;
};

const ENV: IENV = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL || "",
};

export default ENV;
