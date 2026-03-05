
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Target, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useGeneratePracticeProblems } from "@/hooks/useAI";

interface Data {
  practice_problems: Array<string>;
  explanations: Array<string>;
}

const Practice = () => {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [showSolutions, setShowSolutions] = useState(false);

  const generateProblemsMutation = useGeneratePracticeProblems();

  const subjects = [
    "Mathematics",
    "Science",
    "Chemistry",
    "Physics",
    "Biology",
    "History",
    "English"
  ];

  const generateProblems = () => {
    if (!subject || !topic.trim()) {
      toast.error("Please select a subject and enter a topic");
      return;
    }

    generateProblemsMutation.mutate({ subject, topic: topic.trim() });
    setShowSolutions(false);
  };

  const handleNewSet = () => {
    setShowSolutions(false);
    setSubject("");
    setTopic("");
    generateProblemsMutation.reset();
  };

  const data = generateProblemsMutation.data?.problems as Data;
  const problems: Array<string> = data?.practice_problems || [];
  const explanations: Array<string> = data?.explanations || [];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Practice Problems
            </h1>
            <p className="text-lg text-gray-600">
              Generate custom practice problems to reinforce your learning
            </p>
          </div>

          {/* Subject and Topic Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Choose Your Practice Focus
              </CardTitle>
              <CardDescription>
                Select a subject and enter a topic to generate tailored practice problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
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
                  <label className="text-sm font-medium">Topic</label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., Algebra, Cell Biology, World War II)"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={generateProblems} 
                  disabled={generateProblemsMutation.isPending || !subject || !topic.trim()}
                  className="flex-1"
                >
                  {generateProblemsMutation.isPending ? "Generating Problems..." : "Generate Practice Problems"}
                </Button>
                
                {problems.length > 0 && (
                  <Button variant="outline" onClick={handleNewSet}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Set
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generated Problems */}
          {generateProblemsMutation.isPending && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Generating practice problems...</span>
              </CardContent>
            </Card>
          )}

          {generateProblemsMutation.error && (
            <Card>
              <CardContent className="text-center py-12 text-red-500">
                <p>Failed to generate practice problems. Please try again.</p>
              </CardContent>
            </Card>
          )}

          {problems.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {subject} - {topic} Practice
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setShowSolutions(!showSolutions)}
                >
                  {showSolutions ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Hide Solutions
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Show Solutions
                    </>
                  )}
                </Button>
              </div>

              {problems.map((problem, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Problem {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-900 font-medium">
                          {problem}
                        </p>
                      </div>

                      {showSolutions && (
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                          <h4 className="font-medium text-green-900 mb-2">Solution:</h4>
                          <div className="whitespace-pre-line text-green-800">
                            {explanations[index]}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-gradient-to-r from-blue-50 to-green-50">
                <CardContent className="text-center py-6">
                  <p className="text-gray-600 mb-4">
                    Great job working through these practice problems! 
                  </p>
                  <div className="space-x-3">
                    <Button onClick={generateProblems}>
                      Generate More Problems
                    </Button>
                    <Button variant="outline" onClick={handleNewSet}>
                      Try Different Topic
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
