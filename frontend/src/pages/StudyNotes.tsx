
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save, BookOpen, Sparkles, Copy, Check, Send, RotateCcw, Lightbulb, ListChecks, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useGenerateStudyNotes, useSaveNotes } from "@/hooks/useAI";
import { SUBJECTS } from "@/constants";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const StudyNotes = () => {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generateNotesMutation = useGenerateStudyNotes();
  const saveNotesMutation = useSaveNotes();

  const preprocessLaTeX = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, equation) => `$$${equation}$$`)
      .replace(/\\\(([\s\S]*?)\\\)/g, (_, equation) => `$${equation}$`)
      .replace(/(^|\n)\[\s*([\s\S]*?)\s*\](\n|$)/g, (_, start, equation, end) => `${start}$$${equation}$${end}`);
  };

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

  const handleCopy = () => {
    if (!generateNotesMutation.data) return;
    
    const { content } = generateNotesMutation.data;
    const text = `
Study Notes: ${content.heading}
Subject: ${subject}
Topic: ${topic}

Key Points:
${content.bullet_points.map((point, i) => `${i + 1}. ${point}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Notes copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleNewNotes = () => {
    setTopic("");
    setSubject("");
    setIsSaved(false);
    generateNotesMutation.reset();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Study Notes Generator
              </h1>
              <p className="text-lg text-slate-600 max-w-xl">
                Transform any topic into a structured, comprehensive study guide using advanced AI reasoning.
              </p>
            </div>
            <div className="bg-orange-600/5 p-4 rounded-2xl border border-orange-100 hidden lg:block">
              <FileText className="h-12 w-12 text-orange-600" />
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Input Form Column */}
            <div className="lg:col-span-4">
              <Card className="border-none shadow-xl shadow-orange-900/5 overflow-hidden ring-1 ring-slate-200 sticky top-24">
                <div className="h-1.5 bg-orange-600" />
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Sparkles className="h-5 w-5 mr-2 text-orange-600" />
                    Configure Guide
                  </CardTitle>
                  <CardDescription>
                    Provide topic details for your notes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={generateNotes} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-slate-700 font-semibold">Subject Area</Label>
                      <Select value={subject} onValueChange={setSubject}>
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
                      <Label htmlFor="topic" className="text-slate-700 font-semibold">Topic to Summarize</Label>
                      <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Mitosis, French Revolution"
                        className="h-11 bg-slate-50 border-slate-200 rounded-lg"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-bold bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all active:scale-[0.98]" 
                      disabled={generateNotesMutation.isPending}
                    >
                      {generateNotesMutation.isPending ? (
                        <>
                          <span className="mr-2 animate-pulse">Analyzing</span>
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce [animation-delay:0.2s]">.</span>
                          <span className="animate-bounce [animation-delay:0.4s]">.</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Generate Notes
                        </>
                      )}
                    </Button>
                  </form>

                  {generateNotesMutation.data && (
                    <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={handleSave}
                        disabled={isSaved || saveNotesMutation.isPending}
                        className={cn(
                          "h-11 rounded-lg border-slate-200 hover:bg-slate-50 transition-all",
                          isSaved && "bg-green-50 border-green-100 text-green-600 hover:bg-green-50"
                        )}
                      >
                        <Save className={cn("h-4 w-4 mr-2", isSaved && "fill-current")} />
                        {isSaved ? "Saved" : "Save"}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handleNewNotes}
                        className="h-11 rounded-lg hover:bg-slate-100"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notes Display Column */}
            <div className="lg:col-span-8">
              <Card className="border-none shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 overflow-hidden min-h-[500px] flex flex-col">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Content Viewer</CardTitle>
                      <CardDescription>
                        {generateNotesMutation.data 
                          ? "Generated Study Material" 
                          : "Results will appear here"
                        }
                      </CardDescription>
                    </div>
                    {generateNotesMutation.data && (
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
                  {generateNotesMutation.isPending ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-6">
                      <div className="relative">
                        <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 bg-orange-400 opacity-20"></div>
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="font-semibold text-slate-900">Synthesizing Core Concepts</p>
                        <p className="text-sm text-slate-500 animate-pulse italic">Scanning information libraries...</p>
                      </div>
                    </div>
                  ) : generateNotesMutation.data ? (
                    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {/* Note Context Header */}
                      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <BookOpen className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center space-x-2 mb-3">
                             <span className="text-xs font-black uppercase tracking-widest px-2.5 py-1 bg-orange-500 rounded text-white shadow-sm">
                               {subject}
                             </span>
                             <span className="text-xs font-bold text-slate-400">
                               Generated on {new Date().toLocaleDateString()}
                             </span>
                          </div>
                          <h2 className="text-2xl font-black leading-tight mb-1">
                            {generateNotesMutation.data.content.heading}
                          </h2>
                          <p className="text-slate-400 font-medium">Topic: {topic}</p>
                        </div>
                      </div>

                      {/* Key Points Section */}
                      <div className="space-y-6">
                        <h3 className="flex items-center text-lg font-black text-slate-800 uppercase tracking-tight">
                          <ListChecks className="h-5 w-5 mr-3 text-orange-600" />
                          Key Takeaways & Concepts
                        </h3>
                        
                        <div className="grid gap-4">
                          {generateNotesMutation.data.content.bullet_points.map((point, index) => (
                            <div key={index} className="group relative">
                              <div className="absolute -left-2 top-0 bottom-0 w-1 bg-orange-100 rounded-full group-hover:bg-orange-500 transition-colors" />
                              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-300">
                                <div className="flex gap-4">
                                  <div className="h-6 w-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 text-xs font-black mt-0.5">
                                    {index + 1}
                                  </div>
                                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium">
                                    <ReactMarkdown 
                                      remarkPlugins={[remarkMath]} 
                                      rehypePlugins={[rehypeKatex]}
                                      components={{
                                        strong: ({_node, ...props}) => <span className="text-orange-700 font-black bg-orange-50/50 px-1 rounded" {...props} />
                                      }}
                                    >
                                      {preprocessLaTeX(point)}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Study Tip Box */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100 relative overflow-hidden">
                        <div className="relative z-10">
                          <h4 className="flex items-center text-blue-900 font-bold mb-2">
                            <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                            Study Tip
                          </h4>
                          <p className="text-blue-800 text-sm leading-relaxed">
                            Review these notes within 24 hours to maximize retention. Use the <strong>Practice Arena</strong> or <strong>Knowledge Quiz</strong> to test your understanding of these specific points.
                          </p>
                          <Button variant="link" className="p-0 h-auto text-blue-600 font-bold mt-3 group" asChild>
                            <a href="/practice" className="flex items-center text-xs uppercase tracking-widest">
                              Try practice problems <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                      <div className="h-20 w-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                        <FileText className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Knowledge Compilation</h3>
                      <p className="text-slate-500 max-w-sm">
                        Enter a complex topic on the left, and I'll break it down into high-quality, structured study notes.
                      </p>
                      <div className="flex gap-2 mt-8">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Markdown Enabled</span>
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-tighter">LaTeX Rendering</span>
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

export default StudyNotes;
