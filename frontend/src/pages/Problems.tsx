import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Code,
  CheckCircle,
  Filter,
  Search,
  Youtube,
  ExternalLink,
  FileText,
} from "lucide-react";
import { problemsAPI, topicsAPI } from "../services/api";
import { Problem, Topic } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Problems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsResponse, topicsResponse] = await Promise.all([
          problemsAPI.getAll(),
          topicsAPI.getAll(),
        ]);
        setProblems(problemsResponse.problems);
        setTopics(topicsResponse.topics);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
        toast.error("Failed to load problems");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const matchesTopic = !selectedTopic || problem.topicId === selectedTopic;
    const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
    const matchesSearch = !searchQuery || 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (problem.description && problem.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTopic && matchesDifficulty && matchesSearch;
  });

  const getTopicName = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    return topic?.title || "Unknown Topic";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-600 bg-green-100";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100";
      case "HARD":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">All Problems</h1>
        <p className="text-gray-600 mt-2">
          Browse and practice DSA problems with curated resources.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Topic Filter */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="input"
          >
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="input"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSelectedTopic("");
              setSelectedDifficulty("");
              setSearchQuery("");
            }}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Problems ({filteredProblems.length})
            </h2>
            <span className="text-sm text-gray-500">
              Showing {filteredProblems.length} of {problems.length} problems
            </span>
          </div>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No problems found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredProblems.map((problem) => (
              <div key={problem.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span
                        className={`badge ${getDifficultyColor(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">
                        {getTopicName(problem.topicId)}
                      </span>
                      {problem.isCompleted && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {problem.title}
                    </h3>

                    {problem.description && (
                      <p className="text-gray-600 mb-4">{problem.description}</p>
                    )}

                    {/* Resource Links */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.youtubeLink && (
                        <a
                          href={problem.youtubeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
                        >
                          <Youtube className="h-4 w-4 mr-1" />
                          Video Tutorial
                        </a>
                      )}

                      {problem.leetcodeLink && (
                        <a
                          href={problem.leetcodeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          LeetCode
                        </a>
                      )}

                      {problem.codeforcesLink && (
                        <a
                          href={problem.codeforcesLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Codeforces
                        </a>
                      )}

                      {problem.articleLink && (
                        <a
                          href={problem.articleLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Article
                        </a>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/problems/${problem.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/topics/${problem.topicId}`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        View Topic
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
