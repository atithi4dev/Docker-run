import express from "express";
import fs from "fs";
const app = express();
const PORT = process.env.PORT || 8080;
app.get('/', (req,res)=>{
	fs.readFile('./file.txt','utf-8',(err,data)=>{
		if(err){
			console.log("ERROR READING FILE", err);
			return;
		}
		console.log("FILE DATA:", data);
		res.send(data);
	})
	
	res.send("I AM INSIDE BUILD-1")
});

app.listen(PORT, ()=>{
	console.log(`SERVER IS LISTENING ON PORT ${PORT}`)
})
