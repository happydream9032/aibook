const duckdb = require('duckdb');
const path = require('path');// Example import statement, actual import may vary based on the library used
const OpenAI = require("openai");
const arrow = require('apache-arrow');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const db = new duckdb.Database(process.env.DATABASE_NAME);

async function fileUpload(req, res) {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  file.mv(path.join(__dirname, 'uploads', file.name), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  });

  const filePath = path.join(__dirname, 'uploads', file.name);
  let table_name = String(file.name).replace(".csv", "").replace(".parquet", "").replace(".json", "").replace(".xlsx", "").replace(".CSV", "").replace(".PARQUET", "").replace(".JSON", "").replace(".XLSL", "");
  const check_table = `SELECT * FROM information_schema.tables WHERE table_name = '${table_name}';`;

  let method = ""
  if (String(file.name).includes("csv")){
    method = "read_csv_auto"
  } else if (String(file.name).includes("parquet")){
    method = "read_parquet"
  } else if (String(file.name).includes("json")){
    method = "read_json_auto"
  } else if (String(file.name).includes("xlsx")){
    method = "st_read"
  }

  await db.all(check_table, function (err, result) {
    if (err) {
      console.log("check query :", err);
    } else {
      if (result.length == 0) {
        db.exec(`CREATE TABLE ${table_name} AS SELECT * FROM ${method}('${filePath}');`);
      } else if (result.length > 0) { 
        db.exec(`INSERT INTO ${table_name} SELECT * FROM ${method}('${filePath}');`);
      }
      const query = `SELECT * FROM ${table_name};`;
      db.all(query, function (err, result) {
        if (err) {
          console.log("Failed!", err);
          return res.status(500).send('File processing failed');
        } else {
          let data_array = [];
          const titles = Object.keys(result[0]);
          result.map((item, index) => { 
            let json_data = {}
            Object.values(item).map((value, index) => {
              json_data[titles[index]] = String(value);
            });
            data_array[index] = json_data;
          })
          return res.status(200).json({
            status: 200,
            data : data_array,
            table_name : table_name
          });
        }
      });
    }
  })
}

async function fetchUrl(req, res) {
  const { url } = req.body;
  const string_url = String(url)

  let arry = string_url.split('/');
  let lastElement = arry[arry.length - 1];
  let table_name = String(lastElement).replace(".csv", "").replace(".parquet", "").replace(".json", "").replace(".xlsx", "").replace(".CSV", "").replace(".PARQUET", "").replace(".JSON", "").replace(".XLSL", "");
  db.exec("INSTALL httpfs;");
  db.exec("LOAD httpfs;");

  let method = ""
  if (String(lastElement).includes("csv")){
    method = "read_csv_auto"
  } else if (String(lastElement).includes("parquet")){
    method = "read_parquet"
  } else if (String(lastElement).includes("json")){
    method = "read_json_auto"
  } else if (String(lastElement).includes("xlsx")){
    method = "st_read"
  }

  const check_table = `SELECT * FROM information_schema.tables WHERE table_name = '${table_name}';`;
  await db.all(check_table, function (err, result) {
    if (err) {
      console.log("check query :", err);
    } else {
      if (result.length == 0) {
        console.log("sttep1");
        db.exec(`CREATE TABLE ${table_name} AS SELECT * FROM ${method}('${url}');`);
      } else if (result.length > 0) { 
        console.log("sttep2");
        db.exec(`INSERT INTO ${table_name} SELECT * FROM ${method}('${url}');`);
      }
      const query = `SELECT * FROM ${table_name};`;
      db.all(query, function (err, result) {
        if (err) {
          console.log("Failed!", err);
          res.status(500).send('File processing failed');
        } else {
          let data_array = [];
          const titles = Object.keys(result[0]);
          result.map((item, index) => { 
            let json_data = {}
            Object.values(item).map((value, index) => {
              json_data[titles[index]] = String(value);
            });
            data_array[index] = json_data;
          })
          return res.status(200).json({
            status: 200,
            data : data_array,
            table_name : table_name
          });
        }
      });
    }
  })
}

