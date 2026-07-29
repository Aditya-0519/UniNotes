const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.uninotes-production.5pkxf0u.mongodb.net",
  (err, records) => {
    console.log("Error:", err);
    console.log(records);
  }
);