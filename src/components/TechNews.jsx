import React, { useState, useEffect } from "react";

export default function RedditNews() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubreddit, setSelectedSubreddit] = useState("frontend");

  const subreddits = [
    { name: "reactjs", label: "ReactJS" },
    { name: "webdev", label: "WebDev" },
    { name: "frontend", label: "Frontend" },
    { name: "javascript", label: "JavaScript" },
  ];

const fetchPosts = async (subreddit) => {
  setLoading(true);

  const encodedURL = encodeURIComponent(`https://www.reddit.com/r/${subreddit}/new.json`);
  const proxyURL = `https://api.allorigins.win/get?url=${encodedURL}`;

  try {
    const response = await fetch(proxyURL);
    const result = await response.json();
    const data = JSON.parse(result.contents); // Reddit JSON inside 'contents'

    setPosts(data.data.children);
    console.log(data.data.children);
    
  } catch (error) {
    console.error("Error fetching posts:", error);
    setPosts([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchPosts(selectedSubreddit);
  }, [selectedSubreddit]);

  const formatTime = (timestamp) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;

    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Latest from r/{selectedSubreddit}
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {posts.map((post) => {
            const data = post.data;
            return (
              <div
                key={data.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                    <a
                      href={`https://reddit.com${data.permalink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {data.title}
                    </a>
                  </h2>
                  <span className="text-sm text-gray-500 ml-4 flex-shrink-0">
                    {formatTime(data.created_utc)}
                  </span>
                </div>

                {data.selftext && (
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                    {truncateText(data.selftext)}
                  </p>
                )}

                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <span>👤 u/{data.author}</span>
                  <span>⬆️ {data.score}</span>
                  <span>💬 {data.num_comments}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center">
        {subreddits.map((subreddit) => (
          <button
            key={subreddit.name}
            onClick={() => setSelectedSubreddit(subreddit.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedSubreddit === subreddit.name
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {subreddit.label}
          </button>
        ))}
      </div>
    </div>
  );
};
