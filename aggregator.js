const axios = require("axios");

const FUNCTION_EXEC_URL = "http://localhost:3001/api/function/execute";

const executePipeline = async (pipeline) => {
  const executedStages = [];
  for (let stage of pipeline) {
    console.log(!_isEmptyArray(executedStages));
    prevStage = !_isEmptyArray(executedStages)
      ? executedStages[executedStages.length - 1]
      : {};
    const reqBody = _buildReqBodyFromStage(stage, prevStage);
    const functionResult = await _sendPostRequest(FUNCTION_EXEC_URL, reqBody);
    executedStages.push(functionResult);
    console.log(functionResult);
  }
};

const _isEmptyArray = (arr) => arr !== undefined && arr.length === 0;

const _buildReqBodyFromStage = (stage, prevStageResult) => {
  //add validations
  const mappedArgs = _mapArguementsFromPrevResult(stage, prevStageResult);
  return {
    functionId: stage.functionId,
    arguements: {
      ...(stage?.inputArgs || {}),
      ...mappedArgs,
    },
  };
};

const _mapArguementsFromPrevResult = (stage, prevStageResult) =>
  Object.keys(stage?.inputArgsMappings || {}).reduce(
    (newMappings, currentField) => {
      const mappedField = stage.inputArgsMappings[currentField];
      newMappings[currentField] = prevStageResult[mappedField] || undefined;
      return newMappings;
    },
    {}
  );

async function _sendPostRequest(url, data, headers = {}) {
  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    // Handle error here, e.g., log or throw an exception
    console.error("Error sending POST request:", error.message);
    throw error;
  }
}

/////////////////////////////////////////////////////////////////
const pipeline = [
  {
    functionId: "64acd2fa46998bc6743d3f8d",
    inputArgs: {
      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
  },
  {
    functionId: "64acd3ca46998bc6743d3f90",
    inputArgsMappings: {
      numbers: "evenNumbers",
    },
  },
  {
    functionId: "64acd57646998bc6743d3f94",
    inputArgsMappings: {
      numbers: "squareOfNumbers",
    },
  },
];

executePipeline(pipeline);
