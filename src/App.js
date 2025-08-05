import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import UrlShortener from "./components/UrlShortener";
import StatsPage from "./components/StatsPage";
import { saveShortUrl } from "./utils/storage";
import { Log } from './log';  // Correct import

const TOKEN = "PUT_YOUR_ACCESS_TOKEN_HERE"; // Replace this with actual token

function RedirectHandler() {
  let { shortcode } = useParams();
  const urls = JSON.parse(localStorage.getItem('shortUrls') || '{}');
  if (urls[shortcode]) {
    urls[shortcode].clicks = (urls[shortcode].clicks || 0) + 1;
    localStorage.setItem('shortUrls', JSON.stringify(urls));
    Log("frontend", "info", "component", `Redirected for shortcode: ${shortcode}`, TOKEN);
    window.location.href = urls[shortcode].originalUrl;
    return <div>Redirecting...</div>;
  }
  return <div>Shortcode not found</div>;
}

function App() {
  const handleShorten = (url, validity, shortcode) => {
    try {
      const sc = saveShortUrl(url, validity, shortcode);
      alert(`Short URL: ${window.location.origin}/${sc}`);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UrlShortener onShorten={handleShorten} logFn={Log} token={TOKEN} />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/:shortcode" element={<RedirectHandler />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
