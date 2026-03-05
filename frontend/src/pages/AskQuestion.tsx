
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Heart, Send } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useGenerateExplanation, useSaveQuestion } from "@/hooks/useAI";

const AskQuestion = () => {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const generateExplanationMutation = useGenerateExplanation();
  const saveQuestionMutation = useSaveQuestion();

  const subjects = [
    "Mathematics",
    "Science",
    "History",
    "English",
    "Chemistry",
    "Physics",
    "Biology",
    "Geography",
    "Computer Science",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !subject) {
      toast.error("Please enter a question and select a subject");
      return;
    }

    setIsSaved(false);
    generateExplanationMutation.mutate({ question, subject });
  };

  const handleSave = () => {
    if (!generateExplanationMutation.data || !generateExplanationMutation.data.explanation) {
      toast.error("No explanation to save");
      return;
    }

    const saveData = {
      subject,
      question,
      answer_steps: generateExplanationMutation.data.explanation.steps || [],
      answer_summary: generateExplanationMutation.data.explanation.summary || ""
    };

    saveQuestionMutation.mutate(saveData, {
      onSuccess: () => {
        setIsSaved(true);
      }
    });
  };

  const handleNewQuestion = () => {
    setQuestion("");
    setSubject("");
    setIsSaved(false);
    generateExplanationMutation.reset();
  };

  const formatSteps = (steps: string[]) => {
    return steps.map((step, index) => (
      <div key={index} className="mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="text-gray-700 leading-relaxed">{step}</p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ask a Question
            </h1>
            <p className="text-lg text-gray-600">
              Get personalized explanations powered by AI
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Question Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  What would you like to learn?
                </CardTitle>
                <CardDescription>
                  Enter your question and select the subject for the best explanation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a subject" />
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
                    <Label htmlFor="question">Your Question</Label>
                    <Textarea
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Type your question here... For example: 'What is photosynthesis?' or 'How do I solve quadratic equations?'"
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={generateExplanationMutation.isPending}
                  >
                    {generateExplanationMutation.isPending ? (
                      "Generating explanation..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Get Explanation
                      </>
                    )}
                  </Button>
                </form>

                {generateExplanationMutation.data && (
                  <div className="mt-6 space-y-3">
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      disabled={isSaved || saveQuestionMutation.isPending}
                      className="w-full"
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                      {saveQuestionMutation.isPending ? "Saving..." : isSaved ? "Saved!" : "Save Question & Answer"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleNewQuestion}
                      className="w-full"
                    >
                      Ask Another Question
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Explanation Display */}
            <Card>
              <CardHeader>
                <CardTitle>AI Explanation</CardTitle>
                <CardDescription>
                  {generateExplanationMutation.data 
                    ? "Here's your personalized explanation" 
                    : "Your explanation will appear here"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generateExplanationMutation.isPending ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Generating explanation...</span>
                  </div>
                ) : generateExplanationMutation.data ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <p className="font-medium text-blue-900 mb-2">Your Question:</p>
                      <p className="text-blue-800">"{question}"</p>
                      <p className="text-sm text-blue-600 mt-1">Subject: {subject}</p>
                    </div>

                    {/* Title */}
                    {generateExplanationMutation.data.explanation.title && (
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          {generateExplanationMutation.data.explanation.title}
                        </h2>
                      </div>
                    )}

                    {/* Steps */}
                    {generateExplanationMutation.data.explanation.steps && generateExplanationMutation.data.explanation.steps.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Step-by-Step Guide:</h3>
                        {formatSteps(generateExplanationMutation.data.explanation.steps)}
                      </div>
                    )}

                    {/* Summary */}
                    {generateExplanationMutation.data.explanation.summary && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-900 mb-2">Summary</h3>
                        <p className="text-green-800 leading-relaxed">
                          {generateExplanationMutation.data.explanation.summary}
                        </p>
                      </div>
                    )}
                  </div>

                ) : generateExplanationMutation.error ? (
                  <div className="text-center py-12 text-red-500">
                    <p>Failed to generate explanation. Please try again.</p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Ask a question to get started with your personalized explanation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
