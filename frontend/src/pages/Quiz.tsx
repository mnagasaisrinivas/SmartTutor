import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BookOpen, CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useGenerateQuiz } from "@/hooks/useAI";

const Quiz = () => {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const generateQuizMutation = useGenerateQuiz();

  const subjects = [
    "Mathematics",
    "Science",
    "Chemistry",
    "Physics",
    "Biology",
    "History",
    "English",
    "Geography"
  ];

  const generateQuiz = () => {
    if (!subject) {
      toast.error("Please select a subject");
      return;
    }

    generateQuizMutation.mutate({ subject, topic });
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    const quiz = generateQuizMutation.data;
    if (!quiz) return;
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    const quiz = generateQuizMutation.data;
    if (!quiz) return 0;
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setSubject("");
    setTopic("");
    generateQuizMutation.reset();
  };

  const quiz = generateQuizMutation.data;
  const questions = quiz?.questions?.questions || [];

  if (showResults && questions) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Trophy className={`h-16 w-16 ${score >= 70 ? 'text-yellow-500' : 'text-gray-400'}`} />
                </div>
                <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                <CardDescription className="text-lg">
                  Here are your results for {quiz.subject}{topic && ` - ${topic}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <div className="text-4xl font-bold mb-2">
                    {score}%
                  </div>
                  <p className="text-gray-600">
                    You got {questions.filter(q => answers[q.id] === q.correctAnswer).length} out of {questions.length} questions correct
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {questions.map((question, index) => (
                    <Card key={index} className="text-left">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          {answers[question.id] === question.correctAnswer ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium mb-2">
                              Question {index + 1}: {question.question}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              Your answer: {question.options[answers[question.id]] || "Not answered"}
                            </p>
                            <p className="text-sm text-green-700">
                              Correct answer: {question.options[question.correctAnswer]}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-x-3">
                  <Button onClick={generateQuiz}>
                    Take Another Quiz
                  </Button>
                  <Button variant="outline" onClick={handleNewQuiz}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Choose Different Subject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Take a Quiz
            </h1>
            <p className="text-lg text-gray-600">
              Test your knowledge with AI-generated questions
            </p>
          </div>

          {!quiz ? (
            <Card >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Create Your Quiz
                </CardTitle>
                <CardDescription>
                  Select a subject and optionally specify a topic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a subject for your quiz" />
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
                
                  <Button 
                    onClick={generateQuiz} 
                    disabled={generateQuizMutation.isPending || !subject}
                    className="flex-1"
                  >
                    {generateQuizMutation.isPending ? "Generating Quiz..." : "Create Quiz"}
                  </Button>
                </div>

                {generateQuizMutation.error && (
                  <div className="mt-4 text-center text-red-500">
                    <p>Failed to generate quiz. Please try again.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {quiz.subject} Quiz
                </h2>
                <div className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              {/* Current Question */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Question {currentQuestion + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-lg text-gray-900">
                      {questions[currentQuestion].question}
                    </p>

                    <RadioGroup
                      value={answers[questions[currentQuestion].id]?.toString() || ""}
                      onValueChange={(value) => {
                        if (value) {
                          const optionIndex = parseInt(value);
                          handleAnswerSelect(questions[currentQuestion].id, optionIndex);
                        }
                      }}
                    >
                      {questions[currentQuestion]?.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                      >
                        Previous
                      </Button>
                      
                      <Button
                        onClick={handleNext}
                        disabled={answers[questions[currentQuestion].id] === undefined}
                      >
                        {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {generateQuizMutation.isPending && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Generating your quiz...</span>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;