const Function = require("./models/function-schema");
const mongoose = require("mongoose");
const { NodeVM } = require("vm2");
const vm = new NodeVM({
    console:'inherit'
});

(async () => {
  await mongoose.connect("mongodb://localhost:27017/function-service");
  console.log("connected to db");
  const { code } = await Function.findById("649ac644455aa2f658bdf227");
  vm.run(`(${code})()`);
  await mongoose.disconnect();
})();
