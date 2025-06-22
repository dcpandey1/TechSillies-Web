import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dp_image from "../assests/dp_image.jpeg";

const Blogs = () => {
  const medium_API = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@dcpandey0";
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Strip HTML tags for preview
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Truncate text for preview
  const truncateText = (text, maxLength) => {
    const strippedText = stripHtmlTags(text);
    if (strippedText.length <= maxLength) return strippedText;
    const truncated = strippedText.substring(0, maxLength);
    return truncated.substring(0, truncated.lastIndexOf(" ")) + "...";
  };

  // Extract image with fallback
  const getImageSrc = (description) => {
    const match = description.match(/<img[^>]+src="([^"]+)"/);
    return match ? match[1] : "https://via.placeholder.com/1679x400?text=No+Image";
  };

  // Format publication date
  const formatDate = (pubDate) => {
    const date = new Date(pubDate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(medium_API);
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data.items.reverse());
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Shimmer skeleton
  const shimmerSkeleton = (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg animate-pulse">
      <div className="flex-shrink-0">
        <div className="h-48 w-full bg-gray-800"></div>
      </div>
      <div className="flex flex-1 flex-col justify-between bg-gray-700 p-6">
        <div className="flex-1">
          <div className="h-4 w-1/4 bg-gray-800 rounded mb-2"></div>
          <div className="h-6 w-3/4 bg-gray-800 rounded mb-3"></div>
          <div className="h-4 w-full bg-gray-800 rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-gray-800 rounded"></div>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-900"></div>
          </div>
          <div className="ml-3">
            <div className="h-4 w-1/2 bg-gray-700 rounded mb-1"></div>
            <div className="h-3 w-1/3 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative px-6 pt-16 pb-20 lg:px-8 lg:pt-10 lg:pb-28">
      <div className="absolute inset-0">
        <div className="h-1/3 sm:h-2/3"></div>
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Blogs
          </h2>
          {/* <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            This is your life and it’s ending one minute @ a time...
          </p> */}
        </div>
        {error && <div className="text-center text-red-500 mt-6">Error: {error}</div>}
        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <div key={index}>{shimmerSkeleton}</div>)
            : articles.map((post, index) => (
                <Link
                  key={index}
                  to={`/blogs/${post.guid.split("/").pop()}`} // Use guid as unique ID
                  state={{ article: post }} // Pass article data via state
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg shadow-gray-950 bg-slate-800/20 backdrop-blur-sm border-slate-800"
                >
                  <div className="flex-shrink-0">
                    <img
                      className="h-52 w-full object-cover"
                      src={getImageSrc(post.description)}
                      alt={post.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between  p-6">
                    <div className="flex-1">
                      <p className="inline-block text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full shadow-sm">
                        {post.categories[0] || "Article"}
                      </p>
                      <div className="mt-2 block">
                        <p className="text-xl font-semibold text-slate-400">{post.title}</p>
                        <p className="mt-3 text-base text-gray-400">{truncateText(post.content, 100)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <div className="flex-shrink-0">
                        <span className="sr-only">{post.author}</span>
                        <img
                          className="h-10 w-10 rounded-full"
                          src={dp_image}
                          alt={`${post.author}'s profile`}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-slate-400">{post.author}</p>
                        <div className="flex space-x-1 text-sm text-gray-500">
                          <time dateTime={post.pubDate}>{formatDate(post.pubDate)}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
