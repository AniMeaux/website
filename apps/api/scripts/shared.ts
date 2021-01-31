import "../src/env";

process.on("unhandledRejection", (err) => {
  throw err;
});
