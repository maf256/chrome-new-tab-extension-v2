import { useState, useEffect } from "react";
import { Trophy, RefreshCw } from "lucide-react";

const Football = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch latest football results
  const fetchMatches = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api.football-data.org/v4/matches?status=FINISHED",
        {
          headers: {
            "X-Auth-Token": "API key inja <---",
          },
        }
      );

      const data = await response.json();

      const latestMatches = data.matches
        .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
        .slice(0, 8)
        .map((match) => ({
          id: match.id,
          homeTeam: match.homeTeam.shortName || match.homeTeam.name,
          awayTeam: match.awayTeam.shortName || match.awayTeam.name,
          homeScore: match.score.fullTime.home,
          awayScore: match.score.fullTime.away,
          date: new Date(match.utcDate).toLocaleDateString(),
          competition: match.competition.name,
          status: match.status,
        }));

      setMatches(latestMatches);
    } catch (err) {
      console.error("Error fetching matches:", err);

      setMatches([
        {
          id: 1,
          homeTeam: "Arsenal",
          awayTeam: "Chelsea",
          homeScore: 2,
          awayScore: 1,
          date: "12/23",
          competition: "Premier League",
        },
        {
          id: 2,
          homeTeam: "Barcelona",
          awayTeam: "Real Madrid",
          homeScore: 1,
          awayScore: 3,
          date: "12/22",
          competition: "La Liga",
        },
        {
          id: 3,
          homeTeam: "Bayern",
          awayTeam: "Dortmund",
          homeScore: 4,
          awayScore: 0,
          date: "12/21",
          competition: "Bundesliga",
        },
        {
          id: 4,
          homeTeam: "PSG",
          awayTeam: "Lyon",
          homeScore: 2,
          awayScore: 2,
          date: "12/20",
          competition: "Ligue 1",
        },
        {
          id: 5,
          homeTeam: "Milan",
          awayTeam: "Inter",
          homeScore: 1,
          awayScore: 2,
          date: "12/19",
          competition: "Serie A",
        },
        {
          id: 6,
          homeTeam: "Liverpool",
          awayTeam: "Man City",
          homeScore: 3,
          awayScore: 1,
          date: "12/18",
          competition: "Premier League",
        },
        {
          id: 7,
          homeTeam: "Atletico",
          awayTeam: "Sevilla",
          homeScore: 0,
          awayScore: 1,
          date: "12/17",
          competition: "La Liga",
        },
        {
          id: 8,
          homeTeam: "Juventus",
          awayTeam: "Napoli",
          homeScore: 2,
          awayScore: 3,
          date: "12/16",
          competition: "Serie A",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const getResultStyle = (homeScore, awayScore) => {
    if (homeScore > awayScore) return "text-green-600 font-semibold";
    if (homeScore < awayScore) return "text-red-600 font-semibold";
    return "text-yellow-600 font-semibold";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-800">Football</h2>
        </div>
        <button
          onClick={fetchMatches}
          disabled={loading}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <RefreshCw
            className={`w-4 h-4 text-gray-600 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={fetchMatches}
            className="mt-2 text-blue-500 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Trophy className="w-12 h-12 text-gray-300 mb-2" />
          <p className="text-gray-500">No recent matches</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {matches.map((match) => (
              <div
                key={match.id}
                className="p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">
                    {match.competition}
                  </span>
                  <span className="text-xs text-gray-500">{match.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {match.homeTeam}
                    </span>
                    <span
                      className={`text-lg ${getResultStyle(
                        match.homeScore,
                        match.awayScore
                      )}`}
                    >
                      {match.homeScore}
                    </span>
                  </div>
                  <span className="text-gray-400 mx-2">-</span>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span
                      className={`text-lg ${getResultStyle(
                        match.awayScore,
                        match.homeScore
                      )}`}
                    >
                      {match.awayScore}
                    </span>
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Football;
