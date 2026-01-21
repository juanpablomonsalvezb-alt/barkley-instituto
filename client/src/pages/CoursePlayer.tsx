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
  Share2,
  Bookmark,
  ChevronDown
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
    instructor: "Barkley Instituto",
    weeks: [
      {
        id: 1,
        title: "Semana 1: El Punto de Acción",
        lessons: [
          { id: 1, title: "1.1 Introducción al Método Barkley", type: "video", duration: "12 min", status: "completed" },
          { id: 2, title: "1.2 La Brecha de Intención-Acción", type: "video", duration: "18 min", status: "current" },
          { id: 3, title: "1.3 Lectura: Bases de la Función Ejecutiva", type: "pdf", duration: "15 min", status: "locked" },
          { id: 4, title: "1.4 Actividad: Registro de Procrastinación", type: "assignment", duration: "30 min", status: "locked" },
          { id: 5, title: "1.5 Test Semanal: Nivel 1", type: "quiz", duration: "10 min", status: "locked" }
        ]
      },
      {
        id: 2,
        title: "Semana 2: Externalización del Tiempo",
        lessons: [
          { id: 6, title: "2.1 El Reloj Mental vs El Reloj Visual", type: "video", duration: "15 min", status: "locked" },
          { id: 7, title: "2.2 Configuración de Ráfagas", type: "video", duration: "20 min", status: "locked" }
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-[#1e1e1e]">
      {/* Top Navbar - Harvard Online Style */}
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white shrink-0">
        <div className="flex items-center gap-8">
          <a href="/dashboard" className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#a51c30] flex items-center justify-center">
                <GraduationCap className="text-white w-5 h-5" />
             </div>
             <div className="flex flex-col">
                <span className="font-serif text-[14px] font-black text-[#1e1e1e] uppercase leading-none">Barkley</span>
                <span className="text-[6px] tracking-[0.4em] font-black text-[#a51c30] uppercase">Instituto</span>
             </div>
          </a>
          <div className="h-6 w-[1px] bg-gray-200" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 truncate max-w-[300px]">
            {courseStructure.title}
          </h2>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Tu Progreso</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#a51c30] w-[24%]" />
                </div>
                <span className="text-[10px] font-black text-[#1e1e1e]">24%</span>
              </div>
           </div>
           <Button variant="outline" className="border-gray-200 rounded-none text-[10px] font-black uppercase tracking-widest h-10 px-6">
              Siguiente <ChevronRight className="ml-2 w-3.5 h-3.5" />
           </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content - Left Side */}
        <main className="flex-1 overflow-y-auto bg-[#fdfdfd]">
          <div className="aspect-video bg-black w-full shadow-lg">
             {/* Simulating the Harvard Video Experience */}
             <div className="w-full h-full flex items-center justify-center relative group">
                <PlayCircle className="w-20 h-20 text-white/20 group-hover:text-white/40 transition-all cursor-pointer" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-end">
                   <div className="space-y-2">
                      <Badge className="bg-[#a51c30] text-white rounded-none border-none text-[8px] font-black uppercase tracking-widest">Lección 1.2</Badge>
                      <h3 className="text-white font-serif italic text-xl">La Brecha de Intención-Acción</h3>
                   </div>
                   <div className="flex gap-3">
                      <Button size="icon" variant="ghost" className="text-white hover:bg-white/10"><Share2 className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-white hover:bg-white/10"><Bookmark className="w-4 h-4" /></Button>
                   </div>
                </div>
             </div>
          </div>

          <div className="max-w-4xl mx-auto px-10 py-16 space-y-12">
            <div className="space-y-6 border-b border-gray-100 pb-12">
               <h1 className="text-5xl font-serif font-black text-[#1e1e1e] leading-tight italic">
                  Cerrando la Brecha: <br />
                  <span className="text-[#a51c30] not-italic">De la Intención a la Acción</span>
               </h1>
               <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  En el núcleo del Método Barkley reside una verdad científica: la procrastinación no es pereza, es un fallo en el andamiaje de las funciones ejecutivas.
               </p>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-transparent h-auto p-0 gap-10 border-b border-gray-100 w-full justify-start rounded-none mb-10">
                <TabsTrigger value="overview" className="bg-transparent text-[11px] font-black uppercase tracking-[0.3em] data-[state=active]:text-[#a51c30] data-[state=active]:border-[#a51c30] border-b-2 border-transparent rounded-none px-0 pb-4 transition-all">Visión General</TabsTrigger>
                <TabsTrigger value="resources" className="bg-transparent text-[11px] font-black uppercase tracking-[0.3em] data-[state=active]:text-[#a51c30] data-[state=active]:border-[#a51c30] border-b-2 border-transparent rounded-none px-0 pb-4 transition-all">Materiales (3)</TabsTrigger>
                <TabsTrigger value="activity" className="bg-transparent text-[11px] font-black uppercase tracking-[0.3em] data-[state=active]:text-[#a51c30] data-[state=active]:border-[#a51c30] border-b-2 border-transparent rounded-none px-0 pb-4 transition-all">Actividad</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-10 animate-in fade-in duration-500">
                 <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 text-lg leading-relaxed">
                       Esta semana nos enfocamos en el <strong>"Punto de Acción"</strong>. Aprenderás por qué el cerebro de una persona con dificultades de ejecución necesita estímulos externos para activar la voluntad.
                    </p>
                    <div className="my-10 p-10 bg-[#f9f9f9] border-l-4 border-[#a51c30] flex items-start gap-6">
                       <Clock className="w-6 h-6 text-[#a51c30] shrink-0 mt-1" />
                       <p className="text-lg font-serif italic text-[#1e1e1e]">
                          "El conocimiento no es suficiente para cambiar el comportamiento. El cambio ocurre en el punto de acción, a través de la modificación del entorno."
                       </p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <CardOutline title="Objetivos Semanales" items={["Identificar disparadores", "Externalizar metas", "Mini-sprints de 20 min"]} />
                    <CardOutline title="Conceptos Clave" items={["Funciones Ejecutivas", "Punto de Acción", "Dopamina de Espera"]} />
                 </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4 animate-in fade-in duration-500">
                 {[
                    { name: "Guía: Mapa del Punto de Acción", type: "PDF", size: "1.2 MB" },
                    { name: "Lectura: Neurobiología del TDAH", type: "Lectura Web", size: "5 min" },
                    { name: "Hoja de Ruta de la Semana", type: "Excel", size: "450 KB" }
                 ].map((res, i) => (
                    <div key={i} className="flex items-center justify-between p-6 border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4">
                          <FileText className="w-5 h-5 text-gray-300 group-hover:text-[#a51c30]" />
                          <div>
                             <p className="text-sm font-bold text-[#1e1e1e]">{res.name}</p>
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{res.type} • {res.size}</p>
                          </div>
                       </div>
                       <Download className="w-4 h-4 text-gray-200 group-hover:text-[#a51c30]" />
                    </div>
                 ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Sidebar Navigation - Right Side (Classic Canvas/Harvard Style) */}
        <aside className="w-[400px] border-l border-gray-100 flex flex-col bg-white shrink-0">
          <div className="p-8 border-b border-gray-100">
             <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#1e1e1e] mb-2">Contenido del Curso</h3>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Semana 1 de 8</p>
          </div>
          <ScrollArea className="flex-1">
             <div className="divide-y divide-gray-50">
                {courseStructure.weeks.map((week) => (
                  <div key={week.id}>
                     <button className="w-full px-8 py-5 bg-gray-50/50 flex items-center justify-between group">
                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">{week.title}</span>
                        <ChevronDown className="w-4 h-4 text-gray-300" />
                     </button>
                     <div className="bg-white">
                        {week.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => lesson.status !== 'locked' && setActiveLesson(lesson.id)}
                            className={`w-full text-left px-8 py-6 flex items-start gap-4 transition-all hover:bg-gray-50 border-l-4 ${activeLesson === lesson.id ? 'border-[#a51c30] bg-gray-50/30' : 'border-transparent'}`}
                          >
                             <div className="mt-1">
                                {lesson.status === 'completed' ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                                ) : lesson.status === 'locked' ? (
                                  <Lock className="w-4 h-4 text-gray-200" />
                                ) : (
                                  <div className={`w-4 h-4 rounded-full border-2 ${activeLesson === lesson.id ? 'border-[#a51c30]' : 'border-gray-200'}`} />
                                )}
                             </div>
                             <div>
                                <p className={`text-[13px] font-bold leading-tight mb-1 ${lesson.status === 'locked' ? 'text-gray-300' : 'text-[#1e1e1e]'}`}>
                                   {lesson.title}
                                </p>
                                <div className="flex items-center gap-2">
                                   <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{lesson.type}</span>
                                   <div className="w-1 h-1 rounded-full bg-gray-200" />
                                   <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{lesson.duration}</span>
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
      </div>
    </div>
  );
}

function CardOutline({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="p-8 border border-gray-100 bg-white space-y-6 shadow-sm">
       <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#a51c30]">{title}</h5>
       <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
               <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
               {item}
            </li>
          ))}
       </ul>
    </div>
  );
}