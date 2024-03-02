import ENV from "./env_files";

import app from "./app";

app.listen(ENV.PORT, () => {
  console.log(`Server started successfully at port ${ENV.PORT}`);
});
