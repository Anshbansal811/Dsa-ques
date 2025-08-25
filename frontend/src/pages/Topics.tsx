import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, CheckCircle } from "lucide-react";
import { topicsAPI } from "../services/api";
import { Topic } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const Topics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await topicsAPI.getAll();
        setTopics(response.topics);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">DSA Topics</h1>
        <p className="text-gray-600 mt-2">
          Explore Data Structures and Algorithms topics with curated problems
          and resources.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {topics.map((topic) => {
          const completedProblems = topic.problems.filter(
            (p) => p.isCompleted
          ).length;
          const totalProblems = topic.problems.length;
          const progressPercentage =
            totalProblems > 0
              ? Math.round((completedProblems / totalProblems) * 100)
              : 0;

          return (
            <div
              key={topic.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {topic.title}
                      </h2>
                      {topic.description && (
                        <p className="text-gray-600 mt-1">
                          {topic.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/topics/${topic.id}`}
                    className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>
                      {completedProblems}/{totalProblems} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500">
                      {totalProblems} problems total
                    </span>
                    <span className="text-sm font-medium text-primary-600">
                      {progressPercentage}% complete
                    </span>
                  </div>
                </div>

                {topic.problems.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Recent Problems
                    </h3>
                    <div className="space-y-2">
                      {topic.problems.slice(0, 3).map((problem) => (
                        <div
                          key={problem.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center space-x-2">
                            {problem.isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <div className="h-4 w-4 border-2 border-gray-300 rounded"></div>
                            )}
                            <span className="text-sm text-gray-700">
                              {problem.title}
                            </span>
                          </div>
                          <span
                            className={`badge badge-${problem.difficulty.toLowerCase()}`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                      ))}
                      {topic.problems.length > 3 && (
                        <div className="text-center">
                          <Link
                            to={`/topics/${topic.id}`}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            View all {topic.problems.length} problems →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Topics;
