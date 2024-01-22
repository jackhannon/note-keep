"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conn_js_1 = require("./config/conn.js");
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const notFound_js_1 = require("./middleware/notFound.js");
const errorHander_js_1 = require("./middleware/errorHander.js");
const cors_1 = __importDefault(require("cors"));
const credentials_js_1 = require("./middleware/credentials.js");
const corsOptions_js_1 = require("./config/corsOptions.js");
const envConfig_js_1 = __importDefault(require("./config/envConfig.js"));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const port = Number(envConfig_js_1.default.PORT);
        yield (0, conn_js_1.connectToDatabase)();
        const app = (0, express_1.default)();
        app.use(credentials_js_1.credentials);
        app.use((0, cors_1.default)(corsOptions_js_1.corsOptions));
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use(express_1.default.json());
        app.use("/notes", noteRoutes_1.default);
        app.get("/", (req, res) => {
            res.send("Hello, this is the root endpoint!");
        });
        app.use(errorHander_js_1.errorHandler);
        app.use(notFound_js_1.notFound);
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}!`);
        });
    });
}
startServer();
