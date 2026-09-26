function analyzeURL(urlString) {
  let feedback = [];
  let isSuspicious = false;
  let parsedUrl;

  if (!urlString || urlString.trim() === "") {
    return { valid: false, feedback: ["Enter a URL to analyze."], isSuspicious: false };
  }

  // Ensure URL has a protocol for parsing
  let toParse = urlString;
  if (!/^https?:\/\//i.test(urlString)) {
    toParse = "http://" + urlString;
    feedback.push("Note: No protocol provided, assuming HTTP/HTTPS.");
  }

  try {
    parsedUrl = new URL(toParse);
  } catch (e) {
    return { valid: false, feedback: ["Invalid URL format."], isSuspicious: false };
  }

  // Check Protocol
  if (parsedUrl.protocol === "http:") {
    isSuspicious = true;
    feedback.push("Uses HTTP instead of HTTPS (connection is not secure).");
  } else if (parsedUrl.protocol === "https:") {
    feedback.push("Uses secure HTTPS connection.");
  } else {
    isSuspicious = true;
    feedback.push("Uses an unusual protocol: " + parsedUrl.protocol);
  }

  // Check IP Address
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipPattern.test(parsedUrl.hostname)) {
    isSuspicious = true;
    feedback.push("Uses an IP address instead of a domain name (common in phishing).");
  }

  // Check excessive subdomains
  const parts = parsedUrl.hostname.split('.');
  if (parts.length > 3 && !ipPattern.test(parsedUrl.hostname)) {
    isSuspicious = true;
    feedback.push("Contains excessive subdomains, which can be used to obfuscate the real domain.");
  }

  // Check length
  if (urlString.length > 75) {
    feedback.push("URL is unusually long (might be hiding suspicious parameters).");
  }

  // Check common suspicious keywords
  const suspicousKeywords = ["login", "verify", "secure", "update", "account", "banking"];
  const containsSuspiciousKeyword = suspicousKeywords.some(kw => urlString.toLowerCase().includes(kw));
  if(containsSuspiciousKeyword) {
     feedback.push("Contains keywords common in phishing (e.g., login, verify, secure). Ensure the domain is correct.");
  }

  return {
    valid: true,
    isSuspicious,
    feedback,
    domain: parsedUrl.hostname
  };
}

// Ensure it can be used in Node.js (for Jest) or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { analyzeURL };
}
