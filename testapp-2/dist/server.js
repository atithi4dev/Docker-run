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
const promises_1 = __importDefault(require("fs/promises"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
let COUNT = 1;
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Access to / route in server granted");
    yield promises_1.default.appendFile("./file.txt", `COUNT : ${COUNT++} \n`);
    return res.send("HELLO FROM SERVER");
}));
app.get("/click", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Access to /click route in server granted");
    yield promises_1.default.appendFile(`./clone/file-${COUNT}.txt`, `COUNT : ${COUNT++} \n`);
    return res.send("HELLO FROM MINE SERVER");
}));
app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});
