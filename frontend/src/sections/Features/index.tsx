import Image from "next/image";
import Link from "next/link";
const Features = () => {
  return (
    <>
      <section id="features" className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-500">
              Our Approach
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl sm:text-4xl">
              You own your data
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              DataBook combines two powerful technologies: DuckDB &amp;
              GPT-4.&nbsp;
              <br />
              But <i>you</i> own your data — it lives on your machine, not on
              our servers.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Image
                    alt="DuckDB favicon"
                    loading="lazy"
                    width="32"
                    height="32"
                    decoding="async"
                    data-nimg="1"
                    className="h-5 w-5 flex-none text-indigo-500"
                    src="/images/feature/duckdb-favicon-32x32.png"
                  />
                  <div className="text-base font-semibold sm:text-lg">
                    Quacks DuckDB
                  </div>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-700">
                  <p className="flex-auto text-sm sm:text-base">
                    <Link
                      className="text-indigo-400"
                      target="_blank"
                      href="https://duckdb.org/"
                    >
                      DuckDB
                    </Link>
                    &nbsp; is a lightning fast analytics database that can run
                    almost anywhere, including in your browser. Crunch millions
                    of rows instantly, with nothing to install or maintain.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 flex-none text-indigo-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    ></path>
                  </svg>
                  <div className="text-base font-semibold sm:text-lg">
                    Write SQL faster with AI
                  </div>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-700 ">
                  <p className="flex-auto text-sm sm:text-base">
                    Use GPT-4 to translate natural language prompts to SQL. But
                    you are in control — see your query, tweak it, chart it.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 flex-none text-indigo-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    ></path>
                  </svg>
                  <div className="text-base font-semibold sm:text-lg">
                    Secure &amp; private by default
                  </div>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-700 ">
                  <p className="flex-auto text-sm sm:text-base">
                    All data is stored&nbsp;
                    <Link
                      className="text-indigo-400"
                      target="_blank"
                      href="https://www.inkandswitch.com/local-first/"
                    >
                      locally
                    </Link>
                    &nbsp;
                    <b>in your browser</b>, and is not sent to or stored on
                    DataBook servers. If you use AI, a small amount of data is
                    sent to OpenAI. See our&nbsp;
                    <a className="text-indigo-400" href="/#faq">
                      FAQ
                    </a>
                    &nbsp; for more details.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
