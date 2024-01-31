import os
import openai
import duckdb
from dotenv import load_dotenv

load_dotenv()

class QuackingDuck:

    def __init__(self, schema, model):
        self.model = model
        self.schemas = schema
        openai.api_key = os.getenv('OPEN_API_KEY')

    def explain_content(self, detail="one sentence"):
        print(self._schema_summary_internal(detail)[1])

    def _schema_summary_internal(self, detail="one sentence"):
        prompt = f"""SQL schema of my database:
            {self.schemas}
            Explain in {detail} what the data is about:
        """
        explanation = openai.ChatCompletion.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that can generate an human redable summary of database content based on the schema. In schema, table_name is the name is table and it will be end with '.csv', '.parquet', or '.arrow'. "},
                {"role": "user", "content": prompt},
            ],
            temperature=0,
        )["choices"][0]["message"]["content"].strip("\n")

        return (prompt, explanation)

    def _generate_sql(self, question, debug=False):
        (summary_prompt, summary) = self._schema_summary_internal()
        sql_prompt = f"""Output a single SQL query without any explanation and do not add anything to the query that was not part of the question. Only if the question is not realted to the data in the database, answer with "I don't know".
            In SQL query, only the name of table is will be start and end with `"` and it will be include '.csv', '.parquet' or '.arrow'. And the name of each column couldn't start and end with this `'` symbol.  Write a only SQL query data without any other symbol, text or description such as ``` or ```sql from this prompt.
            Make sure to only use tables and columns from the schema above and write a query to answer the following question:
            "{question}"
            """
        sql_query = openai.ChatCompletion.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that can generate Postgresql code based on the user input. You do not respond with any human readable text, only SQL code."},
                {"role": "user", "content": summary_prompt},
                {"role": "assistant", "content": summary},
                {"role": "user", "content": sql_prompt},
            ],
            temperature=0,
        )["choices"][0]["message"]["content"].strip("\n")

        if debug:
            print("Prompt: \n"+sql_prompt)
            print("SQL Query: \n"+sql_query)
        if "I don't know" in sql_query:
            raise Exception("Question cannot be answered based on the data in the database.")

        return summary_prompt, summary, sql_prompt, sql_query

    def _regenerate_sql(self, content_prompt, content_summary, sql_prompt, sql_query, error, debug=False):
        sql_query = openai.ChatCompletion.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that can generate Postgresql code based on the user input. You do not respond with any human readable text, only SQL code."},
                {"role": "user", "content": content_prompt},
                {"role": "assistant", "content": content_summary},
                {"role": "user", "content": sql_prompt},
                {"role": "assistant", "content": sql_query},
                {"role": "user", "content": f"I got the following exception: {error}. Please correct the query and only print sql code, without an apology."},
            ],
            temperature=0,
        )["choices"][0]["message"]["content"].strip("\n")

        if debug:
            print("Corrected SQL Query: \n"+sql_query)

        return sql_query


    def ask(self, question, debug=False):
        summary_prompt, summary, sql_prompt, sql_query = self._generate_sql(question, debug)
        return sql_query

#         try:
#             result = self.conn.execute(sql_query).fetchdf()
#             result_markdown = result.head(10).to_markdown()
#         except Exception as e:
#             print("Query caused an error: " + str(e) + "\n Will try to fix it.\n")
#             sql_query = self._regenerate_sql(summary_prompt, summary, sql_prompt, sql_query, str(e), debug)

#             return sql_query
#             result = self.conn.execute(sql_query).fetchdf()
#             result_markdown = result.head(10).to_markdown()

#         answer_prompt = f"""Query Result:
# {result_markdown}
# Answer the question in natural language, based on information from the query result.
# """
#         answer = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "You are a helpful assistant."},
#                 {"role": "user", "content": summary_prompt},
#                 {"role": "assistant", "content": summary},
#                 {"role": "user", "content": sql_prompt},
#                 {"role": "assistant", "content": sql_query},
#                 {"role": "user", "content": answer_prompt},
#             ],
#             temperature=0,
#         )["choices"][0]["message"]["content"].strip("\n")


#         if debug:
#             print("Prompt: \n"+answer_prompt)
#             print("Answer: \n"+answer)
#         else:
#             print(answer)

#         return result