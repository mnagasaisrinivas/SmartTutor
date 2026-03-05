
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Heart, Send, Copy, Check, Sparkles, BookOpen, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useGenerateExplanation, useSaveQuestion } from "@/hooks/useAI";
import { SUBJECTS } from "@/constants";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const AskQuestion = () => {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generateExplanationMutation = useGenerateExplanation();
  const saveQuestionMutation = useSaveQuestion();

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

  const handleCopy = () => {
    if (!generateExplanationMutation.data) return;
    
    const { explanation } = generateExplanationMutation.data;
    const text = `
Question: ${question}
Subject: ${subject}

${explanation.title ? `# ${explanation.title}\n` : ''}
${explanation.steps?.map((step, i) => `${i + 1}. ${step}`).join('\n\n') || ''}

Summary:
${explanation.summary || ''}
    `.trim();

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Explanation copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleNewQuestion = () => {
    setQuestion("");
    setSubject("");
    setIsSaved(false);
    generateExplanationMutation.reset();
  };

  const preprocessLaTeX = (text: string) => {
    if (!text) return "";
    return text
      // Convert \[ ... \] to $$ ... $$
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, equation) => `$$${equation}$$`)
      // Convert \( ... \) to $ ... $
      .replace(/\\\(([\s\S]*?)\\\)/g, (_, equation) => `$${equation}$`)
      // Handle cases where brackets might be used without backslashes for blocks (less common but possible)
      .replace(/(^|\n)\[\s*([\s\S]*?)\s*\](\n|$)/g, (_, start, equation, end) => `${start}$$${equation}$${end}`);
  };

  const formatSteps = (steps: string[]) => {
    return steps.map((step, index) => {
      // Remove leading numbers like "1. " or "1) "
      const cleanStep = step.replace(/^\d+[.)]\s*/, "");
      const processedStep = preprocessLaTeX(cleanStep);

      return (
        <div key={index} className="relative pl-10 pb-8 last:pb-0">
          {/* Connection Line */}
          {index < steps.length - 1 && (
            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-blue-100" />
          )}
          
          {/* Number Circle */}
          <div className="absolute left-0 top-0 w-8 h-8 bg-white border-2 border-blue-600 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm shadow-sm z-10">
            {index + 1}
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-blue-50 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-gray-700 leading-relaxed text-base prose prose-slate max-w-none prose-p:my-0 prose-headings:my-0">
              <ReactMarkdown 
                remarkPlugins={[remarkMath]} 
                rehypePlugins={[rehypeKatex]}
                components={{
                  strong: ({_node, ...props}) => <span className="text-blue-700 font-bold bg-blue-50/50 px-1 rounded" {...props} />
                }}
              >
                {processedStep}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                AI Tutor Assistance
              </h1>
              <p className="text-lg text-slate-600 max-w-xl">
                Stuck on a problem? Ask anything and get a detailed, step-by-step walkthrough to master the concept.
              </p>
            </div>
            <div className="bg-blue-600/5 p-4 rounded-2xl border border-blue-100 hidden lg:block">
              <Brain className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Question Form */}
            <div className="lg:col-span-5">
              <Card className="border-none shadow-xl shadow-blue-900/5 overflow-hidden ring-1 ring-slate-200">
                <div className="h-1.5 bg-blue-600" />
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                    New Query
                  </CardTitle>
                  <CardDescription>
                    Fill in your details for a tailored explanation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-slate-700 font-semibold">Subject Area</Label>
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-lg">
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
                      <Label htmlFor="question" className="text-slate-700 font-semibold">Your Question</Label>
                      <Textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., How do I calculate the area of a circle?"
                        className="min-h-[160px] bg-slate-50 border-slate-200 focus:ring-blue-500 rounded-lg resize-none p-4 text-base"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]" 
                      disabled={generateExplanationMutation.isPending}
                    >
                      {generateExplanationMutation.isPending ? (
                        <>
                          <span className="mr-2 animate-pulse">Generating</span>
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce [animation-delay:0.2s]">.</span>
                          <span className="animate-bounce [animation-delay:0.4s]">.</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Generate Solution
                        </>
                      )}
                    </Button>
                  </form>

                  {generateExplanationMutation.data && (
                    <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={handleSave}
                        disabled={isSaved || saveQuestionMutation.isPending}
                        className={cn(
                          "h-11 rounded-lg border-slate-200 hover:bg-slate-50 transition-all",
                          isSaved && "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-50"
                        )}
                      >
                        <Heart className={cn("h-4 w-4 mr-2", isSaved && "fill-current")} />
                        {isSaved ? "Saved" : "Save"}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handleNewQuestion}
                        className="h-11 rounded-lg hover:bg-slate-100"
                      >
                        New Search
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Explanation Display */}
            <div className="lg:col-span-7">
              <Card className="border-none shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 overflow-hidden min-h-[500px] flex flex-col">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Solution View</CardTitle>
                      <CardDescription>
                        {generateExplanationMutation.data 
                          ? "Step-by-step breakdown" 
                          : "Results will be displayed here"
                        }
                      </CardDescription>
                    </div>
                    {generateExplanationMutation.data && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleCopy}
                        className="h-9 w-9 rounded-full bg-white shadow-sm ring-1 ring-slate-200"
                      >
                        {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-slate-600" />}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  {generateExplanationMutation.isPending ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-6">
                      <div className="relative">
                        <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 bg-blue-400 opacity-20"></div>
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="font-semibold text-slate-900">Processing Knowledge Base</p>
                        <p className="text-sm text-slate-500 animate-pulse italic">Thinking like Einstein...</p>
                      </div>
                    </div>
                  ) : generateExplanationMutation.data ? (
                    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {/* Context Box */}
                      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <BookOpen className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center space-x-2 mb-2">
                             <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-500 rounded text-white">
                               {subject}
                             </span>
                          </div>
                          <p className="text-lg font-medium leading-snug">
                            "{question}"
                          </p>
                        </div>
                      </div>

                      {/* Main Explanation */}
                      <div className="space-y-8">
                        {generateExplanationMutation.data.explanation.title && (
                          <div>
                            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                              {generateExplanationMutation.data.explanation.title}
                            </h2>
                            <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full" />
                          </div>
                        )}

                        {/* Steps */}
                        {generateExplanationMutation.data.explanation.steps && generateExplanationMutation.data.explanation.steps.length > 0 && (
                          <div className="space-y-6">
                            <h3 className="flex items-center text-lg font-bold text-slate-800">
                              <div className="h-6 w-1 bg-blue-600 rounded-full mr-3" />
                              Structured Walkthrough
                            </h3>
                            <div className="space-y-2">
                              {formatSteps(generateExplanationMutation.data.explanation.steps)}
                            </div>
                          </div>
                        )}

                        {/* Summary */}
                        {generateExplanationMutation.data.explanation.summary && (
                          <div className="relative group">
                            <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-5 group-hover:opacity-10 transition-opacity" />
                            <div className="relative bg-white border border-blue-100 p-6 rounded-2xl shadow-sm">
                              <h3 className="flex items-center text-lg font-bold text-blue-900 mb-3">
                                <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                                Key Takeaway
                              </h3>
                              <div className="text-slate-700 leading-relaxed italic prose prose-slate max-w-none prose-p:my-0">
                                <ReactMarkdown 
                                  remarkPlugins={[remarkMath]} 
                                  rehypePlugins={[rehypeKatex]}
                                  components={{
                                    strong: ({_node, ...props}) => <span className="text-blue-700 font-bold bg-blue-50/50 px-1 rounded" {...props} />
                                  }}
                                >
                                  {preprocessLaTeX(generateExplanationMutation.data.explanation.summary)}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  ) : generateExplanationMutation.error ? (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                      <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                         <XCircle className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Generation Failed</h3>
                      <p className="text-slate-500 max-w-xs">
                        {generateExplanationMutation.error.message || "An unexpected error occurred. Please try again."}
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={handleSubmit} 
                        className="mt-6 border-slate-200 hover:bg-slate-50"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                      <div className="h-20 w-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                        <Brain className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Assist</h3>
                      <p className="text-slate-500 max-w-sm">
                        Submit a question on the left, and I'll generate a comprehensive explanation for you.
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-8 w-full max-w-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                          AI Reasoning
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                          Step-by-Step
                        </div>
                      </div>
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

const XCircle = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

export default AskQuestion;