async function runSQLQuery(req, res) {
  const { sql_query } = req.body;
  console.log("sql query is",sql_query)
  let query = String(sql_query).replace(".csv", "").replace(".parquet", "").replace(".json", "").replace(".xlsx", "").replace(".CSV", "").replace(".PARQUET", "").replace(".JSON", "").replace(".XLSL", "").replace(";","");
  await db.all(query, function(err, result) {
    if (err) {
      console.log("Failed!", err);
      return res.status(500).send('File processing failed');
    } else {
      console.log("result", result, result.length);
      if (result.length > 0) {
        let data_array = [];
        const titles = Object.keys(result[0]);
        result.map((item, index) => {
          let json_data = {}
          Object.values(item).map((value, index) => {
            json_data[titles[index]] = String(value);
          });
          data_array[index] = json_data;
        })
        console.log("sent");
        return res.status(200).json({
          status: 200,
          data: data_array,
          table_name : "query"
        });
      } else { 
        return res.status(201).json({
          status: 201,
          data: result,
          table_name : "query"
        });
      }
    }
  });
}

async function runPrompt(req, res) { 
  const { prompt } = req.body;
  console.log(prompt);
  const openai = new OpenAI();
  const content = "Convert natural language into SQL queries. Write a only SQL query without other description from this prompt." + prompt
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: content }],
    model: "gpt-3.5-turbo",
  });
  const result_query = completion.choices[0].message.content
  console.log("generate query is",result_query);
  let result = result_query.replace(";","").replace("\n","");
  if(result != null){
    return res.status(200).json({
      status: 200,
      data: result
    });
  } else {
    res.status(500).send('Run prompt failed');
  }
}

async function pasteTable(req, res) { 
  const { json_data,header_data, header_item } = req.body;
  try {
    const check_table = `SELECT * FROM information_schema.tables WHERE TABLE_NAME LIKE 'jsontable%';`;
    await db.all(check_table, function (err, result) {
      const table_name = "jsontable" + result.length.toString();
      console.log("Step1")
      const check_table1 = `SELECT * FROM information_schema.tables WHERE TABLE_NAME LIKE '${table_name}';`;
      db.all(check_table1, function (err, result1){
        if(result1.length == 0){
          console.log("Step2")
          let create_table_query = `CREATE TABLE ${table_name} (${header_item});`
          console.log(create_table_query)
          db.exec(create_table_query);
        }
        let table_data = []
        for (let i=0;i<json_data.length;i++){
          let array = []
          for(let j=0;j<json_data[i].length;j++){
            let temp = "'"+json_data[i][j]+"'"
            array.push(temp)
          }
          let query = "(" + array.join(', ') + ")"
          console.log("query", query);
          table_data.push(query)
        }
        let query1 = `INSERT INTO ${table_name} (${header_data.join(', ')}) VALUES ${table_data.join(', ')};`
        console.log("query1", query1)
        db.exec(query1);
        const query = `SELECT * FROM ${table_name};`;
        db.all(query, function (err, result) {
          if (err) {
            console.log("Failed!", err);
            res.status(500).send('File processing failed');
          } else {
            console.log(result);
            let data_array = [];
            const titles = Object.keys(result[0]);
            result.map((item, index) => { 
              let json_data = {}
              Object.values(item).map((value, index) => {
                json_data[titles[index]] = String(value);
              });
              data_array[index] = json_data;
            })
            return res.status(200).json({
              status: 200,
              data : data_array,
              table_name : table_name
            });
          }
        });
      }); 
    });
    
  } catch (err) {
    console.error('Error saving data:', err);
  }

}

module.exports = {fileUpload, fetchUrl, runSQLQuery, runPrompt, pasteTable};
