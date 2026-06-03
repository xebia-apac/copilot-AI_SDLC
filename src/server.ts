import app from "./app";
import { config } from "./config";
import { logInfo } from "./logger";

const port = config.port;

app.listen(port, () => {
  logInfo("Server started", { port });
});
