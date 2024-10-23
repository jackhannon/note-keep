import env from "./envConfig";

const allowedOrigins = [
  'http://localhost:5173',
  'https://jackhannon.github.io',
  `${env.CLIENT_DOMAIN}`, 
];

export {allowedOrigins}