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
  MoreVertical,
  Maximize2,
  Volume2,
  Settings,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CoursePlayer() {
  const [activeLesson, setActiveLesson] = useState(2);

  const courseStructure = {
    title: "Neurociencia de la Voluntad",
    instructor: "Dr. Barkley",
    weeks: [
      {
        id: 1,
        title: "Módulo 1: El Punto de Acción",
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
        title: "Módulo 2: Externalización del Tiempo",
        lessons: [
          { id: 6, title: "El Reloj Mental vs El Reloj Visual", type: "video", duration: "15 min", status: "locked" },
          { id: 7, title: "Configuración de Ráfagas", type: "video", duration: "20 min", status: "locked" }
        ]
      }
    ]
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden font-sans text-white">
      {/* Course Navigation Sidebar - Dark Mode MasterClass Style */}
      <aside className="w-80 border-r border-white/5 flex flex-col bg-[#0a0a0a]">
        <div className="p-6 border-b border-white/5">
          <a href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#a51c30] mb-6 hover:translate-x-1 transition-transform">
            <ChevronLeft className="w-4 h-4" /> Volver al Panel
          </a>
          <h1 className="text-xl font-serif font-bold leading-tight mb-4">{courseStructure.title}</h1>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
              <span>Completado</span>
              <span>24%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#a51c30] w-[24%]" />
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="py-2">
            {courseStructure.weeks.map((week) => (
              <div key={week.id} className="mb-2">
                <div className="px-6 py-4 bg-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">{week.title}</h3>
                </div>
                <div>
                  {week.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => lesson.status !== 'locked' && setActiveLesson(lesson.id)}
                      className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all border-l-2 ${activeLesson === lesson.id ? 'bg-[#a51c30]/10 border-[#a51c30]' : 'border-transparent hover:bg-white/5'}`}
                    >
                      <div className="shrink-0">
                        {lesson.status === 'completed' ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500" />
                        ) : lesson.status === 'locked' ? (
                          <Lock className="w-4 h-4 text-white/20" />
                        ) : (
                          <PlayCircle className={`w-4 h-4 ${activeLesson === lesson.id ? 'text-[#a51c30]' : 'text-white/40'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12px] font-bold truncate ${lesson.status === 'locked' ? 'text-white/20' : 'text-white/90'}`}>
                          {lesson.title}
                        </p>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{lesson.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-[#0a0a0a]">
        {/* Video Player - Cinema Experience */}
        <div className="relative aspect-video bg-black group overflow-hidden shadow-2xl">
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-[#a51c30]/20 transition-all duration-500 cursor-pointer">
                <PlayCircle className="w-10 h-10 text-white" />
             </div>
          </div>
          
          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex flex-col gap-4">
               <div className="h-1 w-full bg-white/20 rounded-full cursor-pointer relative">
                  <div className="h-full bg-[#a51c30] w-1/3 rounded-full relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
                  </div>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <PlayCircle className="w-5 h-5 cursor-pointer hover:text-[#a51c30]" />
                    <Volume2 className="w-5 h-5 cursor-pointer hover:text-[#a51c30]" />
                    <span className="text-[10px] font-black tracking-widest opacity-60">06:24 / 18:00</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <Settings className="w-5 h-5 cursor-pointer hover:text-[#a51c30]" />
                    <Maximize2 className="w-5 h-5 cursor-pointer hover:text-[#a51c30]" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Lesson Info & Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-12 py-16">
            <Tabs defaultValue="lesson" className="w-full">
              <div className="flex items-center justify-between border-b border-white/5 mb-12">
                <TabsList className="bg-transparent h-auto p-0 gap-8 rounded-none">
                  <TabsTrigger value="lesson" className="bg-transparent text-[11px] font-black uppercase tracking-[0.3em] data-[state=active]:bg-transparent data-[state=active]:text-[#a51c30] data-[state=active]:border-b-2 data-[state=active]:border-[#a51c30] rounded-none pb-4 border-b-2 border-transparent transition-all">Lección</TabsTrigger>
                  <TabsTrigger value="resources" className="bg-transparent text-[11px] font-black uppercase tracking-[0.3em] data-[state=active]:bg-transparent data-[state=active]:text-[#a51c30] data-[state=active]:border-b-2 data-[state=active]:border-[#a51c30] rounded-none pb-4 border-b-2 border-transparent transition-all">Recursos</TabsTrigger>
                  <TabsTrigger value="notes" className="bg-transparent text-[11px] font-black uppercase tracking-[0.3em] data-[state=active]:bg-transparent data-[state=active]:text-[#a51c30] data-[state=active]:border-b-2 data-[state=active]:border-[#a51c30] rounded-none pb-4 border-b-2 border-transparent transition-all">Mis Notas</TabsTrigger>
                  <TabsTrigger value="community" className="bg-transparent text-[11px] font-black uppercase tracking-[0.3em] data-[state=active]:bg-transparent data-[state=active]:text-[#a51c30] data-[state=active]:border-b-2 data-[state=active]:border-[#a51c30] rounded-none pb-4 border-b-2 border-transparent transition-all">Comunidad</TabsTrigger>
                </TabsList>
                <div className="flex gap-4">
                   <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest h-10 px-4 rounded-none">
                     <Share2 className="w-3.5 h-3.5 mr-2" /> Compartir
                   </Button>
                   <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest h-10 px-4 rounded-none">
                     <MoreVertical className="w-3.5 h-3.5" />
                   </Button>
                </div>
              </div>

              <TabsContent value="lesson" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6">
                  <Badge className="bg-[#a51c30] text-white rounded-none px-4 py-1 text-[9px] font-black uppercase tracking-[0.35em] border-none">Módulo 1 • Parte 2</Badge>
                  <h2 className="text-5xl font-serif font-black italic">La Brecha de <br /><span className="text-[#a51c30] not-italic">Intención-Acción</span></h2>
                  <p className="text-xl text-white/60 leading-relaxed font-medium">
                    Explora por qué saber no es hacer. En esta sesión, el Dr. Barkley desglosa los mecanismos neurobiológicos que impiden que tus metas se conviertan en realidad y cómo hackear tu entorno para ganar consistencia.
                  </p>
                </div>

                <div className="bg-white/5 p-12 border-l-4 border-[#a51c30] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Brain className="w-32 h-32" />
                   </div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a51c30] mb-6">Concepto Clave</h4>
                   <p className="text-2xl font-serif font-bold italic text-white/90 leading-relaxed relative z-10">
                     "La procrastinación no es un problema de gestión de tiempo, es un problema de regulación emocional y soporte de las funciones ejecutivas."
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                   <div className="space-y-6">
                      <h5 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">Lo que aprenderás</h5>
                      <ul className="space-y-4">
                        {[
                          "Identificar el 'Punto de Acción' en tus tareas",
                          "Comprender el papel de la Dopamina en la espera",
                          "Estrategias de andamiaje externo para tu voluntad"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-4 text-sm text-white/50">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#a51c30]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                   </div>
                   <div className="space-y-6">
                      <h5 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">Instrucciones</h5>
                      <p className="text-sm text-white/50 leading-relaxed">
                        Completa el video tutorial antes de descargar la guía de trabajo. Te recomendamos realizar la actividad de redacción inmediatamente después para fijar el conocimiento.
                      </p>
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="animate-in fade-in duration-500">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { title: "Guía de Trabajo: Mapa de Intenciones", type: "PDF", size: "2.4 MB" },
                    { title: "Lectura Complementaria: Dr. Russell Barkley", type: "DOCX", size: "1.1 MB" },
                    { title: "Audio: Meditación de Enfoque Barkley", type: "MP3", size: "8.5 MB" }
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:border-[#a51c30]/40 transition-all group cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white/5 flex items-center justify-center group-hover:bg-[#a51c30]/10 transition-all">
                          <Download className="w-5 h-5 text-white/40 group-hover:text-[#a51c30]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white/90">{doc.title}</p>
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#a51c30] group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-32 pt-16 border-t border-white/5 flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Anterior</span>
                <span className="text-xs font-bold text-white/60">1. Introducción al Método</span>
              </div>
              <Button className="bg-[#a51c30] hover:bg-[#821626] text-white uppercase font-black tracking-[0.3em] text-[11px] h-16 px-14 rounded-none flex items-center gap-4 group">
                Siguiente Lección <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}