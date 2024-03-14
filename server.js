import express from "express";
import fetch from "node-fetch";
import url from "url"; // Import the URL module to help with parsing

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Proxy endpoint
app.get("/api/proxy", async (req, res) => {
  const targetUrl = req.query.url; // The 100ms API URL
  const managementToken = req.query.token; // Management token if required

  // Remove 'url' and 'token' from the query parameters
  const { url: _, token: __, ...restQueryParams } = req.query;

  // Construct the new query string from remaining query parameters
  const queryString = new URLSearchParams(restQueryParams).toString();

  // Check if the target URL already contains a query string
  const separator = targetUrl.includes("?") ? "&" : "?";
  const finalUrl = `${targetUrl}${separator}${queryString}`;

  try {
    const response = await fetch(finalUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${managementToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
