import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React from "react";

import Image from "next/image";

export default function DemoPage() {
  type Link = {
    image: string;
  };
  const fakeData = `Day 1
lalal
Day 2 
alalal`;
  const [step, setStep] = React.useState(2);
  const [city, setCity] = React.useState("");
  const [days, setDays] = React.useState("");

  const [allImages, setAllImages] = React.useState<Link[]>([]);

  const [result, setResult] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const fetchImage = async () => {
    const url = `https://${process.env.NEXT_PUBLIC_OPENAI_API_IMAGE_URL}/images/${city}`;

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_IMAGE_KEY;
    if (!apiKey) {
      console.error("API key is not defined");
      return;
    }

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": `${process.env.NEXT_PUBLIC_OPENAI_API_IMAGE_URL}`,
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
    const url = `https://${process.env.NEXT_PUBLIC_OPENAI_API_CHAT_URL}/ask`;
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_CHAT_KEY;
    if (!apiKey) {
      console.error("API key is not defined");
      return;
    }
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": `${process.env.NEXT_PUBLIC_OPENAI_API_CHAT_URL}`,
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
        <div className="w-full min-h-screen flex flex-col px-4 pt-2 pb-8 md:px-8 md:py-2 bg-[#FCFCFC] relative overflow-hidden"></div>
      ) : (
        <div className="flex flex-col md:flex-row w-full md:overflow-hidden">
          <div className="w-full min-h-[50vh] md:w-1/2 md:h-screen flex flex-col px-4 pt-2  md:px-0 md:py-2 bg-[#FCFCFC] justify-center">
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
                        Back
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
                        Get a plan
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
                  <div className="max-w-lg mx-auto px-4 lg:px-0 text-start">
                    {loading ? (
                      <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.15,
                          duration: 0.95,
                          ease: [0.165, 0.84, 0.44, 1],
                        }}
                        className="relative md:ml-[-10px] md:mb-[65px]  md:mt-[110px]  font-extrabold text-[8vw] md:text-[50px] font-inter text-[#1E2B3A] leading-[0.9] tracking-[-2px] z-[100]"
                      >
                        <span className="text-[#40bf93]">Creating</span>
                        <br />
                        &nbsp;a great&nbsp;
                        <span className="font-inter text-[#407BBF]">
                          plan
                        </span>{" "}
                        ...
                      </motion.h1>
                    ) : (
                      <div className="flex gap-[20px] justify-start ml-3 mt-8">
                        {!loading && (
                          <div>
                            <motion.div
                              onClick={() => setStep(1)}
                              className="group rounded-full px-0 py-2 text-[13px] font-semibold transition-all no-underline active:scale-95 scale-100 duration-75"
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z" />
                              </svg>
                            </motion.div>
                          </div>
                        )}{" "}
                        <h2 className="text-3xl mr-5 font-bold text-[#40bf93]">
                          TRIP TO{" "}
                          <span className="font-inter text-[#407BBF]">
                            {/* {city.toUpperCase()} */}
                            TALLINN
                          </span>
                        </h2>
                      </div>
                    )}

                    <div className="overflow-y-auto max-h-[50vh] my-4 px-0">
                      {/* {result && result.length > 0 && (
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
                      )} */}

                      {/* ////// */}
                      {/* <div className="bg-[#F1F2F4] p-4 rounded-lg shadow-md ">
                        <div
                          className={`text-[14px] leading-[20px] px-8 font-normal my-2`}
                        >
                          {fakeData}
                        </div>
                      </div> */}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <p>Step 3</p>
              )}
            </div>
          </div>

          {allImages.length > 0 ? (
            <div className=" w-full h-[50vh] md:w-1/2 md:h-screen bg-[#F1F2F4] relative overflow-hidden">
              <div className="overflow-y-auto h-full">
                <div className="grid grid-cols-4 md:grid-cols-2 gap-1">
                  {allImages.slice(0, 16).map((image, index) => (
                    <div key={index} className="">
                      <Image
                        src={`${image.image}`}
                        alt={index.toString()}
                        width={700}
                        height={350}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="w-full h-[50vh] md:w-1/2 md:h-screen bg-[#F1F2F4] relative overflow-hidden"
              style={{ userSelect: "none" }}
            >
              <div>
                <svg
                  style={{ filter: "contrast(125%) brightness(110%)" }}
                  className="absolute z-[1] w-full h-full opacity-[35%]"
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
                <div
                  className="flex flex-col justify-center h-[90%] static md:fixed w-screen overflow-hidden grid-rows-[1fr_repeat(3,auto)_1fr] z-[100] 
                pt-[120px] pb-[20px] px-4 md:px-20 md:py-0"
                >
                  {loading ? (
                    <motion.h1
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.15,
                        duration: 0.95,
                        ease: [0.165, 0.84, 0.44, 1],
                      }}
                      className=" relative ml-[100px] sm:ml-[200px] md:ml-[-10px] md:mb-[37px]  md:mt-[137px]
                        font-extrabold text-[8vw] md:text-[50px] font-inter text-[#1E2B3A] leading-[0.9] tracking-[-2px] z-[100]"
                    >
                      <span className="text-[#40bf93]">Taking</span>
                      <br />
                      &nbsp;few&nbsp;
                      <span className="font-inter text-[#407BBF]">
                        pictures
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
                      className="  relative md:ml-[-10px] md:mb-[37px]  md:mt-[137px]  font-extrabold text-[8vw] md:text-[70px] font-inter text-[#1E2B3A] leading-[0.9] tracking-[-2px] z-[100]"
                    >
                      Enter <span className="text-[#40bf93]">days</span>
                      <br />
                      and{" "}
                      <span className="font-inter text-[#407BBF]">place</span>.
                    </motion.h1>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
