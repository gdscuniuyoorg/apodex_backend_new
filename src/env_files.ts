import dotenv from "dotenv";
dotenv.config();

type IENV = {
  PORT: string | number;
};

const ENV: IENV = {
  PORT: process.env.PORT || 3000,
};

export default ENV;
