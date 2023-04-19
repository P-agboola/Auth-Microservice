export default () => ({
  host: process.env.db_host,
  port: parseInt(process.env.db_port),
  username: process.env.db_username,
  password: process.env.db_password,
  database: process.env.db_database,
  jwt_secret: process.env.Jwt_Secret,
});
