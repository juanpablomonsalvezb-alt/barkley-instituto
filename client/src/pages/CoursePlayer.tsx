import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ChevronLeft, 
  PlayCircle, 
  CheckSquare, 
  MessageSquare, 
  Clock, 
  Lock, 
  Download, 
  Calendar,
  Brain,
  StickyNote,
  Headphones,
  Map,
  ImageIcon,
  Presentation,
  FileSearch,
  BookOpen,
  TrendingUp,
  Target,
  PenTool,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function CoursePlayer() {
  const [activeTab, setActiveTab] = useState("captacion");
  const [timeLeft, setTimeLeft] = useState(600); 
  const [isActive, setIsActive] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [thought, setThought] = useState("");
  
  const placeholders = [
    "¿Qué veo? ¿Qué pienso? ¿Qué me pregunto?",
    "Conectar, Extender, Desafiar",
    "Antes pensaba... ahora pienso...",
    "¿Cuál es el núcleo de esta idea?"
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const radarData = {
    labels: ['Análisis', 'Curiosidad', 'Conexión', 'Reflexión'],
    datasets: [
      {
        label: 'Desempeño Cognitivo',
        data: [85, 92, 78, 88],
        backgroundColor: 'rgba(165, 28, 48, 0.2)',
        borderColor: '#A51C30',
        borderWidth: 2,
        pointBackgroundColor: '#A51C30',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#A51C30',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { display: true, color: 'rgba(10, 25, 47, 0.1)' },
        grid: { color: 'rgba(10, 25, 47, 0.1)' },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false },
        pointLabels: {
          font: {
            family: 'Inter',
            size: 10,
            weight: 'bold' as const,
          },
          color: '#0A192F'
        }
      }
    },
    plugins: {
      legend: { display: false }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const notebookResources = [
    { title: "Audio Síntesis", icon: Headphones, color: "text-[#0A192F]", bg: "bg-slate-50", desc: "Estructura auditiva del OA." },
    { title: "Mapa Conceptual", icon: Map, color: "text-[#0A192F]", bg: "bg-slate-50", desc: "Andamiaje visual de ideas." },
    { title: "Infografía", icon: ImageIcon, color: "text-[#0A192F]", bg: "bg-slate-50", desc: "Cronología y datos clave." },
    { title: "Presentación", icon: Presentation, color: "text-[#0A192F]", bg: "bg-slate-50", desc: "Material de apoyo Harvard." },
    { title: "Informe Semanal", icon: FileSearch, color: "text-[#0A192F]", bg: "bg-slate-50", desc: "Análisis profundo escrito." },
  ];

  const moments = [
    { id: "captacion", label: "Fase 1: Captación", desc: "Recurso Audiovisual", time: "10m" },
    { id: "procesamiento", label: "Fase 2: Procesamiento", desc: "Estructuración IA", time: "15m" },
    { id: "sintesis", label: "Fase 3: Síntesis", desc: "Laboratorio Activo", time: "20m" },
    { id: "cierre", label: "Fase 4: Cierre", desc: "Validación Final", time: "5m" },
  ];

  const heatmap = [
    [1, 2, 0, 4, 3, 2, 1],
    [2, 4, 3, 1, 2, 4, 3],
    [3, 1, 4, 2, 3, 1, 2],
    [4, 3, 2, 4, 1, 2, 4]
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans text-[#0A192F]">
      {/* Harvard Midnight Sidebar */}
      <aside className="w-80 border-r border-slate-200 flex flex-col bg-white shrink-0 shadow-sm">
        <div className="p-10 border-b border-slate-100">
          <Link href="/dashboard">
            <button className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-10 hover:text-[#A51C30] transition-colors group">
              <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> Volver al escritorio
            </button>
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold italic text-[#0A192F]">Historia 7° Básico</h1>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#A51C30]">
               <Calendar className="w-3.5 h-3.5" /> Semana 1 • OA 1
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-8 space-y-10">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300 mb-8 px-4">Momentos Barkley</p>
              {moments.map((moment) => (
                <button 
                  key={moment.id} 
                  onClick={() => setActiveTab(moment.id)}
                  className={cn(
                    "w-full text-left p-5 rounded-none flex items-center justify-between transition-all",
                    activeTab === moment.id 
                    ? "bg-[#0A192F] text-white border-l-4 border-[#A51C30] shadow-xl" 
                    : "hover:bg-slate-50 text-slate-500 border-l-4 border-transparent"
                  )}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-tight">{moment.label}</p>
                    <p className={cn("text-[9px] font-medium italic opacity-60", activeTab === moment.id ? "text-white" : "text-slate-400")}>{moment.desc}</p>
                  </div>
                  <Badge variant="outline" className={cn("text-[8px] font-bold px-2 py-0 border-none", activeTab === moment.id ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400")}>{moment.time}</Badge>
                </button>
              ))}
            </div>

            <Card className="p-8 bg-[#F8F9FA] border border-[#0A192F]/5 rounded-none space-y-4">
              <div className="flex items-center gap-2 text-[#0A192F] opacity-40">
                <StickyNote className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Protocolo de Enfoque</span>
              </div>
              <p className="text-[11px] font-serif font-bold italic text-[#0A192F] leading-relaxed">
                "Complete cada fase cronológicamente para garantizar la externalización de la memoria."
              </p>
            </Card>
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#F8F9FA]/50 flex flex-col">
        {/* Floating Timer Console */}
        <div className="p-8 flex items-center justify-center sticky top-0 z-50">
          <div className="bg-[#0A192F] border border-white/5 shadow-2xl rounded-none px-10 py-5 flex items-center gap-12">
            <div className="flex items-center gap-5">
              <div className="relative w-12 h-12">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle 
                    cx="24" cy="24" r="20" fill="transparent" stroke="#A51C30" strokeWidth="3" 
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 * (1 - timeLeft / 600)}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white/40" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">Sprint Console</span>
                <span className="text-2xl font-serif font-bold italic text-white tabular-nums">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <Button 
              onClick={() => setIsActive(!isActive)}
              className={cn(
                "h-12 px-10 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] transition-all",
                isActive ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-[#A51C30] text-white hover:bg-[#821626]"
              )}
            >
              {isActive ? "Pausar Ráfaga" : "Iniciar Ráfaga"}
            </Button>
          </div>
        </div>

        <div className="flex-1 p-16 max-w-6xl mx-auto w-full space-y-24">
          <Tabs value={activeTab} className="space-y-16">
            <TabsContent value="captacion" className="space-y-12 animate-in fade-in duration-700 m-0">
              <div className="space-y-5 border-l-4 border-[#A51C30] pl-8">
                <Badge className="bg-[#0A192F] text-white border-none rounded-none text-[9px] font-bold tracking-[0.4em] uppercase px-4 py-1.5 shadow-lg">FASE 1: CAPTACIÓN</Badge>
                <h2 className="text-6xl font-serif font-bold text-[#0A192F] leading-tight italic">El Surgimiento de las <br />Rutas Comerciales</h2>
              </div>
              <div className="aspect-video bg-[#0A192F] rounded-none shadow-2xl relative group overflow-hidden border-8 border-white">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 bg-white/5 backdrop-blur-3xl rounded-full flex items-center justify-center border border-white/10 group-hover:scale-105 group-hover:bg-[#A51C30]/20 transition-all cursor-pointer">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                 </div>
              </div>
            </TabsContent>

            <TabsContent value="procesamiento" className="space-y-12 animate-in fade-in duration-500 m-0">
               <div className="space-y-5 border-l-4 border-[#A51C30] pl-8">
                  <Badge className="bg-[#0A192F] text-white border-none rounded-none text-[9px] font-bold tracking-[0.4em] uppercase px-4 py-1.5 shadow-lg">FASE 2: PROCESAMIENTO</Badge>
                  <h2 className="text-6xl font-serif font-bold text-[#0A192F] leading-tight italic">Andamiaje Cognitivo</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {notebookResources.map((res, i) => (
                   <Card key={i} className="border border-slate-200 rounded-none p-10 group cursor-pointer bg-white hover:border-[#0A192F] transition-all duration-500">
                      <div className={cn("w-16 h-16 rounded-none flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-[#0A192F] transition-all", res.bg)}>
                        <res.icon className={cn("w-7 h-7 transition-colors group-hover:text-white", res.color)} />
                      </div>
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-3 text-[#0A192F]">{res.title}</h4>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">{res.desc}</p>
                      <div className="mt-10 flex items-center justify-between border-t border-slate-50 pt-6">
                         <span className="text-[9px] font-bold text-[#A51C30] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Acceso Institucional</span>
                         <Download className="w-4 h-4 text-slate-200 group-hover:text-[#0A192F]" />
                      </div>
                   </Card>
                 ))}
               </div>
            </TabsContent>

            <TabsContent value="sintesis" className="space-y-12 animate-in fade-in duration-500 m-0">
               <div className="space-y-5 border-l-4 border-[#A51C30] pl-8">
                  <Badge className="bg-[#0A192F] text-white border-none rounded-none text-[9px] font-bold tracking-[0.4em] uppercase px-4 py-1.5 shadow-lg">FASE 3: SÍNTESIS</Badge>
                  <h2 className="text-6xl font-serif font-bold text-[#0A192F] leading-tight italic">Laboratorio de Aplicación</h2>
               </div>
               <Card className="p-24 border border-slate-200 rounded-none flex flex-col items-center justify-center text-center space-y-10 bg-white shadow-sm">
                  <div className="w-24 h-24 border border-slate-100 flex items-center justify-center group">
                     <CheckSquare className="w-10 h-10 text-[#A51C30] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-3xl font-serif font-bold italic text-[#0A192F]">Validación Práctica OA1</h3>
                     <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] max-w-md mx-auto">Remita sus hallazgos para la revisión del equipo pedagógico.</p>
                  </div>
                  <Button className="bg-[#0A192F] hover:bg-black text-white rounded-none h-16 px-16 text-[10px] font-bold uppercase tracking-[0.4em]">Remitir Actividad</Button>
               </Card>
            </TabsContent>

            <TabsContent value="cierre" className="space-y-12 animate-in fade-in duration-500 m-0">
               <div className="space-y-5 border-l-4 border-[#A51C30] pl-8">
                  <Badge className="bg-[#0A192F] text-white border-none rounded-none text-[9px] font-bold tracking-[0.4em] uppercase px-4 py-1.5 shadow-lg">FASE 4: CIERRE</Badge>
                  <h2 className="text-6xl font-serif font-bold text-[#0A192F] leading-tight italic">Validación de Aprendizaje</h2>
               </div>
               <Card className="border-none bg-[#0A192F] text-white p-20 rounded-none space-y-12 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#A51C30]" />
                  <div className="flex items-center gap-10">
                     <div className="w-24 h-24 bg-white/5 border border-white/10 flex items-center justify-center">
                        <Brain className="w-10 h-10 text-[#A51C30]" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-3xl font-serif font-bold italic">Test de Salida Semanal</h4>
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#A51C30]">Externalización Cognitiva • 5 Preguntas</p>
                     </div>
                  </div>
                  <Button className="w-full bg-[#A51C30] hover:bg-[#821626] text-white rounded-none h-20 text-[11px] font-bold uppercase tracking-[0.5em] shadow-2xl">Iniciar Evaluación Institucional</Button>
               </Card>
            </TabsContent>
          </Tabs>

          {/* New Bitácora Section */}
          <section className="space-y-10 pt-16 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <PenTool className="w-6 h-6 text-[#A51C30]" />
              <h3 className="text-3xl font-serif font-bold italic text-[#0A192F]">Haciendo visible el pensamiento</h3>
            </div>
            <Card className="rounded-none border-slate-200 p-10 bg-white space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Harvard Project Zero Lab</p>
              <Textarea 
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder={placeholders[placeholderIndex]}
                className="min-h-[200px] border-none focus-visible:ring-0 text-lg font-serif italic text-[#0A192F] placeholder:text-slate-200 p-0 resize-none transition-all duration-1000"
              />
              <div className="flex justify-end pt-6 border-t border-slate-50">
                <Button className="bg-[#0A192F] text-white rounded-none px-10 text-[9px] font-bold uppercase tracking-widest">Registrar Reflexión</Button>
              </div>
            </Card>
          </section>

          {/* New Analytics Section */}
          <section className="space-y-12 pb-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <Activity className="w-6 h-6 text-[#A51C30]" />
                <h3 className="text-3xl font-serif font-bold italic text-[#0A192F]">Métricas de Alto Rendimiento</h3>
              </div>
              <Badge className="bg-[#F8F9FA] text-[#0A192F] border-slate-200 rounded-none px-4 py-1.5 font-bold text-[9px] uppercase tracking-widest italic">Análisis en Tiempo Real Barkley</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="rounded-none border-slate-200 p-12 bg-white flex flex-col items-center justify-center min-h-[450px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300 mb-10">Huella Cognitiva (Radar)</p>
                <div className="w-full h-full relative">
                  <Radar data={radarData} options={radarOptions} />
                </div>
              </Card>

              <div className="space-y-12">
                <Card className="rounded-none border-slate-200 p-10 bg-white space-y-8">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">Dominio Curricular OA</p>
                    <span className="text-[10px] font-bold text-[#A51C30] uppercase tracking-widest italic">Nivel 7° Básico</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold text-[#0A192F]">
                      <span className="uppercase tracking-widest">Progreso de Unidades</span>
                      <span>82%</span>
                    </div>
                    <Progress value={82} className="h-2 rounded-none bg-slate-100 overflow-hidden">
                      <div className="h-full bg-[#A51C30] transition-all" style={{ width: '82%' }} />
                    </Progress>
                    <p className="text-[10px] text-slate-400 italic">Has conquistado 12 de 15 objetivos fundamentales para este periodo.</p>
                  </div>
                </Card>

                <Card className="rounded-none border-slate-200 p-10 bg-white space-y-8">
                   <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">Mapa de Calor de Enfoque</p>
                   <div className="flex gap-2">
                      {heatmap.map((row, i) => (
                        <div key={i} className="flex flex-col gap-2">
                           {row.map((val, j) => (
                             <div 
                               key={j} 
                               className={cn(
                                 "w-6 h-6 border border-slate-50",
                                 val === 0 ? "bg-slate-50" :
                                 val === 1 ? "bg-[#A51C30]/10" :
                                 val === 2 ? "bg-[#A51C30]/30" :
                                 val === 3 ? "bg-[#A51C30]/60" :
                                 "bg-[#A51C30]"
                               )}
                               title={`Intensidad: ${val}/4`}
                             />
                           ))}
                        </div>
                      ))}
                   </div>
                   <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-[0.3em] text-slate-300">
                      <span>Baja Actividad</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#A51C30]/10" />
                        <div className="w-2 h-2 bg-[#A51C30]/30" />
                        <div className="w-2 h-2 bg-[#A51C30]/60" />
                        <div className="w-2 h-2 bg-[#A51C30]" />
                      </div>
                      <span>Alta Intensidad</span>
                   </div>
                </Card>
              </div>
            </div>
          </section>
        </div>

        {showReward && (
          <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center bg-[#0A192F]/60 backdrop-blur-md animate-in zoom-in-95 duration-500">
             <div className="text-center space-y-8 bg-white p-16 rounded-none shadow-2xl border-t-8 border-[#A51C30]">
                <div className="text-7xl">🏛️</div>
                <h3 className="text-4xl font-serif font-bold italic text-[#0A192F]">Sesión Completada</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#A51C30]">Objetivos validados con éxito</p>
             </div>
          </div>
        )}

        <div className="fixed bottom-12 right-12 z-[100]">
           <button className="w-20 h-20 bg-[#A51C30] rounded-none shadow-2xl flex items-center justify-center text-white hover:bg-[#821626] active:scale-95 transition-all">
              <MessageSquare className="w-8 h-8" />
           </button>
        </div>
      </main>
    </div>
  );
}