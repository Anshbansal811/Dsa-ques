import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  Youtube,
  Code,
  FileText,
  ChevronLeft,
} from "lucide-react";
import { topicsAPI } from "../services/api";
import { Topic } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const TopicDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      if (!id) return;
      
      try {
        const response = await topicsAPI.getById(id);
        setTopic(response.topic);
      } catch (error) {
        console.error("Failed to fetch topic:", error);
        toast.error("Failed to load topic details");
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Topic not found</h2>
        <p className="text-gray-600 mt-2">The topic you're looking for doesn't exist.</p>
        <Link
          to="/topics"
          className="inline-flex items-center mt-4 text-primary-600 hover:text-primary-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Topics
        </Link>
      </div>
    );
  }

  const completedProblems = topic.problems.filter((p) => p.isCompleted).length;
  const totalProblems = topic.problems.length;
  const progressPercentage =
    totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Link
            to="/topics"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Topics
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{topic.title}</h1>
            {topic.description && (
              <p className="text-gray-600 mt-2">{topic.description}</p>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>
              {completedProblems}/{totalProblems} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">
              {totalProblems} problems total
            </span>
            <span className="text-sm font-medium text-primary-600">
              {progressPercentage}% complete
            </span>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Problems</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {topic.problems.map((problem, index) => (
            <div key={problem.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      Problem {index + 1}
                    </span>
                    <span
                      className={`badge badge-${problem.difficulty.toLowerCase()}`}
                    >
                      {problem.difficulty}
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
                  <div className="flex flex-wrap gap-2">
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
                        <Code className="h-4 w-4 mr-1" />
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
                        <Code className="h-4 w-4 mr-1" />
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {topic.problems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No problems yet
          </h3>
          <p className="text-gray-600">
            Problems for this topic will be added soon.
          </p>
        </div>
      )}
    </div>
  );
};

export default TopicDetail;
