import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback, Key } from "react";

import Image from "next/image";

export default function DemoPage() {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("");
  const [days, setDays] = useState("");

  const [allImages, setAllImages] = useState<string[]>([]);

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchImage = async () => {
    const url = `https://free-images-api.p.rapidapi.com/images/${city}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "1e4258667emsh8f4bba3149f4e45p1af5a3jsnce501d5d7a5e",
        "X-RapidAPI-Host": "free-images-api.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      setAllImages(result.results);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    const url = `https://open-ai25.p.rapidapi.com/ask`;
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "9910ed293fmshc626d3a5c805712p16ba68jsn9bf15c3872aa",
        "X-RapidAPI-Host": "open-ai25.p.rapidapi.com",
      },
      body: JSON.stringify({
        query: `Give me plan for ${days} days when you are staying in ${city}. Do not use any HTML tags in answer. I need it in this format, without any other words from your side:
        ${[...Array(Number(days))]
          .map((_, i) => `Day ${i + 1}\nWhat to do.`)
          .join("\n\n")}`,
      }),
    };

    try {
      fetchImage();
      const response = await fetch(url, options);
      const resultData = await response.json();
      setResult(resultData.response);
    } catch (error) {
      console.error("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const isInputFilled = city.trim() !== "" && days.trim() !== "";

  return (
    <AnimatePresence>
      {step === 3 ? (
        <div className="w-full min-h-screen flex flex-col px-4 pt-2 pb-8 md:px-8 md:py-2 bg-[#FCFCFC] relative overflow-x-hidden"></div>
      ) : (
        <div className="flex flex-col md:flex-row w-full md:overflow-hidden">
          <div className="w-full min-h-[60vh] md:w-1/2 md:h-screen flex flex-col px-4 pt-2 pb-8 md:px-0 md:py-2 bg-[#FCFCFC] justify-center">
            <div className="h-full w-full items-center justify-center flex flex-col">
              {step === 1 ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  key="step-1"
                  transition={{
                    duration: 0.95,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                  className="max-w-lg mx-auto px-4 lg:px-0"
                >
                  <div className="max-w-lg mx-auto px-4 lg:px-0 text-center">
                    <label
                      htmlFor="cityInput"
                      className="text-[15px] leading-[20px] text-[#1a2b3b] font-bold my-4"
                    >
                      <input
                        id="cityInput"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Place for visit"
                        className="bg-[#FCFCFC] text-center ml-2 border-b-2 p-5 border-gray-400 focus:outline-none focus:border-[#ff8000]"
                      />
                    </label>{" "}
                    <br /> <br />
                    <label
                      htmlFor="daysInput"
                      className="text-[15px] leading-[20px] text-[#1a2b3b] font-bold my-4"
                    >
                      <input
                        id="daysInput"
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        placeholder="Days of stay"
                        className="bg-[#FCFCFC] text-center ml-2 border-b-2 p-3 border-gray-400 focus:outline-none focus:border-[#ff8000]"
                      />
                    </label>
                    <br /> <br />
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.65,
                        duration: 0.55,
                        ease: [0.075, 0.82, 0.965, 1],
                      }}
                      className="flex  gap-[80px] mt-10"
                    >
                      <Link
                        href="/"
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                        style={{
                          boxShadow:
                            "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #ff8000, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          transform="scale(-1, 1)"
                        >
                          <path
                            d="M13.75 6.75L19.25 12L13.75 17.25"
                            stroke="#1E2B3A"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 12H4.75"
                            stroke="#1E2B3A"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <span className="ml-2 color"> Back </span>
                      </Link>

                      <button
                        onClick={() => {
                          setStep(2);
                          fetchData();
                        }}
                        disabled={!isInputFilled}
                        className={`group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75 ${
                          isInputFilled ? "" : "opacity-50 cursor-not-allowed"
                        }`}
                        style={{
                          boxShadow:
                            "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <span> Get a plan </span>
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : step === 2 ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  key="step-2"
                  transition={{
                    duration: 0.95,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                  className="max-w-lg mx-auto px-4 lg:px-0"
                >
                  <div className="max-w-lg mx-auto px-4 lg:px-0 text-center">
                    {loading ? (
                      <h2 className="text-4xl font-bold text-[#40bf93]">
                        Loading...
                      </h2>
                    ) : (
                      <h2 className="text-4xl font-bold text-[#40bf93]">
                        TRIP TO {city.toUpperCase()}
                      </h2>
                    )}

                    <div className="overflow-y-auto max-h-[60vh] my-4 px-4">
                      {result && result.length > 0 && (
                        <div className="bg-[#F1F2F4] p-4 rounded-lg shadow-md">
                          {result.split("\n").map((line, index) => (
                            <div
                              key={index}
                              className={`text-[14px] leading-[20px] font-normal my-2 ${
                                line.startsWith("Day")
                                  ? "text-[#407BBF]"
                                  : "text-[#1a2b3b]"
                              }`}
                              style={{ textAlign: "start" }}
                            >
                              {line.trim()}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-[5px] justify-start ml-3 mt-8">
                      <div>
                        <motion.div
                          onClick={() => setStep(1)}
                          className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                          style={{
                            cursor: "pointer",
                            boxShadow:
                              "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #ff8000, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            transform="scale(-1, 1)"
                          >
                            <path
                              d="M13.75 6.75L19.25 12L13.75 17.25"
                              stroke="#1E2B3A"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19 12H4.75"
                              stroke="#1E2B3A"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          <span className="ml-2 color"> Back </span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <p>Step 3</p>
              )}
            </div>
          </div>

          {allImages.length > 0 ? (
            <div className="w-full h-[40vh] md:w-1/2 md:h-screen bg-[#F1F2F4] relative overflow-hidden">
              <div className="grid grid-cols-4 md:grid-cols-2 gap-1 overflow-y-auto">
                {allImages.slice(0, 16).map((images, index) => (
                  <div key={index} className="overflow-hidden">
                    <Image
                      src={images.image}
                      alt={index.toString()}
                      width={700}
                      height={350}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="w-full h-[40vh] md:w-1/2 md:h-screen bg-[#F1F2F4] relative overflow-hidden"
              style={{ userSelect: "none" }}
            >
              <div>
                <svg
                  style={{ filter: "contrast(125%) brightness(110%)" }}
                  className="fixed z-[1] w-full h-full opacity-[35%]"
                >
                  <filter id="noise">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency=".7"
                      numOctaves="3"
                      stitchTiles="stitch"
                    ></feTurbulence>
                    <feColorMatrix type="saturate" values="0"></feColorMatrix>
                  </filter>
                  <rect width="100%" height="100%" filter="url(#noise)"></rect>
                </svg>
                <main className="flex flex-col justify-center h-[90%] static md:fixed w-screen overflow-hidden grid-rows-[1fr_repeat(3,auto)_1fr] z-[100] pt-[30px] pb-[320px] px-4 md:px-20 md:py-0">
                  {loading ? (
                    <motion.h1
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.15,
                        duration: 0.95,
                        ease: [0.165, 0.84, 0.44, 1],
                      }}
                      className=" relative md:ml-[-10px] md:mb-[37px]  md:mt-[137px]  font-extrabold text-[16vw] md:text-[50px] font-inter text-[#1E2B3A] leading-[0.9] tracking-[-2px] z-[100]"
                    >
                      <span className="text-[#40bf93]">Creating</span>
                      &nbsp;a&nbsp;
                      <span className="font-inter text-[#407BBF]">
                        plan
                      </span>{" "}
                      ...
                    </motion.h1>
                  ) : (
                    <motion.h1
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.15,
                        duration: 0.95,
                        ease: [0.165, 0.84, 0.44, 1],
                      }}
                      className=" relative md:ml-[-10px] md:mb-[37px]  md:mt-[137px]  font-extrabold text-[16vw] md:text-[70px] font-inter text-[#1E2B3A] leading-[0.9] tracking-[-2px] z-[100]"
                    >
                      Enter <span className="text-[#40bf93]">place</span>
                      <br />
                      and{" "}
                      <span className="font-inter text-[#407BBF]">days</span>.
                    </motion.h1>
                  )}
                  <div className="flex gap-[15px] mt-8 md:mt-0"></div>
                </main>
              </div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
