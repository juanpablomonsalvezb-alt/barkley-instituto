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
  BarChart,
  BookOpen,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export default function CoursePlayer() {
  const [activeLesson, setActiveLesson] = useState(1);

  // 33-week structure implementation:
  // 31 weeks of class + Week 15 (Midterm Macro) + Week 33 (Final Macro)
  const weeks = Array.from({ length: 33 }, (_, i) => {
    const weekNum = i + 1;
    let type = "learning";
    let title = `Semana ${weekNum}: `;
    
    if (weekNum === 15) {
      type = "macro-evaluation";
      title += "EVALUACIÓN MACRO (Mitad de Ciclo)";
    } else if (weekNum === 33) {
      type = "macro-evaluation";
      title += "EVALUACIÓN MACRO FINAL";
    } else {
      // Adjust learning week logic to skip week 15 in the OA count
      const learningWeekIndex = weekNum > 15 ? weekNum - 1 : weekNum;
      const oaNum = Math.ceil(learningWeekIndex / 5.16); // Distribute 6 OAs over 31 weeks
      title += `OA ${oaNum > 6 ? 6 : oaNum} - Unidad Temática`;
    }

    return {
      id: weekNum,
      title,
      type,
      lessons: type === 'learning' ? [
        { id: weekNum * 10 + 1, title: "1. Conceptos Fundamentales (Video)", type: "video", duration: "12 min", status: weekNum === 1 ? "current" : "locked" },
        { id: weekNum * 10 + 2, title: "2. Aplicación Práctica & Casos", type: "video", duration: "18 min", status: "locked" },
        { id: weekNum * 10 + 3, title: "3. Guía de Ejercitación Dirigida", type: "pdf", duration: "25 min", status: "locked" },
        { id: weekNum * 10 + 4, title: "4. Laboratorio de Resolución", type: "assignment", duration: "45 min", status: "locked" },
        { id: weekNum * 10 + 5, title: "5. Check-point Semanal", type: "quiz", duration: "15 min", status: "locked" }
      ] : [
        { id: weekNum * 10 + 1, title: "Instrucciones de la Evaluación", type: "pdf", duration: "5 min", status: "current" },
        { id: weekNum * 10 + 2, title: "Examen Macro de la Asignatura", type: "quiz", duration: "90 min", status: "locked" }
      ]
    };
  });

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-[#1e1e1e]">
      {/* Sidebar Navigation - 33 Week Roadmap */}
      <aside className="w-80 border-r border-gray-100 flex flex-col bg-[#fcfcfc] shrink-0">
        <div className="p-6 border-b border-gray-100 bg-white">
          <a href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#a51c30] mb-6 hover:translate-x-1 transition-all">
            <ChevronLeft className="w-4 h-4" /> Escritorio
          </a>
          <h1 className="text-xl font-serif font-black leading-tight mb-2">Matemática Pro</h1>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
             <Calendar className="w-3 h-3" /> 33 Semanas • Harvard Style
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {weeks.map((week) => (
              <div key={week.id} className="rounded-none overflow-hidden">
                <div className={`px-4 py-3 flex items-center justify-between transition-all ${week.type === 'macro-evaluation' ? 'bg-[#a51c30] text-white shadow-lg z-10' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${week.type === 'macro-evaluation' ? 'text-white' : 'text-gray-400'}`}>{week.title}</span>
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
          {/* Harvard Pedagogy Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-8">
             <div className="space-y-1">
                <Badge className="bg-[#a51c30]/10 text-[#a51c30] rounded-none border-none text-[9px] font-black uppercase tracking-widest mb-2">Matemática • Semana 1</Badge>
                <h2 className="text-4xl font-serif font-black italic">Números Enteros y Modelamiento</h2>
             </div>
             <div className="flex items-center gap-8">
                <div className="text-center">
                   <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Esfuerzo Estimado</div>
                   <div className="text-sm font-bold">2.5 Horas</div>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div className="text-center">
                   <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Dificultad</div>
                   <Badge className="bg-emerald-50 text-emerald-600 rounded-none border-none text-[8px] font-black">Nivel 1</Badge>
                </div>
             </div>
          </div>

          {/* Harvard Style Video Section */}
          <div className="space-y-6">
             <div className="aspect-video bg-[#1e1e1e] flex items-center justify-center relative group shadow-2xl">
                <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-all cursor-pointer">
                   <PlayCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute top-0 left-0 p-8">
                   <span className="text-white/20 text-6xl font-serif italic font-black">01</span>
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center italic">"La matemática no es calcular, es razonar sobre estructuras" — Facultad de Educación, Harvard.</p>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
             <div className="lg:col-span-8 space-y-12">
                <div className="prose prose-gray max-w-none">
                   <h3 className="text-2xl font-serif font-black text-[#1e1e1e] mb-6">El Enfoque Harvard en Matemática</h3>
                   <p className="text-lg text-gray-600 leading-relaxed">
                      A diferencia del aprendizaje tradicional basado en repetición, nuestro modelo utiliza el <strong>Active Learning</strong>. Cada semana se divide en tres momentos críticos: 
                   </p>
                   <div className="grid grid-cols-1 gap-6 my-10">
                      {[
                        { title: "Momento 1: Conceptualización", desc: "Video corto enfocado en el 'por qué' matemático antes del 'cómo'." },
                        { title: "Momento 2: Resolución de Problemas", desc: "Guías interactivas donde el error es parte del proceso de andamiaje." },
                        { title: "Momento 3: Check-point", desc: "Evaluación rápida de 15 minutos para asegurar que no hay brechas antes de avanzar." }
                      ].map((moment, i) => (
                        <div key={i} className="flex gap-6 p-6 border border-gray-50 bg-gray-50/30">
                           <div className="w-10 h-10 bg-[#a51c30] text-white flex items-center justify-center font-black italic shrink-0">{i+1}</div>
                           <div>
                              <h4 className="text-sm font-black uppercase tracking-widest mb-1">{moment.title}</h4>
                              <p className="text-sm text-gray-500">{moment.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Resource List */}
                <div className="space-y-6">
                   <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400">Recursos de Aprendizaje Activo</h3>
                   <div className="grid grid-cols-1 gap-3">
                      {[
                        { title: "Laboratorio de Números Enteros", type: "Interactivo", size: "Cloud" },
                        { title: "Set de Ejercicios Mineduc OA1", type: "PDF", size: "2.1 MB" }
                      ].map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-5 border border-gray-100 hover:bg-gray-50 transition-all group cursor-pointer">
                           <div className="flex items-center gap-4">
                              <Download className="w-4 h-4 text-gray-300 group-hover:text-[#a51c30]" />
                              <div>
                                 <p className="text-xs font-bold">{doc.title}</p>
                                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{doc.type} • {doc.size}</p>
                              </div>
                           </div>
                           <ChevronRight className="w-4 h-4 text-gray-200" />
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Right Sidebar - Weekly Progress */}
             <div className="lg:col-span-4 space-y-10">
                <Card className="border-none bg-[#1e1e1e] text-white p-10 rounded-none shadow-xl">
                   <div className="space-y-8">
                      <div className="flex items-center gap-3">
                         <Target className="w-5 h-5 text-[#a51c30]" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Objetivo de la Semana</h4>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed font-medium">
                        Dominar la representación de números enteros en la recta numérica y su aplicación en contextos reales de temperatura y altitud.
                      </p>
                      <div className="pt-6 border-t border-white/10">
                         <Button className="w-full bg-[#a51c30] hover:bg-[#821626] text-white rounded-none h-14 text-[10px] font-black uppercase tracking-[0.3em]">Empezar Ráfaga 20m</Button>
                      </div>
                   </div>
                </Card>

                <div className="p-8 border-l-4 border-amber-500 bg-amber-50/50 space-y-4">
                   <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Hito Próximo</h5>
                   <p className="text-xs font-bold text-gray-600 uppercase tracking-tight">Semana 15: Evaluación Macro 1</p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}