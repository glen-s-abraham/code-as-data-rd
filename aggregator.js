const axios = require("axios");
const { sendHttpRequest } = require("./helpers/http_executor");

const FUNCTION_EXEC_URL = "http://localhost:3001/api/function/execute";

const executePipeline = async (pipeline) => {
  const executedStages = [];
  for (let stage of pipeline) {
    prevStage = !_isEmptyArray(executedStages)
      ? executedStages[executedStages.length - 1]
      : {};
    const functionResult = await getFunctionProcessor(stage.functionType)(
      stage,
      prevStage
    );
    executedStages.push(functionResult);
    console.log(functionResult);
  }
};

const getFunctionProcessor = (functionType) => {
  switch (functionType) {
    case "custom": {
      return _customExecutor;
    }

    case "rest": {
      return _httpExecutor;
    }
  }
};

const _customExecutor = async (stage, prevStageResults) => {
  const reqBody = _buildReqBodyFromStage(stage, prevStageResults);
  return _sendPostRequest(FUNCTION_EXEC_URL, reqBody);
};

const _httpExecutor = async (stage, prevStageResults) => {
  const { endpoint, method, resultAs } = stage;
  const reqBody = _buildReqBodyFromStage(stage, prevStageResults);
  return sendHttpRequest({ method, url: endpoint, data: reqBody});
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
const simple_pipeline = [
  {
    functionId: "64acd2fa46998bc6743d3f8d",
    functionType: "custom",
    inputArgs: {
      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
  },
  {
    functionId: "64acd3ca46998bc6743d3f90",
    functionType: "custom",
    inputArgsMappings: {
      numbers: "evenNumbers",
    },
  },
  {
    functionId: "64acd57646998bc6743d3f94",
    functionType: "custom",
    inputArgsMappings: {
      numbers: "squareOfNumbers",
    },
  },
];

const product_category_averages_pipeline = [
  {
    functionType: "rest",
    endpoint: "https://dummyjson.com/products",
    method: "get",
    resultAs: "products",
  },
  {
    functionId:"64ad205ecb038ca8984469f8",
    functionType: "custom",
    inputArgsMappings:{
        data:"products"
    },
    inputArgs:{
        key:'category'
    }
  },
  {
    functionId:"64ad2b7fcb038ca8984469ff",
    functionType: "custom",
    inputArgsMappings:{
        data:"groupedData"
    },
    inputArgs:{
        averageField:'rating'
    }
  }
];

executePipeline(product_category_averages_pipeline);
