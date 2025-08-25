import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Code,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { progressAPI, topicsAPI } from "../services/api";
import { ProgressSummary, Topic } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryResponse, topicsResponse] = await Promise.all([
          progressAPI.getSummary(),
          topicsAPI.getAll(),
        ]);
        setSummary(summaryResponse.summary);
        setTopics(topicsResponse.topics);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      name: "Total Problems",
      value: summary?.totalProblems || 0,
      icon: Code,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Completed",
      value: summary?.completedProblems || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Progress",
      value: `${summary?.completionPercentage || 0}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "Topics Covered",
      value: topics.length,
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const quickActions = [
    {
      name: "Browse Topics",
      description: "Explore DSA topics and problems",
      href: "/topics",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "View Problems",
      description: "See all problems with filters",
      href: "/problems",
      icon: Code,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Track Progress",
      description: "Monitor your learning progress",
      href: "/progress",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Continue your DSA journey from where you left off.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                  <stat.icon
                    className={`h-6 w-6 ${stat.color}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Overview */}
      {summary && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Progress Overview
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Overall Progress</span>
                <span>{summary.completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${summary.completionPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {summary.byDifficulty.easy.completed}/
                  {summary.byDifficulty.easy.total}
                </div>
                <div className="text-sm text-gray-500">Easy Problems</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {summary.byDifficulty.medium.completed}/
                  {summary.byDifficulty.medium.total}
                </div>
                <div className="text-sm text-gray-500">Medium Problems</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {summary.byDifficulty.hard.completed}/
                  {summary.byDifficulty.hard.total}
                </div>
                <div className="text-sm text-gray-500">Hard Problems</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div>
                <span
                  className={`rounded-lg inline-flex p-3 ${action.bgColor} ${action.color}`}
                >
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
              <span
                className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Topics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Topics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.slice(0, 6).map((topic) => (
            <Link
              key={topic.id}
              to={`/topics/${topic.id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <h3 className="font-medium text-gray-900">{topic.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {topic.problems.length} problems
              </p>
              {topic.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {topic.description}
                </p>
              )}
            </Link>
          ))}
        </div>
        {topics.length > 6 && (
          <div className="mt-4 text-center">
            <Link
              to="/topics"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              View all topics →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
