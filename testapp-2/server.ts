import express,  { Request, Response } from "express"
import fs from "fs/promises"
const app = express();
const PORT = process.env.PORT || 8080;
let COUNT = 1;

app.get("/", async(req:Request,res:Response)=>{
	console.log("Access to / route in server granted")
	await fs.appendFile("./file.txt", `COUNT : ${COUNT++} \n`);
	return res.send("HELLO FROM SERVER")
})
app.get("/click", async(req:Request,res:Response)=>{
	console.log("Access to /click route in server granted")
	await fs.appendFile(`./clone/file-${COUNT}.txt`, `COUNT : ${COUNT++} \n`);
	return res.send("HELLO FROM MINE SERVER")
})

app.listen(PORT, ()=>{
	console.log(`Server is running on port : ${PORT}`)
})
