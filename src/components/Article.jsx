import { useLocation, Link } from "react-router-dom";
import parse from "html-react-parser";

const Article = () => {
  const { state } = useLocation();
  const article = state?.article;

  // Format publication date
  const formatDate = (pubDate) => {
    const date = new Date(pubDate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Custom parser options to style HTML tags
  const transform = (node, index) => {
    // Handle text nodes
    if (node.type === "text") {
      return node.data;
    }

    // Handle tag nodes
    if (node.type === "tag") {
      const children = node.children
        .map((child, i) => {
          // Text node
          if (child.type === "text") {
            return child.data;
          }
          // Tag node (handled by transform)
          if (child.type === "tag") {
            return transform(child, `${index}-${i}`); // Pass unique key
          }
          return null;
        })
        .filter(Boolean); // Remove null values

      switch (node.name) {
        case "h1":
        case "h2":
        case "h3":
          return (
            <h2 key={index} className="text-2xl font-bold text-gray-100 mt-6 mb-10">
              {children}
            </h2>
          );
        case "h4":
          return (
            <h3 key={index} className="text-xl font-semibold text-gray-100 mt-5 mb-3">
              {children}
            </h3>
          );
        case "p":
          return (
            <p key={index} className="text-base text-gray-300 mb-4">
              {children}
            </p>
          );
        case "img":
          return (
            <img
              key={index}
              src={node.attribs.src}
              className="w-full h-auto rounded-lg my-4"
              loading="lazy"
            />
          );
        case "a":
          return (
            <a
              key={index}
              href={node.attribs.href}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        case "pre":
          return (
            <pre
              key={index}
              className="bg-gray-300 p-4 h-20 rounded-lg text-sm font-mono text-gray-800 overflow-x-auto my-4"
            >
              {children}
            </pre>
          );
        case "strong":
          return (
            <strong key={index} className="font-bold mt-5 mb-5 h-16">
              {children}
            </strong>
          );
        case "ul":
          return (
            <ul key={index} className="list-disc list-inside text-gray-700 mb-4">
              {node.children
                .filter((child) => child.type === "tag" && child.name === "li")
                .map((child, i) => (
                  <li key={`${index}-${i}`} className="mb-1">
                    {child.children
                      .map((grandchild, j) => {
                        if (grandchild.type === "text") {
                          return grandchild.data;
                        }
                        if (grandchild.type === "tag") {
                          return transform(grandchild, `${index}-${i}-${j}`);
                        }
                        return null;
                      })
                      .filter(Boolean)}
                  </li>
                ))}
            </ul>
          );
        default:
          return null; // Skip unhandled tags
      }
    }

    return null; // Skip other node types
  };

  if (!article) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Article Not Found</h2>
        <Link to="/blogs" className="text-blue-600 hover:underline">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="relative px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/blogs" className="text-secondary hover:underline mb-6 inline-block">
          ← Back to Blogs
        </Link>
        <article className="rounded-lg shadow-lg shadow-gray-950  mx-auto bg-slate-800/20 backdrop-blur-sm border-slate-800 p-4 sm:p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold  sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {article.title}
            </h1>
            <div className="mt-4 flex items-center">
              {/* <img className="h-10 w-10 rounded-full" src={dp_image} alt={`${article.author}'s profile`} /> */}
              <div className="ml-3">
                <p className="text-lg font-medium text-gray-400">{article.author}</p>
                <p className="text-sm text-gray-500">
                  <time dateTime={article.pubDate}>{formatDate(article.pubDate)}</time>
                </p>
              </div>
            </div>
          </header>
          <div className="prose prose-lg max-w-none">{parse(article.content, { replace: transform })}</div>
        </article>
      </div>
    </div>
  );
};

export default Article;
