const mongoose = require('mongoose');

// Define the function schema
const functionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
  },
  dependencies: {
    type: [String],
    default: [],
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  // Add any other fields as needed
});

// Create the Function model
const FunctionModel = mongoose.model('Function', functionSchema);

module.exports = FunctionModel;
