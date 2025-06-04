import axiosapi from "./axiosInstance";

export const getCurrentWeather = async (city) => {
  try {
    const res = await axiosapi.get(`Weather/current/date?city=${city}`);
    return res.data;
  } catch (err) {
    throw new Error("Failed to fetch current weather");
  }
};

export const getWeatherHistory = async (city, fromDate, toDate) => {
  try {
    const res = await axiosapi.get(
      `Weather/history/from-date/to-date?city=${city}&fromdate=${fromDate}&todate=${toDate}`
    );
    return res.data;
  } catch (err) {
    throw new Error("Failed to fetch historical weather");
  }
};