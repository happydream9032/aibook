"use client";

import { useState, useEffect } from "react";
//import Accordion from "./accordion";
const Faq = () => {
  const [accordionOpen1, setAccordionOpen1] = useState(false);
  const [accordionOpen2, setAccordionOpen2] = useState(false);
  const [accordionOpen3, setAccordionOpen3] = useState(false);
  const [accordionOpen4, setAccordionOpen4] = useState(false);
  const [accordionOpen5, setAccordionOpen5] = useState(false);
  const [accordionOpen6, setAccordionOpen6] = useState(false);
  const [accordionOpen7, setAccordionOpen7] = useState(false);
  const [accordionOpen8, setAccordionOpen8] = useState(false);
  useEffect(() => {
    setAccordionOpen1(false);
    setAccordionOpen2(false);
    setAccordionOpen3(false);
    setAccordionOpen4(false);
    setAccordionOpen5(false);
    setAccordionOpen6(false);
    setAccordionOpen7(false);
    setAccordionOpen8(false);
  }, []);

  return (
    <section id="faq" className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-white/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-white">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-white/10">
            <div className="pt-5">
              <h2>
                <button
                  className="flex w-full items-center justify-between py-2 text-left font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    setAccordionOpen1(!accordionOpen1);
                  }}
                  aria-expanded={accordionOpen1}
                  aria-controls={`accordion-text-0`}
                >
                  <span className="text-base text-white font-semibold leading-7">
                    Where is my data stored?
                  </span>
                  <svg
                    className="ml-8 shrink-0 fill-white"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`ttransform origin-center transition duration-200 ease-out ${
                        accordionOpen1 && "!rotate-180"
                      }`}
                    />
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`origin-center rotate-90 transform transition duration-200 ease-out ${
                        accordionOpen1 && "!rotate-180"
                      }`}
                    />
                  </svg>
                </button>
              </h2>
              <div
                id={`accordion-text-0`}
                role="region"
                aria-labelledby={`accordion-title-0`}
                className={`grid overflow-hidden text-sm text-slate-600 transition-all duration-300 ease-in-out ${
                  accordionOpen1
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-base leading-7 text-gray-300">
                    Data files you import (such as CSV or Parquet) are
                    compressed and stored in your browsers IndexedDB storage.
                    <br /> No data is stored on DataBooks servers.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <h2>
                <button
                  className="flex w-full items-center justify-between py-2 text-left font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    setAccordionOpen2(!accordionOpen2);
                  }}
                  aria-expanded={accordionOpen2}
                  aria-controls={`accordion-text-0`}
                >
                  <span className="text-base text-white font-semibold leading-7">
                    What data gets sent to OpenAI?
                  </span>
                  <svg
                    className="ml-8 shrink-0 fill-white"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`ttransform origin-center transition duration-200 ease-out ${
                        accordionOpen2 && "!rotate-180"
                      }`}
                    />
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`origin-center rotate-90 transform transition duration-200 ease-out ${
                        accordionOpen2 && "!rotate-180"
                      }`}
                    />
                  </svg>
                </button>
              </h2>
              <div
                id={`accordion-text-0`}
                role="region"
                aria-labelledby={`accordion-title-0`}
                className={`grid overflow-hidden text-sm text-slate-600 transition-all duration-300 ease-in-out ${
                  accordionOpen2
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-base leading-7 text-gray-300">
                    If you don&#39;t use DataBook&#39;s AI features, no data
                    leaves your browser. If you do use AI, your dataset schema
                    (column names and types) and a small number of example
                    values (&lt; 10 per column) are sent to OpenAI, and subject
                    to their&nbsp;
                    <a
                      href="https://openai.com/policies/api-data-usage-policies/"
                      className="text-blue-600 hover:underline dark:text-blue-500"
                    >
                      API data usage policies
                    </a>
                    . OpenAI states that this data is deleted after 30 days, and
                    isn&#39;t used for model training. The reason we send
                    example values is they dramatically improve the quality of
                    SQL queries.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <h2>
                <button
                  className="flex w-full items-center justify-between py-2 text-left font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    setAccordionOpen3(!accordionOpen3);
                  }}
                  aria-expanded={accordionOpen3}
                  aria-controls={`accordion-text-0`}
                >
                  <span className="text-base text-white font-semibold leading-7">
                    How do I delete my data?
                  </span>
                  <svg
                    className="ml-8 shrink-0 fill-white"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`ttransform origin-center transition duration-200 ease-out ${
                        accordionOpen3 && "!rotate-180"
                      }`}
                    />
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`origin-center rotate-90 transform transition duration-200 ease-out ${
                        accordionOpen3 && "!rotate-180"
                      }`}
                    />
                  </svg>
                </button>
              </h2>
              <div
                id={`accordion-text-0`}
                role="region"
                aria-labelledby={`accordion-title-0`}
                className={`grid overflow-hidden text-sm text-slate-600 transition-all duration-300 ease-in-out ${
                  accordionOpen3
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-base leading-7 text-gray-300">
                    All DataBook data lives on your local computer, and can be
                    deleted at any time. Deleting a single doc will delete any
                    associated files from your browser. Or you can purge all
                    DataBook data from your settings page.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <h2>
                <button
                  className="flex w-full items-center justify-between py-2 text-left font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    setAccordionOpen4(!accordionOpen4);
                  }}
                  aria-expanded={accordionOpen4}
                  aria-controls={`accordion-text-0`}
                >
                  <span className="text-base text-white font-semibold leading-7">
                    What if I clear my browser cache?
                  </span>
                  <svg
                    className="ml-8 shrink-0 fill-white"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`ttransform origin-center transition duration-200 ease-out ${
                        accordionOpen4 && "!rotate-180"
                      }`}
                    />
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`origin-center rotate-90 transform transition duration-200 ease-out ${
                        accordionOpen4 && "!rotate-180"
                      }`}
                    />
                  </svg>
                </button>
              </h2>
              <div
                id={`accordion-text-0`}
                role="region"
                aria-labelledby={`accordion-title-0`}
                className={`grid overflow-hidden text-sm text-slate-600 transition-all duration-300 ease-in-out ${
                  accordionOpen4
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-base leading-7 text-gray-300">
                    All data will be erased! If you want to store a document
                    more permanently, you can export it as a file to store in
                    your filesystem or on Github. Anyone you share the file with
                    can import it in their own browser.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <h2>
                <button
                  className="flex w-full items-center justify-between py-2 text-left font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    setAccordionOpen5(!accordionOpen5);
                  }}
                  aria-expanded={accordionOpen5}
                  aria-controls={`accordion-text-0`}
                >
                  <span className="text-base text-white font-semibold leading-7">
                    Is DataBook free?
                  </span>
                  <svg
                    className="ml-8 shrink-0 fill-white"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`ttransform origin-center transition duration-200 ease-out ${
                        accordionOpen5 && "!rotate-180"
                      }`}
                    />
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`origin-center rotate-90 transform transition duration-200 ease-out ${
                        accordionOpen5 && "!rotate-180"
                      }`}
                    />
                  </svg>
                </button>
              </h2>
              <div
                id={`accordion-text-0`}
                role="region"
                aria-labelledby={`accordion-title-0`}
                className={`grid overflow-hidden text-sm text-slate-600 transition-all duration-300 ease-in-out ${
                  accordionOpen5
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-base leading-7 text-gray-300">
                    Yes, it&apos;s free to use, with rate-limited AI commands
                    per month. We may add a Pro plan in the future with higher
                    limits and more features (TBD).
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <h2>
                <button
                  className="flex w-full items-center justify-between py-2 text-left font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    setAccordionOpen6(!accordionOpen6);
                  }}
                  aria-expanded={accordionOpen6}
                  aria-controls={`accordion-text-0`}
                >
                  <span className="text-base text-white font-semibold leading-7">
                    Which AI model does DataBook use?
                  </span>
                  <svg
                    className="ml-8 shrink-0 fill-white"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`ttransform origin-center transition duration-200 ease-out ${
                        accordionOpen6 && "!rotate-180"
                      }`}
                    />
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`origin-center rotate-90 transform transition duration-200 ease-out ${
                        accordionOpen6 && "!rotate-180"
                      }`}
                    />
                  </svg>
                </button>
              </h2>
              <div
                id={`accordion-text-0`}
                role="region"
                aria-labelledby={`accordion-title-0`}
                className={`grid overflow-hidden text-sm text-slate-600 transition-all duration-300 ease-in-out ${
                  accordionOpen6
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-base leading-7 text-gray-300">
                    You can choose between GPT-4 (more accurate) or GPT-3.5
                    (faster).
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <h2>
                <button
                  className="flex w-full items-center justify-between py-2 text-left font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    setAccordionOpen7(!accordionOpen7);
                  }}
                  aria-expanded={accordionOpen7}
                  aria-controls={`accordion-text-0`}
                >
                  <span className="text-base text-white font-semibold leading-7">
                    Are you affiliated with DuckDB Labs?
                  </span>
                  <svg
                    className="ml-8 shrink-0 fill-white"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`ttransform origin-center transition duration-200 ease-out ${
                        accordionOpen7 && "!rotate-180"
                      }`}
                    />
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`origin-center rotate-90 transform transition duration-200 ease-out ${
                        accordionOpen7 && "!rotate-180"
                      }`}
                    />
                  </svg>
                </button>
              </h2>
              <div
                id={`accordion-text-0`}
                role="region"
                aria-labelledby={`accordion-title-0`}
                className={`grid overflow-hidden text-sm text-slate-600 transition-all duration-300 ease-in-out ${
                  accordionOpen7
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-base leading-7 text-gray-300">
                    No, I&#39;m an&nbsp;
                    <a
                      href="https://www.linkedin.com/in/mattholden1/"
                      className="text-blue-600 hover:underline dark:text-blue-500"
                    >
                      independent developer
                    </a>
                    &nbsp; and DuckDB fanboy building a fun product I want to
                    use. It&#39;s only possible because DuckDB is incredibly
                    fast — check it out&nbsp;
                    <a
                      href="https://duckdb.org/"
                      className="text-blue-600 hover:underline dark:text-blue-500"
                    >
                      here
                    </a>
                    &nbsp; here and&nbsp;
                    <a
                      href="https://github.com/duckdb/duckdb"
                      className="text-blue-600 hover:underline dark:text-blue-500"
                    >
                      star them
                    </a>
                    &nbsp; on Github if you dig it.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <h2>
                <button
                  className="flex w-full items-center justify-between py-2 text-left font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    setAccordionOpen8(!accordionOpen8);
                  }}
                  aria-expanded={accordionOpen8}
                  aria-controls={`accordion-text-0`}
                >
                  <span className="text-base text-white font-semibold leading-7">
                    Are you affiliated with DuckDB Labs?
                  </span>
                  <svg
                    className="ml-8 shrink-0 fill-white"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`ttransform origin-center transition duration-200 ease-out ${
                        accordionOpen8 && "!rotate-180"
                      }`}
                    />
                    <rect
                      y="7"
                      width="16"
                      height="2"
                      rx="1"
                      className={`origin-center rotate-90 transform transition duration-200 ease-out ${
                        accordionOpen8 && "!rotate-180"
                      }`}
                    />
                  </svg>
                </button>
              </h2>
              <div
                id={`accordion-text-0`}
                role="region"
                aria-labelledby={`accordion-title-0`}
                className={`grid overflow-hidden text-sm text-slate-600 transition-all duration-300 ease-in-out ${
                  accordionOpen8
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-base leading-7 text-gray-300">
                    We love feedback! You can reach out on&nbsp;
                    <a
                      href="https://twitter.com/holdenmatt"
                      className="text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Twitter
                    </a>
                    &nbsp; or email us at&nbsp;
                    <a
                      href="mailto:help@duckbook.ai?subject=Dynamic%20Subject&body=Dynamic%20Body"
                      className="text-blue-600 hover:underline dark:text-blue-500"
                    >
                      help@duckbook.ai
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default Faq;
