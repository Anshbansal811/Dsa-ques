import { useEffect, useState } from "react";
import { BarChart3, CheckCircle, Clock, Target, RefreshCw } from "lucide-react";
import { progressAPI } from "../services/api";
import { ProgressSummary, UserProgress } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Progress = () => {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const [summaryResponse, progressResponse] = await Promise.all([
        progressAPI.getSummary(),
        progressAPI.getAll(),
      ]);
      setSummary(summaryResponse.summary);
      setProgress(progressResponse.progress);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
      toast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = async () => {
    if (
      window.confirm(
        "Are you sure you want to reset all your progress? This action cannot be undone."
      )
    ) {
      try {
        await progressAPI.resetAll();
        toast.success("Progress reset successfully");
        fetchProgress();
      } catch (error) {
        console.error("Failed to reset progress:", error);
        toast.error("Failed to reset progress");
      }
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
            <p className="text-gray-600 mt-2">
              Track your DSA learning journey and see your achievements.
            </p>
          </div>
          <button
            onClick={handleResetProgress}
            className="btn btn-danger btn-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Progress
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Problems
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.totalProblems}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.completedProblems}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.completionPercentage}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Remaining</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.totalProblems - summary.completedProblems}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress by Difficulty */}
      {summary && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Progress by Difficulty
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Easy</span>
                <span className="text-sm text-gray-500">
                  {summary.byDifficulty.easy.completed}/
                  {summary.byDifficulty.easy.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      summary.byDifficulty.easy.total > 0
                        ? (summary.byDifficulty.easy.completed /
                            summary.byDifficulty.easy.total) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Medium
                </span>
                <span className="text-sm text-gray-500">
                  {summary.byDifficulty.medium.completed}/
                  {summary.byDifficulty.medium.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      summary.byDifficulty.medium.total > 0
                        ? (summary.byDifficulty.medium.completed /
                            summary.byDifficulty.medium.total) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Hard</span>
                <span className="text-sm text-gray-500">
                  {summary.byDifficulty.hard.completed}/
                  {summary.byDifficulty.hard.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      summary.byDifficulty.hard.total > 0
                        ? (summary.byDifficulty.hard.completed /
                            summary.byDifficulty.hard.total) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Problems */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Completed Problems
        </h2>
        {progress.filter((p) => p.completed).length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No problems completed yet. Start your DSA journey!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {progress
              .filter((p) => p.completed)
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.problem.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.problem.topic?.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`badge badge-${item.problem.difficulty.toLowerCase()}`}
                    >
                      {item.problem.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
