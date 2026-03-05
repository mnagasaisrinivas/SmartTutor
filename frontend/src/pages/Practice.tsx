
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, CheckCircle, XCircle, RotateCcw, Sparkles, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useGeneratePracticeProblems } from "@/hooks/useAI";
import { SUBJECTS } from "@/constants";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const Practice = () => {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [showSolutions, setShowSolutions] = useState(false);

  const generateProblemsMutation = useGeneratePracticeProblems();

  const preprocessLaTeX = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, equation) => `$$${equation}$$`)
      .replace(/\\\(([\s\S]*?)\\\)/g, (_, equation) => `$${equation}$`)
      .replace(/(^|\n)\[\s*([\s\S]*?)\s*\](\n|$)/g, (_, start, equation, end) => `${start}$$${equation}$${end}`);
  };

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

  const problems = generateProblemsMutation.data?.problems.practice_problems || [];
  const explanations = generateProblemsMutation.data?.problems.explanations || [];
  
  const formatProblem = (problem: string, explanation: string, index: number, total: number) => {
    return (
      <div key={index} className="relative pl-10 pb-10 last:pb-0">
        {/* Connection Line */}
        {index < total - 1 && (
          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-100" />
        )}
        
        {/* Number Circle */}
        <div className="absolute left-0 top-0 w-8 h-8 bg-white border-2 border-green-600 text-green-600 rounded-full flex items-center justify-center font-bold text-sm shadow-sm z-10">
          {index + 1}
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="prose prose-slate max-w-none prose-p:my-0 text-slate-800 text-base leading-relaxed">
              <ReactMarkdown 
                remarkPlugins={[remarkMath]} 
                rehypePlugins={[rehypeKatex]}
              >
                {preprocessLaTeX(problem)}
              </ReactMarkdown>
            </div>
          </div>

          {showSolutions && (
            <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-top-2 duration-500">
              <h4 className="flex items-center text-sm font-bold text-green-700 mb-3 uppercase tracking-wider">
                <CheckCircle className="h-4 w-4 mr-2" />
                Solution Breakdown
              </h4>
              <div className="prose prose-green max-w-none prose-p:my-0 text-green-800 text-sm leading-relaxed">
                 <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                  >
                    {preprocessLaTeX(explanation)}
                  </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Practice Arena
              </h1>
              <p className="text-lg text-slate-600 max-w-xl">
                Master any topic with custom-generated problems. Practice until you're perfect.
              </p>
            </div>
            <div className="bg-green-600/5 p-4 rounded-2xl border border-green-100 hidden lg:block">
              <Target className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Input Form Card */}
            <div className="lg:col-span-5">
              <Card className="border-none shadow-xl shadow-green-900/5 overflow-hidden ring-1 ring-slate-200">
                <div className="h-1.5 bg-green-600" />
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Sparkles className="h-5 w-5 mr-2 text-green-600" />
                    Configure Set
                  </CardTitle>
                  <CardDescription>
                    Define your focus area to generate problems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-700 font-semibold">Subject Area</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-lg">
                        <SelectValue placeholder="Choose a subject" />
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
                    <Label htmlFor="topic" className="text-slate-700 font-semibold">Specific Topic</Label>
                    <Input
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Algebra, Photosynthesis, WW2"
                      className="h-11 bg-slate-50 border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    <Button 
                      onClick={generateProblems} 
                      disabled={generateProblemsMutation.isPending || !subject || !topic.trim()}
                      className="h-12 text-base font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
                    >
                      {generateProblemsMutation.isPending ? (
                        <>
                           <span className="mr-2 animate-pulse">Generating</span>
                           <span className="animate-bounce">.</span>
                           <span className="animate-bounce [animation-delay:0.2s]">.</span>
                           <span className="animate-bounce [animation-delay:0.4s]">.</span>
                        </>
                      ) : (
                        "Generate Practice Set"
                      )}
                    </Button>
                    
                    {problems.length > 0 && (
                      <Button variant="ghost" onClick={handleNewSet} className="h-11">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset All
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-7">
              <Card className="border-none shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 overflow-hidden min-h-[500px] flex flex-col">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Practice Set</CardTitle>
                      <CardDescription>
                        {problems.length > 0 
                          ? `${subject}: ${topic}` 
                          : "Your challenges will appear here"
                        }
                      </CardDescription>
                    </div>
                    {problems.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSolutions(!showSolutions)}
                        className={cn(
                          "h-9 rounded-lg border-slate-200 bg-white",
                          showSolutions && "bg-green-50 border-green-200 text-green-700"
                        )}
                      >
                        {showSolutions ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Hide Solutions
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Reveal Solutions
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  {generateProblemsMutation.isPending ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-6">
                      <div className="relative">
                        <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 bg-green-400 opacity-20"></div>
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
                      </div>
                      <p className="font-semibold text-slate-900">Curating custom problems...</p>
                    </div>
                  ) : problems.length > 0 ? (
                    <div className="p-6 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="mb-8">
                         <h3 className="flex items-center text-lg font-bold text-slate-800">
                           <div className="h-6 w-1 bg-green-600 rounded-full mr-3" />
                           Challenge List
                         </h3>
                      </div>
                      
                      {problems.map((problem, index) => 
                        formatProblem(problem, explanations[index], index, problems.length)
                      )}

                      <div className="mt-12 p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl border border-green-100 text-center">
                        <Sparkles className="h-8 w-8 text-green-600 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Set Complete?</h4>
                        <p className="text-slate-600 mb-6">
                          Ready for another round or want to try a different topic?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button onClick={generateProblems} className="bg-green-600 hover:bg-green-700">
                            Refresh These Problems
                          </Button>
                          <Button variant="outline" onClick={handleNewSet}>
                            Change Topic
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : generateProblemsMutation.error ? (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                      <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                         <XCircle className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Something went wrong</h3>
                      <p className="text-slate-500 max-w-xs">
                        We couldn't generate problems at this time. Please try again.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={generateProblems} 
                        className="mt-6"
                      >
                        Retry Generation
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                      <div className="h-20 w-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                        <Target className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Practice Makes Perfect</h3>
                      <p className="text-slate-500 max-w-sm">
                        Select a subject and enter a topic on the left to get a customized set of practice problems with step-by-step solutions.
                      </p>
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

export default Practice;
