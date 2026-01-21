import { useState } from "react";
import { 
  GraduationCap, 
  ChevronLeft, 
  PlayCircle, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  ChevronRight,
  Clock,
  Lock,
  Download,
  Calendar,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

export default function CoursePlayer() {
  const [activeLesson, setActiveLesson] = useState(1);

  // 32-week structure implementation based on user request:
  // 6 OA * 5 weeks each = 30 weeks + 1 vacation + 2 final evaluations
  const weeks = Array.from({ length: 32 }, (_, i) => {
    const weekNum = i + 1;
    let type = "learning";
    let title = `Semana ${weekNum}: `;
    
    if (weekNum === 16) {
      type = "vacation";
      title += "Receso Académico";
    } else if (weekNum > 30) {
      type = "evaluation";
      title += "Evaluación General Final";
    } else {
      const oaNum = Math.ceil(weekNum / 5);
      const themeNum = ((weekNum - 1) % 5) + 1;
      title += `OA ${oaNum} - Tema ${themeNum}`;
    }

    return {
      id: weekNum,
      title,
      type,
      lessons: type === 'learning' ? [
        { id: weekNum * 10 + 1, title: "Video Tutorial: Conceptos Clave", type: "video", duration: "15 min", status: weekNum === 1 ? "current" : "locked" },
        { id: weekNum * 10 + 2, title: "Lectura: Material de Profundización", type: "pdf", duration: "20 min", status: "locked" },
        { id: weekNum * 10 + 3, title: "Actividad de Redacción", type: "assignment", duration: "30 min", status: "locked" },
        { id: weekNum * 10 + 4, title: "Test de Salida Semanal", type: "quiz", duration: "10 min", status: "locked" }
      ] : []
    };
  });

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-[#1e1e1e]">
      {/* Sidebar Navigation - 32 Week Roadmap */}
      <aside className="w-80 border-r border-gray-100 flex flex-col bg-[#fcfcfc] shrink-0">
        <div className="p-6 border-b border-gray-100 bg-white">
          <a href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#a51c30] mb-6 hover:translate-x-1 transition-all">
            <ChevronLeft className="w-4 h-4" /> Mi Escritorio
          </a>
          <h1 className="text-xl font-serif font-black leading-tight mb-2">Lengua y Literatura</h1>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
             <Calendar className="w-3 h-3" /> 32 Semanas • 7° Básico
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {weeks.map((week) => (
              <div key={week.id} className="rounded-none overflow-hidden">
                <div className={`px-4 py-3 flex items-center justify-between ${week.type === 'vacation' ? 'bg-emerald-50 text-emerald-700' : week.type === 'evaluation' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-500'}`}>
                  <span className="text-[9px] font-black uppercase tracking-widest">{week.title}</span>
                  {week.type === 'learning' && <ChevronRight className="w-3 h-3 opacity-30" />}
                </div>
                {week.id === 1 && (
                  <div className="bg-white">
                    {week.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson.id)}
                        className={`w-full text-left px-6 py-4 flex items-start gap-4 transition-all border-l-2 ${activeLesson === lesson.id ? 'border-[#a51c30] bg-[#a51c30]/5' : 'border-transparent hover:bg-gray-50'}`}
                      >
                         <div className="mt-1">
                            {lesson.type === 'video' ? <PlayCircle className="w-4 h-4 text-gray-300" /> : <FileText className="w-4 h-4 text-gray-300" />}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold truncate">{lesson.title}</p>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{lesson.duration}</span>
                         </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Lesson View */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-5xl mx-auto px-12 py-16 space-y-12">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-8">
             <div className="space-y-1">
                <Badge className="bg-[#a51c30]/10 text-[#a51c30] rounded-none border-none text-[9px] font-black uppercase tracking-widest mb-2">Semana 1 • Tema 1</Badge>
                <h2 className="text-4xl font-serif font-black italic">Análisis de Narraciones</h2>
             </div>
             <div className="text-right space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Progreso de la Asignatura</div>
                <div className="flex items-center gap-4">
                   <div className="w-32 h-1 bg-gray-100">
                      <div className="h-full bg-[#a51c30] w-[5%]" />
                   </div>
                   <span className="text-xs font-black">1 / 32</span>
                </div>
             </div>
          </div>

          {/* Video Placeholder */}
          <div className="aspect-video bg-[#1e1e1e] flex items-center justify-center relative group shadow-2xl">
             <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-all cursor-pointer">
                <PlayCircle className="w-10 h-10 text-white" />
             </div>
             <div className="absolute bottom-6 left-8 flex items-center gap-4">
                <Badge className="bg-white/10 text-white backdrop-blur-md border-none rounded-none text-[8px] font-black uppercase tracking-widest px-3 py-1">HD • 15:00</Badge>
             </div>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
             <div className="lg:col-span-8 space-y-10">
                <div className="prose prose-gray max-w-none">
                   <p className="text-xl text-gray-600 leading-relaxed font-medium">
                      Bienvenido a la primera semana de Lengua y Literatura. Durante este OA1 (Objetivo de Aprendizaje 1), nos enfocaremos en desglosar cómo los conflictos narrativos impulsan la historia. 
                   </p>
                   <div className="p-10 bg-gray-50 border-l-4 border-[#a51c30] my-10">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#a51c30] mb-4">Misión de la Semana</h4>
                      <p className="text-lg font-serif italic text-[#1e1e1e]">
                         "Identificarás el conflicto central en tres micro-cuentos y redactarás un breve análisis sobre cómo la voz del narrador afecta tu percepción del dilema."
                      </p>
                   </div>
                </div>

                {/* Resource List */}
                <div className="space-y-6">
                   <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400">Material de Descarga</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: "Guía de Análisis OA1", type: "PDF", size: "1.5 MB" },
                        { title: "Ficha de Narradores", type: "PDF", size: "800 KB" }
                      ].map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-6 border border-gray-100 hover:border-[#a51c30]/20 transition-all group cursor-pointer">
                           <div className="flex items-center gap-4">
                              <Download className="w-5 h-5 text-gray-300 group-hover:text-[#a51c30]" />
                              <div>
                                 <p className="text-sm font-bold">{doc.title}</p>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{doc.type} • {doc.size}</p>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Right Sidebar - Weekly Stats */}
             <div className="lg:col-span-4 space-y-8">
                <Card className="border-none bg-[#f9f9f9] p-8 rounded-none">
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <BarChart className="w-5 h-5 text-[#a51c30]" />
                         <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Hábito Semanal</h4>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-gray-400">Día 2/5 completado</span>
                            <span>40%</span>
                         </div>
                         <Progress value={40} className="h-1 bg-gray-200" />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight">
                         Recuerda: El viernes a las 23:59 cierra el Test OA1.
                      </p>
                   </div>
                </Card>

                {/* Task Checklist */}
                <div className="space-y-6 p-2">
                   <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Tareas de la Lección</h4>
                   <div className="space-y-4">
                      {[
                        { label: "Ver Video OA1", done: true },
                        { label: "Lectura Narradores", done: false },
                        { label: "Actividad Redacción", done: false },
                        { label: "Test Final OA1", done: false },
                      ].map((task, i) => (
                        <div key={i} className="flex items-center gap-4">
                           <div className={`w-5 h-5 border-2 flex items-center justify-center ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200'}`}>
                              {task.done && <CheckSquare className="w-3 h-3 text-white" />}
                           </div>
                           <span className={`text-xs font-bold uppercase tracking-tight ${task.done ? 'text-gray-300 line-through' : 'text-gray-600'}`}>{task.label}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}