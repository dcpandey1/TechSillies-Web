export const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    const full = url.toLowerCase();

    // 1️⃣ Must be HTTPS only
    if (parsed.protocol !== "https:") return false;

    // 2️⃣ Must contain a real domain with at least 1 dot
    if (!hostname.includes(".")) return false;

    // 3️⃣ Block harmful keywords (sexual, drugs, gambling)
    const bannedWords = [
      "porn",
      "xxx",
      "sex",
      "adult",
      "escort",
      "fetish",
      "bdsm",
      "onlyfans",
      "nude",
      "hotgirl",
      "mms",
      "xvideos",
      "pornhub",

      "casino",
      "bet",
      "gambling",
      "lottery",
      "stake",

      "drug",
      "pill",
      "viagra",
      "pharma",
      "steroid",

      "scam",
      "fraud",
      "hacker",
      "crack",
      "hacktool",
    ];
    if (bannedWords.some((w) => full.includes(w))) return false;

    // 4️⃣ Block suspicious TLDs
    const bannedTLDs = [
      "xyz",
      "top",
      "click",
      "zip",
      "kim",
      "win",
      "bid",
      "loan",
      "download",
      "gq",
      "ml",
      "cf",
      "ga",
      "mom",
      "adult",
    ];
    const tld = hostname.split(".").pop();
    if (bannedTLDs.includes(tld)) return false;

    // 5️⃣ Block URL shorteners
    const shorteners = [
      "bit.ly",
      "tinyurl.com",
      "t.co",
      "goo.gl",
      "shorturl.at",
      "rebrand.ly",
      "is.gd",
      "buff.ly",
      "cutt.ly",
    ];
    if (shorteners.some((s) => hostname.includes(s))) return false;

    // 6️⃣ Block social media links (optional but recommended)
    const social = ["instagram.com", "facebook.com", "tiktok.com", "snapchat.com", "porn", "x.com"];
    if (social.some((s) => hostname.includes(s))) return false;

    // 7️⃣ Prevent extremely long suspicious URLs
    if (url.length > 350) return false;

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
