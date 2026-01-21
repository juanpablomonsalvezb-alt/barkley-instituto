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
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CoursePlayer() {
  const [activeLesson, setActiveLesson] = useState(1);

  const courseStructure = {
    title: "Neurociencia de la Voluntad",
    weeks: [
      {
        id: 1,
        title: "Semana 1: El Punto de Acción",
        lessons: [
          { id: 1, title: "Introducción al Método Barkley", type: "video", duration: "12 min", status: "completed" },
          { id: 2, title: "La Brecha de Intención-Acción", type: "video", duration: "18 min", status: "current" },
          { id: 3, title: "Lectura: Bases de la Función Ejecutiva", type: "pdf", duration: "15 min", status: "locked" },
          { id: 4, title: "Actividad: Registro de Procrastinación", type: "assignment", duration: "30 min", status: "locked" },
          { id: 5, title: "Test Semanal: Nivel 1", type: "quiz", duration: "10 min", status: "locked" }
        ]
      },
      {
        id: 2,
        title: "Semana 2: Externalización del Tiempo",
        lessons: [
          { id: 6, title: "El Reloj Mental vs El Reloj Visual", type: "video", duration: "15 min", status: "locked" },
          { id: 7, title: "Configuración de Ráfagas", type: "video", duration: "20 min", status: "locked" }
        ]
      }
    ]
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-[#1e1e1e]">
      {/* Course Navigation Sidebar - Ultra Minimalist */}
      <aside className="w-96 border-r border-gray-100 flex flex-col bg-[#fcfcfc]">
        <div className="p-8 border-b border-gray-100 bg-white">
          <a href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#a51c30] mb-6 hover:gap-4 transition-all">
            <ChevronLeft className="w-4 h-4" /> Volver al Panel
          </a>
          <h1 className="text-2xl font-serif font-black leading-tight mb-4">{courseStructure.title}</h1>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span>Progreso del curso</span>
              <span>24%</span>
            </div>
            <Progress value={24} className="h-1 bg-gray-100" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-0">
            {courseStructure.weeks.map((week) => (
              <div key={week.id} className="border-b border-gray-50">
                <div className="px-8 py-6 bg-gray-50/50">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">{week.title}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {week.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => lesson.status !== 'locked' && setActiveLesson(lesson.id)}
                      className={`w-full flex items-start gap-4 px-8 py-6 text-left transition-all hover:bg-white group ${activeLesson === lesson.id ? 'bg-white border-l-4 border-[#a51c30]' : 'border-l-4 border-transparent'}`}
                    >
                      <div className="mt-1">
                        {lesson.status === 'completed' ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <CheckSquare className="w-3 h-3 text-white" />
                          </div>
                        ) : lesson.status === 'locked' ? (
                          <Lock className="w-4 h-4 text-gray-200" />
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 ${activeLesson === lesson.id ? 'border-[#a51c30]' : 'border-gray-200'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-[13px] font-bold leading-snug mb-1 ${lesson.status === 'locked' ? 'text-gray-300' : 'text-[#1e1e1e]'}`}>
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-3">
                          {lesson.type === 'video' && <PlayCircle className="w-3 h-3 text-gray-400" />}
                          {lesson.type === 'pdf' && <FileText className="w-3 h-3 text-gray-400" />}
                          {lesson.type === 'quiz' && <CheckSquare className="w-3 h-3 text-gray-400" />}
                          {lesson.type === 'assignment' && <MessageSquare className="w-3 h-3 text-gray-400" />}
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{lesson.duration}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Player Area - Inspired by High-End Platforms */}
      <main className="flex-1 flex flex-col bg-white overflow-y-auto">
        <div className="aspect-video bg-black relative group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                <PlayCircle className="w-12 h-12 text-white" />
             </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
             <div className="h-full bg-[#a51c30] w-1/3 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
             </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full px-12 py-16 space-y-12">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <Badge className="bg-[#a51c30]/10 text-[#a51c30] border-none rounded-none px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em]">
                Módulo 1 • Lección 2
              </Badge>
              <h2 className="text-5xl font-serif font-black italic text-[#1e1e1e]">La Brecha de Intención-Acción</h2>
              <div className="flex items-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-widest">18 Minutos de contenido</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-100" />
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-widest">2 Recursos descargables</span>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed font-medium mb-8">
              En esta lección exploraremos por qué saber lo que tienes que hacer no es suficiente para lograrlo. Analizaremos cómo el Método Barkley ataca directamente el "Punto de Acción" para cerrar esta brecha neurobiológica.
            </p>
            
            <div className="bg-gray-50 p-10 border-l-8 border-[#a51c30] mb-12">
               <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#a51c30] mb-4">Objetivo de la Lección</h4>
               <p className="text-gray-700 italic font-serif text-lg">
                 "El conocimiento no es poder. La ejecución es poder. Entenderás la base científica de por qué tu cerebro elige procrastinar incluso cuando el objetivo es importante."
               </p>
            </div>

            <h3 className="text-2xl font-serif font-black text-[#1e1e1e] mt-12 mb-6">Recursos de la Semana</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { title: "Guía de Trabajo: Mapa de Intenciones", type: "PDF", size: "2.4 MB" },
                 { title: "Lectura Complementaria: Dr. Russell Barkley", type: "DOCX", size: "1.1 MB" }
               ].map((doc, i) => (
                 <div key={i} className="flex items-center justify-between p-6 border border-gray-100 hover:border-[#a51c30]/20 transition-all group">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-gray-50 flex items-center justify-center group-hover:bg-[#a51c30]/5 transition-all">
                       <Download className="w-5 h-5 text-gray-300 group-hover:text-[#a51c30]" />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-[#1e1e1e]">{doc.title}</p>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{doc.type} • {doc.size}</p>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="pt-16 border-t border-gray-100 flex justify-between items-center">
             <Button variant="ghost" className="text-gray-400 uppercase font-black tracking-widest text-[11px] h-14 px-8 rounded-none">
               Anterior
             </Button>
             <Button className="bg-[#a51c30] hover:bg-[#821626] text-white uppercase font-black tracking-[0.3em] text-[11px] h-14 px-12 rounded-none flex items-center gap-3">
               Siguiente Lección <ChevronRight className="w-4 h-4" />
             </Button>
          </div>
        </div>
      </main>
    </div>
  );
}