import React, { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaCloud } from "react-icons/fa";
import axiosapi from "../api/axiosinstance";

const WeatherComponent = () => {
  const [city, setCity] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  const getCurrentWeather = async (city) => {
    const res = await axiosapi.get(`/Weather/current/date?city=${city}`);
    return res.data;
  };


  const getWeatherHistory = async (city, fromDate, toDate) => {
    const res = await axiosapi.get(
      `/Weather/history/from-date/to-date?city=${city}&fromdate=${fromDate}&todate=${toDate}`
    );
    return res.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setData(null);
    setHistory([]);

    if (!city) {
      setError("Please enter a city");
      return;
    }

    try {
      const currentJson = await getCurrentWeather(city);
      if (currentJson.statusCode === 200) {
        setData(currentJson.data);
      } else {
        setError(currentJson.message || "Failed to fetch current weather");
      }

      if (fromDate && toDate) {
        const historyJson = await getWeatherHistory(city, fromDate, toDate);
        if (historyJson.statusCode === 200) {
          setHistory(historyJson.data);
        } else {
          setError(historyJson.message || "Failed to fetch historical weather");
        }
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-orange-100">
      <div
        className="min-h-screen w-full bg-cover bg-center flex flex-wrap justify-center"
        style={{ backgroundImage: "url(/pexels-madzery-32310551.jpg)" }}
      >
        <div className="w-11/12 min-h-screen">
          <div className="w-full flex flex-col md:flex-row h-full items-center gap-4 py-10">
         
            <div
              className="w-full md:w-1/3  max-w-xs md:max-w-md p-3 rounded-2xl text-center border-gray-200 shadow-lg flex flex-col items-center justify-between"
              style={{ backgroundColor: "rgba(247, 214, 152, 0.6)" }}
            >
              <div className="flex items-center justify-center mb-3">
                <p className="text-3xl font-bold ">Today</p>
               
              </div>

              <form onSubmit={handleSubmit} className="w-full mb-4">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  className="w-full p-2 rounded border border-gray-300 bg-orange-300 mb-2"
                />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 bg-orange-300 mb-2"
                  max={toDate || ""}
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 bg-orange-300 mb-2"
                  min={fromDate || ""}
                />
                <button
                  type="submit"
                  className="mt-2 w-full bg-blue-500 text-white p-2 rounded"
                >
                  Get Weather
                </button>
              </form>

              {error && <p className="text-red-500">{error}</p>}

              {data ? (
                <>
                  <img
                    src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                    alt={data.description}
                    className="mx-auto w-16 h-16"
                  />
                  <h1 className="text-6xl font-bold ml-4 text-orange-500">
                    {Math.round(data.temperature)}°C
                  </h1>
                  <h1 className="text-center text-lg md:text-2xl mt-4 font-bold text-orange-500">
                    {data.description}
                  </h1>
                  <p className="text-lg md:text-2xl mt-4 text-orange-500">
                    {data.city}
                  </p>
                  <p className="text-base md:text-xl mt-4 text-orange-500">
                    {formatDate(data.date)}
                  </p>
                </>
              ) : (
                !error && <p>Enter city and dates to see weather info</p>
              )}
            </div>

          
            <div className="w-full md:w-8/12 h-auto p-4">
              <div className="w-full rounded-xl p-3 bg-[#f7d698] bg-opacity-40 border-gray-100">
                <div className="flex flex-wrap justify-center gap-8">
                  {history.length > 0 ? (
                    history.map((x, index) => (
                      <div
                        key={index}
                        className="text-white sm:w-24 md:w-28 lg:w-20 p-2 flex flex-col items-center justify-center rounded-lg bg-orange-400 bg-opacity-70"
                      >
                        <p className="text-xs md:text-sm font-bold">
                          {formatDate(x.date)}
                        </p>
                        <img
                         src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                          alt={x.description}
                          className="mx-auto w-10 h-10"
                        />
                        <div className="flex items-center mt-1">
                          <FaCloud className="text-white w-4 h-4 md:w-6 md:h-6 mr-1" />
                          <p className="text-sm md:text-base">
                            {Math.round(x.temperature)}°C
                          </p>
                        </div>
                        <p className="text-xs mt-1">{x.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-white">No historical data to display</p>
                  )}
                </div>
              </div>

              <div className="w-full mt-8">
                <p className="text-xl md:text-2xl text-white mb-2">Random Text</p>
                <p className="text-sm md:text-lg text-white">
                  Improve him believe opinion offered met and end cheered
                  forbade. Friendly as stronger speedily by recurred. Son
                  interest wandered sir addition end say. Manners beloved
                  affixed picture men ask.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
