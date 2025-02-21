import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { 
  Trophy, 
  Medal, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Crown,
  Coins,
  Target,
  Zap,
  Sparkles,
  User
} from "lucide-react";

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("totalXP");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userRank, setUserRank] = useState(null);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/leaderboard?page=${currentPage}&sortBy=${sortBy}&search=${debouncedSearch}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setLeaderboardData(response.data.leaderboard);
        setTotalPages(response.data.totalPages);
        setUserRank(response.data.userRank);
        
        if (initialLoadRef.current && !debouncedSearch) {
          setCurrentPage(response.data.currentPage);
          initialLoadRef.current = false;
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentPage, sortBy, debouncedSearch]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return (
          <motion.div
            whileHover={{ scale: 1.2, rotate: 360 }}
            className="flex items-center justify-center relative"
          >
            <Crown className="text-yellow-400" size={24} />
            <Sparkles className="absolute text-yellow-400 opacity-50" size={32} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div whileHover={{ scale: 1.2 }}>
            <Medal className="text-gray-400" size={24} />
          </motion.div>
        );
      case 3:
        return (
          <motion.div whileHover={{ scale: 1.2 }}>
            <Medal className="text-amber-600" size={24} />
          </motion.div>
        );
      default:
        return <span className="text-white/60 font-bold">{rank}</span>;
    }
  };

  const sortOptions = [
    { value: "totalXP", label: "XP", icon: Zap },
    { value: "totalCoins", label: "Coins", icon: Coins },
    { value: "levelsCleared", label: "Levels", icon: Target },
  ];

  const QuickNav = () => (
    <div className="flex gap-2 mb-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSearchTerm("");
          setCurrentPage(Math.ceil(userRank / 10));
        }}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
      >
        <User size={16} />
        Find Me
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSearchTerm("");
          setCurrentPage(1);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
      >
        <Crown size={16} />
        Top Players
      </motion.button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16"
        >
          <Trophy className="text-yellow-400 w-full h-full" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row justify-between items-center mt-12 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 mb-4 lg:mb-0"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-xl"
            >
              <Trophy size={32} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-64 px-10 py-2 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex gap-2"
            >
              {sortOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy(option.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    sortBy === option.value
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <option.icon size={16} />
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>

        <QuickNav />

        {userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-500/20 rounded-xl backdrop-blur-lg"
          >
            <div className="flex items-center gap-4">
              <User className="text-blue-400" size={24} />
              <div>
                <span className="text-gray-400">Your Current Rank:</span>
                <span className="ml-2 text-white font-bold">#{userRank}</span>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 rounded-2xl overflow-hidden backdrop-blur-lg"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="px-6 py-4 text-left">Rank</th>
                  <th className="px-6 py-4 text-left">Player</th>
                  <th className="px-6 py-4 text-right">XP</th>
                  <th className="px-6 py-4 text-right">Coins</th>
                  <th className="px-6 py-4 text-right">Levels</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {leaderboardData.map((player, index) => (
                    <motion.tr
                      key={player.userId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-b border-white/5 ${
                        player.userId === user?._id
                          ? "bg-blue-500/20"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(player.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            {player.name}
                            {player.userId === user?._id && (
                              <span className="ml-2 text-xs text-blue-400">(You)</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-white">{player.totalXP.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-yellow-400">{player.totalCoins.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-green-400">{player.levelsCleared}</span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center gap-4 p-4 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <ChevronLeft size={24} />
            </motion.button>
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${
                currentPage === totalPages
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;