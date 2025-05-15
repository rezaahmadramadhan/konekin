const Redis = require("ioredis");
const redis = new Redis({
  port: 13870,
  host: "redis-13870.crce194.ap-seast-1-1.ec2.redns.redis-cloud.com",
  username: "default",
  password: "1ClV91kR4YINwDraXpRYe0bcOmtchIpF",
  db: 0,
});

module.exports = redis;
