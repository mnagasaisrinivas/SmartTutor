import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Brain, 
  Target, 
  FileText, 
  Star, 
  Clock,
  Loader2
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useSavedQuestions, useSavedNotes } from "@/hooks/useSavedContent";

const Dashboard = () => {
  const { data: savedQuestions = [], isLoading: questionsLoading } = useSavedQuestions();
  const { data: savedNotes = [], isLoading: notesLoading } = useSavedNotes();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} weeks ago`;
  };

  const recentQuestions = savedQuestions.slice(0, 3);
  const recentNotes = savedNotes.slice(0, 2);

  const subjectColors: Record<string, string> = {
    "Mathematics": "bg-blue-100 text-blue-700",
    "Biology": "bg-green-100 text-green-700",
    "Chemistry": "bg-purple-100 text-purple-700",
    "Physics": "bg-orange-100 text-orange-700",
    "History": "bg-red-100 text-red-700",
    "English": "bg-yellow-100 text-yellow-700",
    "Science": "bg-teal-100 text-teal-700",
    "Geography": "bg-indigo-100 text-indigo-700",
    "Computer Science": "bg-pink-100 text-pink-700",
    "Psychology": "bg-cyan-100 text-cyan-700"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! Ready to learn?
          </h1>
          <p className="text-lg text-gray-600">
            Continue your learning journey with SmartTutor
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <Link to="/ask-question">
              <CardHeader className="text-center">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Ask a Question</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Get instant explanations for any topic
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <Link to="/practice">
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Practice Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Solve problems to reinforce learning
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <Link to="/quiz">
              <CardHeader className="text-center">
                <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Take a Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Test your knowledge with custom quizzes
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <Link to="/study-notes">
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Study Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Generate comprehensive study materials
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Questions
              </CardTitle>
              <CardDescription>
                Your latest learning activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span className="text-gray-500">Loading questions...</span>
                  </div>
                ) : recentQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No questions yet</p>
                    <p className="text-sm">Start asking questions to see them here</p>
                  </div>
                ) : (
                  recentQuestions.map((question) => (
                    <div key={question.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">
                          {question.question_text.length > 60 
                            ? `${question.question_text.substring(0, 60)}...` 
                            : question.question_text
                          }
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs mr-2 ${subjectColors[question.subject] || 'bg-gray-100 text-gray-700'}`}>
                            {question.subject}
                          </span>
                          <span>{formatTimeAgo(question.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/saved-content">View All</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Saved Notes
              </CardTitle>
              <CardDescription>
                Your saved study materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span className="text-gray-500">Loading notes...</span>
                  </div>
                ) : recentNotes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No notes yet</p>
                    <p className="text-sm">Generate study notes to see them here</p>
                  </div>
                ) : (
                  recentNotes.map((note) => (
                    <div key={note.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">
                          {note.heading}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs mr-2 ${subjectColors[note.subject] || 'bg-gray-100 text-gray-700'}`}>
                            {note.subject}
                          </span>
                          <span>{formatTimeAgo(note.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/saved-content">View All Notes</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
