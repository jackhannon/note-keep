"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = void 0;
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    // if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-Origin', origin);
    // }
    next();
};
exports.credentials = credentials;
