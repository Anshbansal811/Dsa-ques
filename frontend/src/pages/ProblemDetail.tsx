import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Code,
  CheckCircle,
  ChevronLeft,
  Youtube,
  ExternalLink,
  FileText,
  BookOpen,
} from "lucide-react";
import { problemsAPI, progressAPI } from "../services/api";
import { Problem } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;
      
      try {
        const response = await problemsAPI.getById(id);
        setProblem(response.problem);
      } catch (error) {
        console.error("Failed to fetch problem:", error);
        toast.error("Failed to load problem details");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleToggleCompletion = async () => {
    if (!problem) return;
    
    setMarkingComplete(true);
    try {
      await progressAPI.toggleProblem(problem.id);
      setProblem(prev => prev ? { ...prev, isCompleted: !prev.isCompleted } : null);
      toast.success(problem.isCompleted ? "Problem marked as incomplete" : "Problem marked as complete!");
    } catch (error) {
      console.error("Failed to toggle problem completion:", error);
      toast.error("Failed to update problem status");
    } finally {
      setMarkingComplete(false);
    }
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

  if (!problem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Problem not found</h2>
        <p className="text-gray-600 mt-2">The problem you're looking for doesn't exist.</p>
        <Link
          to="/problems"
          className="inline-flex items-center mt-4 text-primary-600 hover:text-primary-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Link
            to="/problems"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Problems
          </Link>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className={`badge ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              {problem.topic && (
                <Link
                  to={`/topics/${problem.topic.id}`}
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  {problem.topic.title}
                </Link>
              )}
              {problem.isCompleted && (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {problem.title}
            </h1>

            {problem.description && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {problem.description}
              </p>
            )}
          </div>

          <button
            onClick={handleToggleCompletion}
            disabled={markingComplete}
            className={`btn btn-lg ${
              problem.isCompleted ? "btn-secondary" : "btn-success"
            }`}
          >
            {markingComplete ? (
              <LoadingSpinner size="sm" />
            ) : problem.isCompleted ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Mark Incomplete
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Mark Complete
              </>
            )}
          </button>
        </div>
      </div>

      {/* Resource Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problem.youtubeLink && (
            <a
              href={problem.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <Youtube className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Video Tutorial</h3>
                <p className="text-sm text-gray-600">Watch a detailed explanation</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
            </a>
          )}

          {problem.leetcodeLink && (
            <a
              href={problem.leetcodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <Code className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Practice on LeetCode</h3>
                <p className="text-sm text-gray-600">Solve the problem online</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
            </a>
          )}

          {problem.codeforcesLink && (
            <a
              href={problem.codeforcesLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Practice on Codeforces</h3>
                <p className="text-sm text-gray-600">Solve the problem online</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
            </a>
          )}

          {problem.articleLink && (
            <a
              href={problem.articleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Read Article</h3>
                <p className="text-sm text-gray-600">Learn the theory and approach</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
            </a>
          )}
        </div>

        {!problem.youtubeLink && !problem.leetcodeLink && !problem.codeforcesLink && !problem.articleLink && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No resources available
            </h3>
            <p className="text-gray-600">
              Learning resources for this problem will be added soon.
            </p>
          </div>
        )}
      </div>

      {/* Problem Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Problem Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Details</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-600">Difficulty:</dt>
                <dd>
                  <span className={`badge ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Topic:</dt>
                <dd className="text-gray-900">
                  {problem.topic ? (
                    <Link
                      to={`/topics/${problem.topic.id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {problem.topic.title}
                    </Link>
                  ) : (
                    "Unknown Topic"
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Order:</dt>
                <dd className="text-gray-900">{problem.order}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Timestamps</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-600">Created:</dt>
                <dd className="text-gray-900">
                  {new Date(problem.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Updated:</dt>
                <dd className="text-gray-900">
                  {new Date(problem.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/problems"
          className="btn btn-secondary"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Problems
        </Link>

        {problem.topic && (
          <Link
            to={`/topics/${problem.topic.id}`}
            className="btn btn-primary"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            View Topic
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProblemDetail;
