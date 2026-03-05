
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BookmarkCheck, 
  Search, 
  Filter, 
  Clock, 
  FileText, 
  Brain,
  Trash2,
  Loader2
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useSavedQuestions, useSavedNotes, useDeleteQuestion, useDeleteNote } from "@/hooks/useSavedContent";

const SavedContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: savedQuestions = [], isLoading: questionsLoading, error: questionsError } = useSavedQuestions();
  const { data: savedNotes = [], isLoading: notesLoading, error: notesError } = useSavedNotes();
  const deleteQuestionMutation = useDeleteQuestion();
  const deleteNoteMutation = useDeleteNote();

  const handleDeleteQuestion = (id: number) => {
    deleteQuestionMutation.mutate(id);
  };

  const handleDeleteNote = (id: number) => {
    deleteNoteMutation.mutate(id);
  };

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

  const filteredQuestions = savedQuestions.filter(item =>
    item.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotes = savedNotes.filter(item =>
    item.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Saved Content
            </h1>
            <p className="text-lg text-gray-600">
              Access all your saved questions, answers, and study notes
            </p>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search your saved content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="questions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questions" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Saved Questions ({filteredQuestions.length})
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Study Notes ({filteredNotes.length})
              </TabsTrigger>
            </TabsList>

            {/* Saved Questions Tab */}
            <TabsContent value="questions">
              <div className="space-y-4">
                {questionsLoading ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p className="text-gray-500">Loading saved questions...</p>
                    </CardContent>
                  </Card>
                ) : questionsError ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-red-500">Failed to load saved questions</p>
                    </CardContent>
                  </Card>
                ) : filteredQuestions.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <BookmarkCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">
                        {searchTerm ? "No questions found matching your search" : "No saved questions yet"}
                      </p>
                      {!searchTerm && (
                        <p className="text-sm text-gray-400 mt-2">
                          Start asking questions and save them for future reference
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  filteredQuestions.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">
                              {item.question_text}
                            </CardTitle>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <Badge className={subjectColors[item.subject] || "bg-gray-100 text-gray-700"}>
                                {item.subject}
                              </Badge>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTimeAgo(item.created_at)}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuestion(item.id)}
                            disabled={deleteQuestionMutation.isPending}
                            className="text-red-500 hover:text-red-700"
                          >
                            {deleteQuestionMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-blue-900 font-medium mb-2">Answer Summary:</p>
                          <p className="text-blue-800 text-sm mb-3">
                            {item.answer_summary.length > 150 
                              ? `${item.answer_summary.substring(0, 150)}...` 
                              : item.answer_summary
                            }
                          </p>
                          {item.answer_steps.length > 0 && (
                            <div>
                              <p className="text-blue-900 font-medium mb-2">Steps:</p>
                              <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                                {item.answer_steps.slice(0, 2).map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                                {item.answer_steps.length > 2 && (
                                  <li className="text-blue-600">...and {item.answer_steps.length - 2} more steps</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Study Notes Tab */}
            <TabsContent value="notes">
              <div className="space-y-4">
                {notesLoading ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p className="text-gray-500">Loading saved notes...</p>
                    </CardContent>
                  </Card>
                ) : notesError ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-red-500">Failed to load saved notes</p>
                    </CardContent>
                  </Card>
                ) : filteredNotes.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">
                        {searchTerm ? "No notes found matching your search" : "No saved study notes yet"}
                      </p>
                      {!searchTerm && (
                        <p className="text-sm text-gray-400 mt-2">
                          Generate study notes and save them for easy access
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  filteredNotes.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">
                              {item.heading}
                            </CardTitle>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                              <Badge className={subjectColors[item.subject] || "bg-gray-100 text-gray-700"}>
                                {item.subject}
                              </Badge>
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                {item.topic}
                              </span>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTimeAgo(item.created_at)}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(item.id)}
                            disabled={deleteNoteMutation.isPending}
                            className="text-red-500 hover:text-red-700"
                          >
                            {deleteNoteMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-green-900 font-medium mb-2">Key Points:</p>
                          <ul className="list-disc list-inside text-green-800 text-sm space-y-1">
                            {item.bullet_points.slice(0, 3).map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                            {item.bullet_points.length > 3 && (
                              <li className="text-green-600">...and {item.bullet_points.length - 3} more points</li>
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Statistics */}
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {savedQuestions.length}
                  </div>
                  <p className="text-gray-600">Questions Saved</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {savedNotes.length}
                  </div>
                  <p className="text-gray-600">Study Notes</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set([...savedQuestions.map(q => q.subject), ...savedNotes.map(n => n.subject)]).size}
                  </div>
                  <p className="text-gray-600">Subjects Covered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SavedContent;
