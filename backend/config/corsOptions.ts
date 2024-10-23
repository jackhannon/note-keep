import { allowedOrigins } from "./allowedOrigins";
import env from "./envConfig";

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    //short circuiting garauntees this will be a string if it gets to the 2nd half of the eval
    if (origin === env.CLIENT_DOMAIN ||
       (!origin || allowedOrigins.indexOf(origin) !== -1)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};


export {corsOptions}