const Function = require("./models/function-schema");
const mongoose = require("mongoose");

(async () => {
  await mongoose.connect("mongodb://localhost:27017/function-service");
  console.log("connected to db");

  const fn = () => console.log("hello world");

  const newFunction = new Function({
    name: "helloWorldFunction",
    code: fn.toString(),
    dependencies: ["axios", "lodash"],
    metadata: { timeout: 5000 },
  });

  // Save the function document to the database
  const savedFn=await newFunction.save();
  console.log(savedFn);
  
})();
