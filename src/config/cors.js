const createCorsOptions = () => {
  const origins =
    process.env.CLIENT_ORIGINS ||
    process.env.CLIENT_ORIGIN ||
    "http://localhost:5173";

  return {
    origin: origins
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  };
};

module.exports = createCorsOptions;
