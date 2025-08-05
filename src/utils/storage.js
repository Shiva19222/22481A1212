export function saveShortUrl(longUrl, validity, shortcode) {
  const urls = JSON.parse(localStorage.getItem('shortUrls') || '{}');
  if(!shortcode) {
    shortcode = Math.random().toString(36).substr(2,5);
    while(urls[shortcode]) shortcode = Math.random().toString(36).substr(2,5);
  }
  if(urls[shortcode]) throw new Error('Shortcode collision');
  const minutes = parseInt(validity) || 30;
  const expiry = Date.now() + minutes * 60 * 1000;
  urls[shortcode] = { originalUrl: longUrl, expiry, created: Date.now(), clicks: 0, clickDetails: [] };
  localStorage.setItem('shortUrls', JSON.stringify(urls));
  return shortcode;
}
