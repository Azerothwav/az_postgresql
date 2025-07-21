logger = {
  info: function (msg) {
    console.log("[INFO]: %s", msg);
  },
  warn: function (msg) {
    console.log("[WARN]: %s", msg);
  },
  debugger: function (msg) {
    if (GetConvar("az_postgres_debug", true)) {
      console.log("[DEBUG]: %s", msg);
    }
  },
};
