import ENV from "./env_files";

import app from "./app";
import connectDB from "./db";

// connect to database
connectDB();

app.listen(ENV.PORT, () => {
  console.log(`Server started successfully at port ${ENV.PORT}`);
});
