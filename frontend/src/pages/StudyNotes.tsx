
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save, BookOpen } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useGenerateStudyNotes, useSaveNotes } from "@/hooks/useAI";

const StudyNotes = () => {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const generateNotesMutation = useGenerateStudyNotes();
  const saveNotesMutation = useSaveNotes();

  const subjects = [
    "Mathematics",
    "Science",
    "Chemistry",
    "Physics",
    "Biology",
    "History",
    "English",
    "Geography",
    "Computer Science",
    "Psychology"
  ];

  const generateNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim() || !subject) {
      toast.error("Please enter a topic and select a subject");
      return;
    }

    setIsSaved(false);
    generateNotesMutation.mutate({ topic, subject });
  };

  const handleSave = () => {
    if (!generateNotesMutation.data) {
      toast.error("No notes to save");
      return;
    }

    const saveData = {
      subject,
      topic,
      content: generateNotesMutation.data.content
    };

    saveNotesMutation.mutate(saveData, {
      onSuccess: () => {
        setIsSaved(true);
      }
    });
  };

  const handleNewNotes = () => {
    setTopic("");
    setSubject("");
    setIsSaved(false);
    generateNotesMutation.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Study Notes Generator
            </h1>
            <p className="text-lg text-gray-600">
              Create comprehensive study materials with AI assistance
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Generate Notes
                  </CardTitle>
                  <CardDescription>
                    Enter a topic to create detailed study notes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={generateNotes} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subj) => (
                            <SelectItem key={subj} value={subj}>
                              {subj}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic</Label>
                      <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Photosynthesis, Quadratic Equations, World War II"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={generateNotesMutation.isPending}
                    >
                      {generateNotesMutation.isPending ? "Generating Notes..." : "Generate Study Notes"}
                    </Button>
                  </form>

                  {generateNotesMutation.data && (
                    <div className="mt-6 space-y-3">
                      <Button
                        variant="outline"
                        onClick={handleSave}
                        disabled={isSaved || saveNotesMutation.isPending}
                        className="w-full"
                      >
                        <Save className={`h-4 w-4 mr-2 ${isSaved ? 'text-green-600' : ''}`} />
                        {saveNotesMutation.isPending ? "Saving..." : isSaved ? "Saved!" : "Save Notes"}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handleNewNotes}
                        className="w-full"
                      >
                        Generate New Notes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notes Display */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Your Study Notes
                  </CardTitle>
                  <CardDescription>
                    {generateNotesMutation.data 
                      ? `Comprehensive notes for ${topic} in ${subject}` 
                      : "Your generated study notes will appear here"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generateNotesMutation.isPending ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Creating comprehensive study notes...</span>
                    </div>
                  ) : generateNotesMutation.data ? (
                    <div className="prose max-w-none">
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-blue-900 mb-1">{generateNotesMutation.data.content.heading}</h3>
                            <p className="text-blue-700 text-sm">{subject}</p>
                          </div>
                          <div className="text-blue-600 text-sm">
                            Generated: {new Date().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Key Points:</h4>
                        <div className="space-y-3">
                          {generateNotesMutation.data.content.bullet_points.map((point, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">{point}</p>
                            </div>
                          ))}
                        </div>
                    </div>
                    </div>
                  ) : generateNotesMutation.error ? (
                    <div className="text-center py-12 text-red-500">
                      <p>Failed to generate study notes. Please try again.</p>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Enter a topic and subject to generate comprehensive study notes</p>
                      <p className="text-sm mt-2">Our AI will create detailed, organized notes with key concepts, examples, and study tips</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyNotes;
