import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Log } from '../log';  // Adjust if needed
const TOKEN = "YOUR_ACCESS_TOKEN"; // Replace with your actual token here

// Helper to validate URL format
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper to validate shortcode (alphanumeric and length 3-10)
const isValidShortcode = (sc) => /^[a-zA-Z0-9]{3,10}$/.test(sc);

export default function UrlShortener() {
  const [inputs, setInputs] = useState([
    { url: "", validity: "", shortcode: "", error: "" },
  ]);
  const [results, setResults] = useState([]);

  // Add a new url input group
  const addInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: "", validity: "", shortcode: "", error: "" }]);
    }
  };

  // Remove input group at index
  const removeInput = (idx) => {
    setInputs(inputs.filter((_, i) => i !== idx));
  };

  const handleChange = (idx, field, value) => {
    const newInputs = inputs.map((input, i) =>
      i === idx ? { ...input, [field]: value, error: "" } : input
    );
    setInputs(newInputs);
  };

  // Save URL to localStorage and generate shortcode if needed
  const saveShortUrl = (longUrl, validity, shortcode) => {
    let urls = JSON.parse(localStorage.getItem("shortUrls") || "{}");

    // Validate or generate shortcode
    if (shortcode) {
      if (!isValidShortcode(shortcode)) throw new Error("Shortcode must be alphanumeric and 3-10 chars");
      if (urls[shortcode]) throw new Error("Shortcode already exists");
    } else {
      // Generate shortcode - 5 char random alphanumeric
      do {
        shortcode = Math.random().toString(36).slice(2, 7);
      } while (urls[shortcode]);
    }

    const validMins = parseInt(validity) || 30;
    const expiry = Date.now() + validMins * 60000;

    urls[shortcode] = {
      originalUrl: longUrl,
      created: Date.now(),
      expiry,
      clicks: 0,
      clickDetails: [],
    };

    localStorage.setItem("shortUrls", JSON.stringify(urls));
    return shortcode;
  };

  const handleShorten = async () => {
    let successResults = [];
    let newInputs = [...inputs];
    for (let i = 0; i < inputs.length; i++) {
      const { url, validity, shortcode } = inputs[i];

      // Validate URL
      if (!isValidUrl(url)) {
        newInputs[i].error = "Invalid URL format.";
        continue;
      }

      // Try saving shortcode & URL
      try {
        const sc = saveShortUrl(url, validity, shortcode);
        successResults.push({
          originalUrl: url,
          shortUrl: `${window.location.origin}/${sc}`,
          expiry: new Date(Date.now() + (parseInt(validity) || 30) * 60000).toLocaleString(),
        });
        await Log("frontend", "info", "component", `Shortened URL with shortcode: ${sc}`, TOKEN);
        newInputs[i].error = "";
      } catch (e) {
        newInputs[i].error = e.message;
        await Log("frontend", "error", "component", `Shortcode error: ${e.message}`, TOKEN);
      }
    }
    setResults(successResults);
    setInputs(newInputs);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>

      {inputs.map((input, idx) => (
        <Box key={idx} mb={3} p={2} border="1px solid #ccc" borderRadius={2} position="relative">
          {inputs.length > 1 && (
            <IconButton
              size="small"
              onClick={() => removeInput(idx)}
              sx={{ position: "absolute", top: 8, right: 8 }}>
              <DeleteIcon />
            </IconButton>
          )}
          <TextField
            fullWidth
            label="Long URL"
            value={input.url}
            onChange={(e) => handleChange(idx, "url", e.target.value)}
            margin="normal"
            error={!!input.error && input.error.includes("URL")}
            helperText={input.error && input.error.includes("URL") ? input.error : ""}
          />
          <TextField
            fullWidth
            label="Validity (minutes)"
            value={input.validity}
            onChange={(e) => handleChange(idx, "validity", e.target.value)}
            type="number"
            margin="normal"
            inputProps={{ min: 1 }}
          />
          <TextField
            fullWidth
            label="Custom Shortcode (optional)"
            value={input.shortcode}
            onChange={(e) => handleChange(idx, "shortcode", e.target.value)}
            margin="normal"
            error={!!input.error && input.error.includes("Shortcode")}
            helperText={input.error && input.error.includes("Shortcode") ? input.error : ""}
          />
        </Box>
      ))}

      {inputs.length < 5 && (
        <Button onClick={addInput} variant="outlined" sx={{ mb: 2 }}>
          Add Another URL
        </Button>
      )}

      <Button variant="contained" onClick={handleShorten}>
        Shorten
      </Button>

      {results.length > 0 && (
        <>
          <Typography variant="h5" mt={4} mb={2}>Shortened URLs</Typography>
          {results.map((res, i) => (
            <Box key={i} p={1} mb={1} border="1px solid #ddd" borderRadius={1}>
              <Typography><strong>Original URL:</strong> {res.originalUrl}</Typography>
              <Typography>
                <strong>Short URL:</strong> <a href={res.shortUrl} target="_blank" rel="noreferrer">{res.shortUrl}</a>
              </Typography>
              <Typography><strong>Expires At:</strong> {res.expiry}</Typography>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
