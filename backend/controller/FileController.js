const duckdb = require('duckdb');
const path = require('path');// Example import statement, actual import may vary based on the library used
const OpenAI = require("openai");
const arrow = require('apache-arrow');
const fs = require('fs');
const { tableFromIPC } = require('apache-arrow');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const db = new duckdb.Database(process.env.DATABASE_NAME);

async function runPrompt(req, res) { 
  const { prompt, type } = req.body;
  console.log(prompt);
  const openai = new OpenAI();
  const content = "Convert natural language into SQL queries. Write a only SQL query data without any other symbol, text or description from this prompt.In sql query, table_name must be start and end with ' not ` . " + prompt
  
  let model_name = ""
  if(type == true){
    model_name = "gpt-3.5-turbo";
  } else {
    model_name = "gpt-4-1106-preview";
  }
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: content }],
    model: model_name,
  });
  
  const result_query = completion.choices[0].message.content
  console.log("generate query is",result_query);
  let result = result_query.replace(";","").replace(/(\r\n|\n|\r)/gm, "").replace(/"/g, "'");
  if(result != null){
    return res.status(200).json({
      status: 200,
      data: result
    });
  } else {
    res.status(500).send('Run prompt failed');
  }
}


module.exports = {runPrompt};
