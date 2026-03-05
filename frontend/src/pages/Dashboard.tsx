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
import { SUBJECT_COLORS } from "@/constants";
import { formatTimeAgo } from "@/lib/utils";

const Dashboard = () => {
  const { data: savedQuestions = [], isLoading: questionsLoading } = useSavedQuestions();
  const { data: savedNotes = [], isLoading: notesLoading } = useSavedNotes();

  const recentQuestions = savedQuestions.slice(0, 3);
  const recentNotes = savedNotes.slice(0, 2);

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
          {[
            { to: "/ask-question", icon: Brain, title: "Ask a Question", desc: "Get instant explanations for any topic", color: "text-blue-600" },
            { to: "/practice", icon: Target, title: "Practice Problems", desc: "Solve problems to reinforce learning", color: "text-green-600" },
            { to: "/quiz", icon: BookOpen, title: "Take a Quiz", desc: "Test your knowledge with custom quizzes", color: "text-purple-600" },
            { to: "/study-notes", icon: FileText, title: "Study Notes", desc: "Generate comprehensive study materials", color: "text-orange-600" }
          ].map((action) => (
            <Card key={action.to} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <Link to={action.to}>
                <CardHeader className="text-center">
                  <action.icon className={`h-12 w-12 ${action.color} mx-auto mb-2`} />
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {action.desc}
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
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
                          <span className={`px-2 py-1 rounded-full text-xs mr-2 ${SUBJECT_COLORS[question.subject] || 'bg-gray-100 text-gray-700'}`}>
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
                          <span className={`px-2 py-1 rounded-full text-xs mr-2 ${SUBJECT_COLORS[note.subject] || 'bg-gray-100 text-gray-700'}`}>
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
