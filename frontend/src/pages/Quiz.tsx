
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BookOpen, CheckCircle, XCircle, Trophy, RotateCcw, Sparkles, ArrowRight, ArrowLeft, Brain, Check } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useGenerateQuiz } from "@/hooks/useAI";
import { SUBJECTS } from "@/constants";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const Quiz = () => {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const generateQuizMutation = useGenerateQuiz();

  const preprocessLaTeX = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, equation) => `$$${equation}$$`)
      .replace(/\\\(([\s\S]*?)\\\)/g, (_, equation) => `$${equation}$`)
      .replace(/(^|\n)\[\s*([\s\S]*?)\s*\](\n|$)/g, (_, start, equation, end) => `${start}$$${equation}$${end}`);
  };

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
  const score = calculateScore();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Knowledge Quiz
              </h1>
              <p className="text-lg text-slate-600 max-w-xl">
                Challenge yourself with AI-generated questions tailored to your learning goals.
              </p>
            </div>
            <div className="bg-purple-600/5 p-4 rounded-2xl border border-purple-100 hidden lg:block">
              <BookOpen className="h-12 w-12 text-purple-600" />
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Configuration Column */}
            <div className="lg:col-span-4">
              <Card className="border-none shadow-xl shadow-purple-900/5 overflow-hidden ring-1 ring-slate-200 sticky top-24">
                <div className="h-1.5 bg-purple-600" />
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                    Quiz Setup
                  </CardTitle>
                  <CardDescription>
                    Configure your assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-700 font-semibold">Subject</Label>
                    <Select value={subject} onValueChange={setSubject} disabled={generateQuizMutation.isPending || (!!quiz && !showResults)}>
                      <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-lg">
                        <SelectValue placeholder="Choose subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((subj) => (
                          <SelectItem key={subj} value={subj}>
                            {subj}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic" className="text-slate-700 font-semibold">Topic (Optional)</Label>
                    <Input
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Quantum Physics"
                      className="h-11 bg-slate-50 border-slate-200 rounded-lg"
                      disabled={generateQuizMutation.isPending || (!!quiz && !showResults)}
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    {!quiz || showResults ? (
                      <Button 
                        onClick={generateQuiz} 
                        disabled={generateQuizMutation.isPending || !subject}
                        className="h-12 text-base font-bold bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all active:scale-[0.98]"
                      >
                        {generateQuizMutation.isPending ? (
                          <>
                             <span className="mr-2 animate-pulse">Building</span>
                             <span className="animate-bounce">.</span>
                             <span className="animate-bounce [animation-delay:0.2s]">.</span>
                             <span className="animate-bounce [animation-delay:0.4s]">.</span>
                          </>
                        ) : (
                          "Start New Quiz"
                        )}
                      </Button>
                    ) : (
                      <Button variant="ghost" onClick={handleNewQuiz} className="h-11 text-slate-600">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Cancel Quiz
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quiz Content Column */}
            <div className="lg:col-span-8">
              {!quiz ? (
                <Card className="border-none shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 overflow-hidden min-h-[400px] flex items-center justify-center bg-white/50 border-dashed">
                   <div className="text-center p-8">
                      <div className="h-20 w-20 bg-purple-50 text-purple-300 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <Brain className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Ready for a Challenge?</h3>
                      <p className="text-slate-500 max-w-sm">
                        Select your parameters on the left to generate a personalized multiple-choice quiz.
                      </p>
                   </div>
                </Card>
              ) : showResults ? (
                /* Results View */
                <Card className="border-none shadow-2xl shadow-purple-900/10 ring-1 ring-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-10 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Trophy className="h-40 w-40 rotate-12" />
                    </div>
                    <div className="relative z-10">
                      <div className="h-20 w-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30">
                        <Trophy className={cn("h-10 w-10", score >= 70 ? "text-yellow-300" : "text-slate-200")} />
                      </div>
                      <h2 className="text-3xl font-black mb-2">Quiz Complete!</h2>
                      <div className="flex items-center justify-center space-x-4 mb-6">
                        <div className="text-6xl font-black tracking-tighter">{score}%</div>
                        <div className="h-12 w-px bg-white/30" />
                        <div className="text-left leading-tight">
                          <div className="text-xl font-bold">{questions.filter(q => answers[q.id] === q.correctAnswer).length}/{questions.length}</div>
                          <div className="text-xs uppercase tracking-widest text-purple-100 font-bold">Correct Answers</div>
                        </div>
                      </div>
                      <p className="text-purple-100 font-medium">
                        {score >= 90 ? "Incredible performance! You're a master." :
                         score >= 70 ? "Great job! You have a solid understanding." :
                         score >= 50 ? "Good effort! A bit more study and you'll be there." :
                         "Keep practicing! Every mistake is a learning opportunity."}
                      </p>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Performance Review</h3>
                    {questions.map((question, index) => {
                      const isCorrect = answers[question.id] === question.correctAnswer;
                      return (
                        <div key={index} className="group">
                          <div className={cn(
                            "p-5 rounded-2xl border transition-all duration-300",
                            isCorrect ? "bg-green-50/30 border-green-100" : "bg-red-50/30 border-red-100"
                          )}>
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                              )}>
                                {isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-slate-900 mb-3 leading-relaxed">
                                  <span className="text-slate-400 mr-2">#{index + 1}</span>
                                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {preprocessLaTeX(question.question)}
                                  </ReactMarkdown>
                                </p>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <div className="p-3 rounded-xl bg-white border border-slate-100">
                                    <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Your Answer</span>
                                    <div className={cn("text-sm font-medium", isCorrect ? "text-green-700" : "text-red-700")}>
                                      {question.options[answers[question.id]] || "Skipped"}
                                    </div>
                                  </div>
                                  {!isCorrect && (
                                    <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                                      <span className="text-[10px] uppercase font-black text-green-600 block mb-1">Correct Answer</span>
                                      <div className="text-sm font-bold text-green-800">
                                        {question.options[question.correctAnswer]}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-6 flex justify-center">
                       <Button onClick={handleNewQuiz} variant="outline" className="h-12 px-8 rounded-xl font-bold">
                         Try Another Subject
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Question View */
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  {/* Progress Header */}
                  <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                        Question {currentQuestion + 1} / {questions.length}
                      </div>
                      <h2 className="text-sm font-bold text-slate-500 truncate max-w-[200px]">
                        {quiz.subject}
                      </h2>
                    </div>
                    <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full transition-all duration-500 ease-out"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <Card className="border-none shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                      <CardTitle className="text-2xl font-extrabold text-slate-900 leading-tight">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {preprocessLaTeX(questions[currentQuestion].question)}
                        </ReactMarkdown>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid gap-4">
                        {questions[currentQuestion].options.map((option, index) => {
                          const isSelected = answers[questions[currentQuestion].id] === index;
                          return (
                            <button
                              key={index}
                              onClick={() => handleAnswerSelect(questions[currentQuestion].id, index)}
                              className={cn(
                                "flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all duration-200 group relative overflow-hidden",
                                isSelected 
                                  ? "border-purple-600 bg-purple-50 ring-4 ring-purple-100" 
                                  : "border-slate-100 hover:border-purple-200 hover:bg-slate-50"
                              )}
                            >
                              <div className="flex items-center gap-4 relative z-10">
                                <div className={cn(
                                  "h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm transition-colors",
                                  isSelected ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-600"
                                )}>
                                  {String.fromCharCode(65 + index)}
                                </div>
                                <div className={cn(
                                  "font-medium text-lg leading-snug transition-colors",
                                  isSelected ? "text-purple-900 font-bold" : "text-slate-700"
                                )}>
                                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                    {preprocessLaTeX(option)}
                                  </ReactMarkdown>
                                </div>
                              </div>
                              {isSelected && (
                                <div className="h-6 w-6 bg-purple-600 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                  <Check className="h-3.5 w-3.5 text-white stroke-[4]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center pt-10 border-t border-slate-100 mt-8">
                        <Button
                          variant="ghost"
                          onClick={handlePrevious}
                          disabled={currentQuestion === 0}
                          className="h-12 px-6 rounded-xl font-bold text-slate-500"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                        
                        <Button
                          onClick={handleNext}
                          disabled={answers[questions[currentQuestion].id] === undefined}
                          className={cn(
                            "h-12 px-10 rounded-xl font-bold shadow-lg transition-all",
                            currentQuestion === questions.length - 1 
                              ? "bg-purple-600 hover:bg-purple-700 shadow-purple-200" 
                              : "bg-slate-900 hover:bg-slate-800 shadow-slate-200"
                          )}
                        >
                          {currentQuestion === questions.length - 1 ? (
                            <>Submit Quiz <CheckCircle className="h-4 w-4 ml-2" /></>
                          ) : (
                            <>Next Question <ArrowRight className="h-4 w-4 ml-2" /></>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {generateQuizMutation.isPending && (
                <div className="flex flex-col items-center justify-center py-24 space-y-6">
                  <div className="relative">
                    <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 bg-purple-400 opacity-20"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                  </div>
                  <p className="font-semibold text-slate-900">Assembling your knowledge check...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
