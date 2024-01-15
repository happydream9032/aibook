"use client";

import Navbar1 from "@/components/layout/Navbar/navbar";
import MainPage from "@/components/ui/edit/mainpage";

// import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
// import { useDuckDb } from "../../hooks/useDuckDb";
// import { useDuckDbQuery } from "../../hooks/useDuckDbQuery";
// import initializeDuckDb, { getDuckDB } from "../../init/initializeDuckDb";
// import { runQuery } from "../../util/runQuery";
// import { getTempFilename } from "../../util/tempfile";
// import { drop, cardinalities } from "../../util/queries";

import { useState, useEffect } from "react";

export default function Home() {
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
