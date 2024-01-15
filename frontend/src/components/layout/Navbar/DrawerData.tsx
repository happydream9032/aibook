"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Data = () => {
  const router = useRouter();

  return (
    <div className="rounded-md max-w-sm w-full h-full">
      <div className="flex-1 justify-between py-7">
        <div className="sm:block">
          <div>
            <div style={{ padding: 20 }}>
              <h1 style={{ fontWeight: "bold" }}>Hello World! 🚀🥳</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;
