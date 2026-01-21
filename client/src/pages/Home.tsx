import { useState, useEffect } from "react";
import { Search, Menu, GraduationCap, ChevronRight, X, Clock, Target, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Asset Imports (Keeping the Harvard-style generated images for consistent ADN)
import csThumbnail from "@assets/generated_images/computer_science_course_thumbnail.png";
import artThumbnail from "@assets/generated_images/art_history_course_thumbnail.png";
import mathThumbnail from "@assets/generated_images/mathematics_course_thumbnail.png";
import heroBg from "@assets/generated_images/harvard_yard_entrance_with_banners.png";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const programs = [
    {
      id: 1,
      title: "Plan Barkley FOCUS",
      subtitle: "Jóvenes (7° a 4° Medio)",
      price: "Matrícula: $50.000 | Mensualidad: $75.000",
      description: "Preparación Exámenes Libres: Foco en asignaturas oficiales (Lenguaje, Matemática, Ciencias, Historia e Inglés). Incluye Tutor Académico.",
      image: csThumbnail,
      category: "Académico"
    },
    {
      id: 2,
      title: "Plan Barkley IMPULSO",
      subtitle: "Adultos (Básica y Media)",
      price: "Matrícula: $35.000 | Mensualidad: $55.000",
      description: "Nivelación 2x1 (Decreto 2272): Preparación intensiva para validación de adultos con acompañamiento de tutor.",
      image: mathThumbnail,
      category: "Adultos"
    },
    {
      id: 3,
      title: "Plataforma STRATMORE",
      subtitle: "Temporada Completa (Marzo a Octubre)",
      price: "Pago Único: $150.000",
      description: "Entrenamiento Autónomo: Herramienta 100% autogestionable que enseña a cumplir metas sin procrastinar.",
      image: artThumbnail,
      category: "Plataforma"
    }
  ];

  const pillars = [
    {
      title: "Externalización del Tiempo",
      description: "Sustituimos el reloj mental por cronómetros visuales. Si no puedes ver el tiempo, no puedes gestionarlo.",
      icon: Clock
    },
    {
      title: "Fragmentación del Desempeño",
      description: "Dividimos el currículo en ráfagas de 20 minutos. Éxito inmediato para mantener el compromiso.",
      icon: Target
    },
    {
      title: "Apoyo en el Punto de Acción",
      description: "Feedback instantáneo. Reducimos el espacio entre esfuerzo y recompensa para vencer la distracción.",
      icon: ArrowRight
    },
    {
      title: "Neurociencia Aplicada",
      description: "Principios para optimizar el aprendizaje y superar barreras cognitivas de ejecución.",
      icon: Brain
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#1e1e1e]">
      {/* Top Banner */}
      <div className="bg-[#1e1e1e] text-[11px] text-white/80 py-2.5 font-bold tracking-widest uppercase border-b border-white/5">
        <div className="container-harvard flex justify-end gap-8">
          <a href="#" className="hover:text-[#a51c30] transition-colors">Validación de Estudios</a>
          <a href="#" className="hover:text-[#a51c30] transition-colors">Entrenamiento Barkley</a>
        </div>
      </div>

      {/* Main Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md h-20' : 'bg-white h-24'}`}>
        <nav className="container-harvard h-full flex items-center justify-between">
          <div className="flex items-center gap-14 h-full">
            <a href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-[#a51c30] flex items-center justify-center shrink-0">
                <GraduationCap className="text-white w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[26px] font-black tracking-tight text-[#1e1e1e] uppercase leading-none">Barkley</span>
                <span className="text-[11px] tracking-[0.45em] font-black text-[#a51c30] uppercase mt-0.5">Instituto</span>
              </div>
            </a>
            
            <div className="hidden lg:flex items-center gap-10 text-[13px] font-black text-[#1e1e1e] uppercase tracking-[0.15em] h-full">
              {['Programas', 'Método', 'Plataforma', 'Contacto'].map((item) => (
                <a key={item} href="#" className="hover:text-[#a51c30] transition-colors relative group h-full flex items-center">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#a51c30] transition-all group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button className="hidden sm:flex items-center gap-2 text-[12px] font-black uppercase tracking-widest hover:text-[#a51c30] transition-colors">
              <Search className="w-5 h-5" />
              <span>Buscador</span>
            </button>
            <Button className="bg-[#a51c30] hover:bg-[#821626] text-white rounded-none uppercase tracking-[0.25em] text-[12px] font-black px-10 h-14 transition-all">
              Descubre el Método
            </Button>
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden">
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[700px] flex items-center overflow-hidden bg-black">
          <div className="absolute inset-0">
            <img src={heroBg} alt="" className="w-full h-full object-cover opacity-60 grayscale-[30%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
          </div>
          
          <div className="container-harvard relative z-10 pt-20">
            <div className="max-w-3xl">
              <h1 className="text-7xl md:text-[85px] font-serif text-white mb-10 leading-[0.95] font-black">
                Entrena tu cerebro <br />
                <span className="italic font-light text-[#a51c30]">para ganar.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-medium max-w-xl border-l-4 border-[#a51c30] pl-8">
                La primera plataforma de validación de estudios en Chile que elimina la procrastinación mediante neurociencia aplicada.
              </p>
              <Button size="lg" className="bg-[#a51c30] text-white hover:bg-[#821626] rounded-none px-14 py-9 text-[14px] font-black uppercase tracking-[0.3em] transition-all group">
                Explorar Programas <ChevronRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-24 bg-white border-b border-gray-100">
          <div className="container-harvard">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-6">
              <h2 className="text-[42px] font-serif font-black text-[#1e1e1e] leading-tight italic">Nuestros Programas y Servicios</h2>
              <div className="h-1 bg-[#a51c30] w-24" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {programs.map((prog) => (
                <div key={prog.id} className="group flex flex-col">
                  <div className="relative aspect-[16/10] mb-8 overflow-hidden bg-gray-100">
                    <img src={prog.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-[#a51c30] text-white rounded-none px-4 py-1.5 text-[10px] font-black tracking-widest uppercase">{prog.category}</Badge>
                    </div>
                  </div>
                  <div className="space-y-4 px-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#a51c30]">{prog.price}</p>
                    <h3 className="text-2xl font-serif font-black leading-tight text-[#1e1e1e] group-hover:underline decoration-[#a51c30] underline-offset-8 transition-all">
                      {prog.title}
                    </h3>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{prog.subtitle}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{prog.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Method Section */}
        <section className="py-32 bg-[#f9f9f9]">
          <div className="container-harvard grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 space-y-10">
              <h2 className="text-5xl md:text-6xl font-serif font-black text-[#1e1e1e] leading-[1.1] italic">¿Qué es el <br /><span className="text-[#a51c30] not-italic">Método Barkley?</span></h2>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                Es un andamiaje externo para las funciones ejecutivas. Diseñamos un entorno digital que externaliza el tiempo, las metas y las recompensas.
              </p>
              <p className="text-gray-600 leading-relaxed italic">
                "Mientras otros entregan contenido, nosotros entregamos capacidad de ejecución."
              </p>
              <Button className="bg-[#1e1e1e] hover:bg-black text-white rounded-none px-10 py-7 text-[12px] font-black uppercase tracking-[0.3em]">
                Saber Más
              </Button>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillars.map((pillar, i) => (
                <div key={i} className="bg-white p-12 group hover:shadow-2xl transition-all duration-500 border-b-4 border-transparent hover:border-[#a51c30]">
                   <pillar.icon className="w-10 h-10 text-[#a51c30] mb-8" />
                   <h4 className="text-xl font-serif font-black text-[#1e1e1e] mb-4">{pillar.title}</h4>
                   <p className="text-sm text-gray-500 leading-relaxed font-medium">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-40 bg-[#1e1e1e] relative overflow-hidden">
          <div className="container-harvard grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-serif font-black text-white italic">El Fundamento <br /><span className="text-[#a51c30] not-italic">de tu Éxito.</span></h2>
              <p className="text-white/60 text-xl font-light leading-relaxed max-w-md">
                El conocimiento es saber qué hacer; el Método Barkley es hacer lo que sabes. Cerramos la brecha entre intención y resultado.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 text-center">
              <div className="space-y-4">
                <div className="text-7xl font-serif font-black text-[#a51c30] italic">100%</div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Tasa de Aprobación</p>
              </div>
              <div className="space-y-4">
                <div className="text-7xl font-serif font-black text-[#a51c30] italic">20m</div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Ráfagas de Estudio</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-32 pb-20">
        <div className="container-harvard">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-32">
            <div className="lg:col-span-5 space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#a51c30] flex items-center justify-center">
                  <GraduationCap className="text-white w-9 h-9" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-[28px] font-black text-[#1e1e1e] uppercase leading-none">Barkley</span>
                  <span className="text-[11px] tracking-[0.45em] font-black text-[#a51c30] uppercase mt-1">Instituto</span>
                </div>
              </div>
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-sm italic">
                "Cerrando la brecha entre la intención y el resultado mediante neurociencia aplicada."
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-16">
              {[
                { title: "Programas", links: ["Plan Focus", "Plan Impulso", "Stratmore"] },
                { title: "Método", links: ["Pilares", "Neurociencia", "Investigación"] },
                { title: "Legal", links: ["Privacidad", "Términos", "Cookies"] }
              ].map(col => (
                <div key={col.title} className="space-y-8">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#a51c30]">{col.title}</h4>
                  <ul className="space-y-5">
                    {col.links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-sm font-bold text-[#1e1e1e] hover:text-[#a51c30] transition-colors uppercase tracking-widest">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
              © 2026 Barkley Instituto Chile. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
              <span>Neurociencia Aplicada</span>
              <div className="w-16 h-[1px] bg-gray-200" />
              <span>Chile</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#1e1e1e] text-white p-8 flex flex-col animate-in fade-in slide-in-from-right duration-300">
          <div className="flex justify-end mb-12">
            <button onClick={() => setMobileMenuOpen(false)}><X className="w-10 h-10" /></button>
          </div>
          <div className="space-y-8">
            {['Programas', 'Método', 'Plataforma', 'Contacto'].map(item => (
              <a key={item} href="#" className="block text-4xl font-serif font-black italic border-b border-white/10 pb-4">{item}</a>
            ))}
          </div>
          <Button className="mt-12 bg-[#a51c30] h-20 text-xl font-black rounded-none">Ver Programas</Button>
        </div>
      )}
    </div>
  );
}