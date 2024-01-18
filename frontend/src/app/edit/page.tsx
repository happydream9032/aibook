"use client";

import Navbar1 from "@/components/layout/Navbar/navbar";
import MainPage from "@/components/ui/edit/mainpage";
import { DuckDBConfig } from "@duckdb/duckdb-wasm";
import { initializeDuckDb } from "duckdb-wasm-kit";

import { useState, useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const config: DuckDBConfig = {
      query: {
         castBigIntToDouble: true,
        },       
      }        
      initializeDuckDb({ config, debug: true });
    }, []);
  return (
    <main>
      <div className="bg-white text-gray-600">
        <Navbar1 />
      </div>
      <MainPage />
    </main>
  );
}

// export * from "../../files";

// export {
//   AsyncDuckDB,
//   getDuckDB,
//   initializeDuckDb,
//   runQuery,
//   useDuckDb,
//   useDuckDbQuery,
// };

// // Don't depend on these :)
// export { getTempFilename, drop, cardinalities };
