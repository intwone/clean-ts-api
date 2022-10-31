export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || '2a2689d0fb28447746a6fc7f852f411e95a6a3ae5803cd83f0d7c487656774b8',
};
