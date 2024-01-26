import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="relative isolate pt-4">
      <div className="py-10 sm:py-16 lg:pb-24">
        <div className="mx-auto max-w-4xl px-2 md:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              The DuckDB notebook
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              DataBook is an AI-powered SQL notebook that runs in your browser.
              Use DuckDB and GPT-4 to explore and visualize data remarkably
              fast.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                className="rounded-sm bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                href="/edit"
              >
                Try it - It&#39;s free
              </a>
              <a
                href="#features"
                className="text-sm font-semibold leading-6 text-white"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <video
            autoPlay
            loop
            muted
            className="mx-auto mt-12 rounded-md"
            style={{ width: "100%" }}
          >
            <source
              src="http://duckbook.ai/hero-social-4k-20fps.mp4"
              type="video/mp4"
            />
          </video>

          {/* <Image
				src="/images/Dashboard.png"
				alt="Dashboard"
				width={1200}
				height={852}
			/> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
