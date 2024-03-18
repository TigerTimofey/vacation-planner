"use client";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { Image } from "@nextui-org/react";

export function OpenAsk() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState("");
  const [imageOfPlace, setImageOfPlace] = useState("");
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
      setImageOfPlace(result.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    const url = `https://open-ai25.p.rapidapi.com/ask`;
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",

        // "X-RapidAPI-Key": "1e4258667emsh8f4bba3149f4e45p1af5a3jsnce501d5d7a5e",
        "X-RapidAPI-Key": "856a183bd7msh73dbc1541eb155dp179c80jsn1c3b3f537089",
        "X-RapidAPI-Host": "open-ai25.p.rapidapi.com",
      },
      body: JSON.stringify({
        query: `Give me plan for ${days} when you staying in ${city}. It should be in format: Day number and what to do from new. Also you shoud friend special tips for each day from new line and call it ' Tip'.`,
      }),
    };

    try {
      fetchImage();
      const response = await fetch(url, options);
      const resultData = await response.text();
      const formattedResult = formatResult(resultData);
      setResult(formattedResult);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const formatResult = (data: any) => {
    const cleanedData = data.replace(/\\n/g, "").replace(/"}/g, "");
    const cleanedResult = cleanedData.replace(/-\s/g, "");
    const resultWithDots = cleanedResult.replace(/(Day \d+)([^\d]+)/g, "$1$2 ");
    const finalResult = resultWithDots.replace(
      "Let me know if you need more suggestions.",
      ""
    );
    return finalResult;
  };

  const isInputFilled = city.trim() !== "" && days.trim() !== "";

  return (
    <div
      className="overlay"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <h1>VACATION PLANNER</h1>
        <h2>choose place and days of stay</h2>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ margin: "50px" }}>
            <Card
              sx={{
                display: "inline-block",
                marginBottom: "20px",
                transform: "scale(1.2)",
              }}
            >
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Stack spacing={2}>
                  <TextField
                    hiddenLabel
                    id="filled-hidden-label-normal"
                    placeholder="PLACE"
                    variant="outlined"
                    inputProps={{ style: { textAlign: "center" } }}
                    size="small"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <TextField
                    hiddenLabel
                    id="filled-hidden-label-normal"
                    placeholder="DAYS"
                    inputProps={{ style: { textAlign: "center" } }}
                    size="small"
                    variant="outlined"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  />
                </Stack>

                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  className="mt-5"
                >
                  <Button
                    sx={{ marginTop: "30px" }}
                    size="small"
                    variant="contained"
                    color="warning"
                    // fullWidth
                    onClick={fetchData}
                    disabled={!isInputFilled}
                  >
                    Get Data
                  </Button>
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <div className="overlay-2">
            <Grid item xs={12}>
              {loading && (
                <CircularProgress
                  sx={{ marginTop: "30px", textAlign: "center" }}
                  color="inherit"
                />
              )}
              {result.length > 0 && (
                <>
                  {result.split("Day").map(
                    (dayInfo, index) =>
                      index !== 0 && (
                        <Card
                          key={index}
                          sx={{
                            display: "flex",
                            margin: "10px",
                            borderRadius: "10px",
                          }}
                        >
                          {imageOfPlace[index - 1] && (
                            <Image
                              src={imageOfPlace[index - 1].image}
                              alt="Image of the place"
                              className="Hidden"
                              width={150}
                              height={160}
                              style={{
                                objectFit: "cover",
                                // width: "50%",
                                height: "100%",
                              }}
                            />
                          )}

                          <CardContent sx={{ wordWrap: "break-word" }}>
                            <Typography component="div" variant="subtitle1">
                              <div
                                style={{ textAlign: "start", padding: "50px" }}
                                dangerouslySetInnerHTML={{
                                  __html: "Day" + dayInfo.replace("-", ""),
                                }}
                              />
                            </Typography>
                          </CardContent>
                        </Card>
                      )
                  )}
                </>
              )}{" "}
            </Grid>
          </div>
        </Grid>{" "}
      </div>
    </div>
  );
}

export default OpenAsk;
