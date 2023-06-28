const fs = require("fs");
const path = require("path");
const Function = require("./models/function-schema");
const mongoose = require("mongoose");
const { NodeVM,VM } = require("vm2");

(async () => {
//   await mongoose.connect("mongodb://localhost:27017/function-service");
//   console.log("connected to db");
  //const { code } = await Function.findById("649ac644455aa2f658bdf227");
  //vm.run(`(${code})()`);
  const fn = fs.readFileSync(
    path.join(__dirname, "/scripts/sample.js"),
    "utf8"
  );

  
  const vm = new NodeVM({
    sandbox: {},
    require: {
      external: true, // Enable loading external modules
    },
  });
  vm.run(fn,'chakka.js');

  await mongoose.disconnect();
})();
