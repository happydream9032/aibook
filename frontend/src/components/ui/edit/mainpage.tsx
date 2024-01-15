"use client";
import React from "react";
import { useState, useEffect } from "react";
import TypingComponent from "./widgets/input";
import Importfile from "./widgets/importfile";
import RunSQL from "./widgets/runsql";
import AIPrompt from "./widgets/alprompt";
import { DuckDBConfig } from "@duckdb/duckdb-wasm";
import { initializeDuckDb } from "duckdb-wasm-kit";

const MainPage = () => {
  const [fileInput, setFileInput] = useState(false); // State to hold the content of the p tag
  const [content, setContent] = useState("");

  useEffect(() => {
    const config: DuckDBConfig = {
      query: {
        castBigIntToDouble: true,
      },
    };
    initializeDuckDb({ config, debug: true });
  }, []);

  return (
    <main className="mantine-prepend-1682jzp">
      <div className="w-full h-[100vh] bg-white">
        <div className="pt-20">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-start-4 col-span-6 text-sm mb-[300px]">
              <div className="text-lg text-black">
                <div
                  contentEditable={true}
                  tabIndex={0}
                  className="ProseMirror prose prose-p:text-lg mb-[50px] max-w-none"
                >
                  <style jsx>{`
                    [contenteditable] {
                      outline: 0px solid transparent;
                    }
                  `}</style>
                  <h1 className="text-3xl font-extrabold">👋 Hi, Duckbook!</h1>
                  <p className="py-4">
                    Duckbook is an AI-powered SQL notebook that helps you
                    explore and visualize datasets in your browser — powered by
                    🦆 DuckDB and ✨ GPT-4.
                  </p>
                  <p className="py-4">
                    To get started, try <strong>typing</strong> a
                    &#34;&#34;/&#34;&#34; to see what you can do.
                  </p>
                  <p className="py-4">
                    Tip: Try loading a dataset, then use AI to ask a question
                    about it.
                  </p>
                  <TypingComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainPage;
