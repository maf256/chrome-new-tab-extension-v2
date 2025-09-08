import React, { useState, useEffect } from "react";

export default function RedditNews() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubreddit, setSelectedSubreddit] = useState("technology");

  const subreddits = [
    { name: "technology", label: "Tech" },
    { name: "programming", label: "Programming" },
    { name: "webdev", label: "WebDev" },
    { name: "reactjs", label: "React" },
    { name: "javascript", label: "JS" },
    { name: "MachineLearning", label: "ML" },
  ];

  const fetchPosts = async (subreddit) => {
    setLoading(true);

    try {
      const proxyServices = [
        `https://corsproxy.io/?https://www.reddit.com/r/${subreddit}/hot.json?limit=10`,
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`
        )}`,
        `https://cors-anywhere.herokuapp.com/https://www.reddit.com/r/${subreddit}/hot.json?limit=10`,
      ];

      let data = null;
      let lastError = null;

      for (const proxyURL of proxyServices) {
        try {
          const response = await fetch(proxyURL, {
            headers: {
              "User-Agent": "TechNewsWidget/1.0",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();

          if (result.contents) {
            data = JSON.parse(result.contents);
          } else if (result.data) {
            data = result;
          } else {
            data = result;
          }

          if (data && data.data && data.data.children) {
            setPosts(data.data.children.slice(0, 8));
            console.log(
              `Successfully fetched ${data.data.children.length} posts from r/${subreddit}`
            );
            return;
          }
        } catch (error) {
          lastError = error;
          console.warn(`Proxy service failed: ${proxyURL}`, error);
          continue;
        }
      }

      throw lastError || new Error("All proxy services failed");
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);

      const mockPosts = [
        {
          data: {
            id: "mock1",
            title: "Unable to fetch Reddit posts - Check your connection",
            selftext:
              "The tech news widget is having trouble connecting to Reddit. This could be due to network issues or API limitations.",
            author: "system",
            score: 0,
            num_comments: 0,
            created_utc: Date.now() / 1000,
            permalink: "#",
          },
        },
      ];
      setPosts(mockPosts);
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

  const truncateText = (text, maxLength = 80) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="h-full p-4 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-900">Tech News</h1>
        <span className="text-xs text-gray-500">r/{selectedSubreddit}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded p-3 animate-pulse"
              >
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {posts.slice(0, 6).map((post) => {
              const data = post.data;
              return (
                <div
                  key={data.id}
                  className="border border-gray-200 rounded p-3 hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() =>
                    window.open(`https://reddit.com${data.permalink}`, "_blank")
                  }
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2 flex-1">
                      {truncateText(data.title, 80)}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatTime(data.created_utc)}
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 space-x-3">
                    <span>u/{data.author}</span>
                    <span>⬆️ {data.score}</span>
                    <span>💬 {data.num_comments}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex flex-wrap gap-1 justify-center">
          {subreddits.map((subreddit) => (
            <button
              key={subreddit.name}
              onClick={() => setSelectedSubreddit(subreddit.name)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
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
    </div>
  );
}
