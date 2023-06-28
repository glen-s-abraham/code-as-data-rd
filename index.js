const fs =  require('fs')
const path = require('path');
const Function = require("./models/function-schema");
const mongoose = require("mongoose");


(async () => {
  await mongoose.connect("mongodb://localhost:27017/function-service");
  console.log("connected to db");

  const fn = fs.readFileSync(path.join(__dirname,'/scripts/sample.js'),'utf-8')

  const newFunction = new Function({
    name: "scriptFile",
    code: fn,
    dependencies: ["mongodb"],
    metadata: { timeout: 5000 },
  });

  // Save the function document to the database
  //const savedFn=await newFunction.save();
  await mongoose.disconnect(); 
})();
