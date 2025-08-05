// frontend-test-submission/components/UrlShortener.js
import React, { useState } from 'react';
import { Log } from '../../logging-middleware/log'; // adjust path as needed

function UrlShortener({ accessToken }) {
  const [url, setUrl] = useState("");

  const handleShorten = async () => {
    try {
      // You would usually send an API request here
      // await axios.post(...);
      // Assume it succeeded:
      await Log(
        "frontend",       // stack
        "info",           // level
        "component",      // package
        "Shortened URL successfully created", // message
        accessToken       // pass the token here
      );
      // Optionally update UI state
    } catch (err) {
      await Log(
        "frontend",
        "error",
        "component",
        "Failed to shorten URL: " + err.message,
        accessToken
      );
    }
  };

  return (
    <div>
      <input 
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Enter long URL"
      />
      <button onClick={handleShorten}>Shorten</button>
    </div>
  );
}

export default UrlShortener;
