"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const allowedOrigins_1 = require("./allowedOrigins");
// 
const corsOptions = {
    origin: (origin, callback) => {
        //short circuiting garauntees this will be a string if it gets to the 2nd half of the eval
        if (!origin || allowedOrigins_1.allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
};
exports.corsOptions = corsOptions;
