import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Sparkles, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface PlanConfiguration {
  id: string;
  planKey: string;
  planName: string;
  monthlyPrice: number;
  enrollmentPrice: number;
  annualTotal: number | null;
  academicLoad: string | null;
  evaluationsDetail: string | null;
  subjects: string;
  description: string | null;
}

interface SelectedPlan {
  basePlan: PlanConfiguration | null;
  hasTeacher: boolean;
}

export function PlanConfiguratorNew() {
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>({
    basePlan: null,
    hasTeacher: false,
  });

  // Fetch data
  const { data: youthPlans = [] } = useQuery<PlanConfiguration[]>({
    queryKey: ["/api/plans"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: adultCycles = [] } = useQuery<any[]>({
    queryKey: ["/api/adult-cycles"],
    staleTime: 5 * 60 * 1000,
  });

  // Combine all plans
  const allPlans = [
    ...youthPlans.map(p => ({ ...p, type: 'youth' as const })),
    ...adultCycles.map(c => ({
      id: c.id,
      planKey: c.cycleKey,
      planName: c.cycleName,
      monthlyPrice: c.monthlyPrice,
      enrollmentPrice: c.enrollmentPrice,
      annualTotal: c.totalPrice,
      academicLoad: c.academicLoad,
      evaluationsDetail: `${c.modulesCount} Módulos, ${c.quizzesTotal} Quizzes, ${c.essaysCount} Ensayos`,
      subjects: c.mediaDS257 || '[]',
      description: `Programa para adultos con duración de ${c.durationMonths} meses`,
      type: 'adult' as const,
    }))
  ];

  const currentPlan = allPlans[currentPlanIndex];

  // Navigation
  const goToNext = () => {
    setDirection(1);
    setCurrentPlanIndex((prev) => (prev + 1) % allPlans.length);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentPlanIndex((prev) => (prev - 1 + allPlans.length) % allPlans.length);
  };

  const selectPlan = () => {
    setSelectedPlan(prev => ({ ...prev, basePlan: currentPlan }));
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate totals
  const calculateTotal = () => {
    if (!selectedPlan.basePlan) return 0;
    let total = selectedPlan.basePlan.monthlyPrice;
    if (selectedPlan.hasTeacher) total += 40000;
    return total;
  };

  const calculateAnnualTotal = () => {
    const monthly = calculateTotal();
    const enrollment = selectedPlan.basePlan?.enrollmentPrice || 0;
    return (monthly * 8) + enrollment;
  };

  const parseSubjects = (subjectsStr: string): string[] => {
    try {
      return JSON.parse(subjectsStr);
    } catch {
      return [];
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 400 : -400,
      opacity: 0,
      scale: 0.95,
    }),
  };

  if (allPlans.length === 0) {
    return <div className="py-20 text-center">Cargando planes...</div>;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#002147] mb-3">
            Configura tu Plan Ideal
          </h2>
          <p className="text-lg text-[#002147]/60">
            Elige, personaliza y confirma en 3 simples pasos
          </p>
        </motion.div>

        {/* 3-Column Layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUMN 1: Plan Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <Card className="border-2 border-[#002147]/20 overflow-hidden shadow-2xl" style={{ height: '500px' }}>
              {/* Header - Más compacto */}
              <div className="p-3 bg-gradient-to-r from-[#002147] via-[#003366] to-[#004d99] flex items-center justify-between border-b-2 border-[#D4AF37]">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow-lg transition-all duration-500 ${
                    selectedPlan.basePlan 
                      ? 'bg-[#D4AF37] text-[#002147]' 
                      : 'bg-white/20 text-white'
                  }`}>
                    {selectedPlan.basePlan ? '✓' : '1'}
                  </div>
                  <h3 className="text-base font-bold text-white">Elige tu Plan</h3>
                </div>
              </div>

              {/* Carousel - Más compacto */}
              <div className="relative overflow-hidden" style={{ height: 'calc(500px - 55px)' }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentPlanIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 260, damping: 25 },
                      opacity: { duration: 0.4 },
                      scale: { duration: 0.4 }
                    }}
                    className="absolute inset-0 p-4 flex flex-col justify-between"
                  >
                    {/* Plan Content - Más compacto */}
                    <div className="space-y-3">
                      <div className="text-center">
                        <Badge className="bg-[#002147]/10 text-[#002147] border border-[#002147]/30 mb-2 text-xs">
                          {currentPlan.type === 'youth' ? 'Jóvenes' : 'Adultos'}
                        </Badge>
                        <h4 className="text-xl font-bold text-[#002147] mb-1">
                          {currentPlan.planName}
                        </h4>
                      </div>

                      <div className="bg-gradient-to-br from-[#002147]/5 to-[#D4AF37]/10 rounded-lg p-4 text-center">
                        <div className="mb-2">
                          <span className="text-3xl font-bold text-[#002147]">
                            {formatCurrency(currentPlan.monthlyPrice)}
                          </span>
                          <span className="text-sm text-[#002147]/60 ml-1">/mes</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-[#002147]/60">Matrícula: </span>
                          <span className="font-bold text-[#002147]">
                            {formatCurrency(currentPlan.enrollmentPrice)}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#002147]/70 text-center leading-relaxed">
                        {currentPlan.description?.slice(0, 100)}...
                      </p>
                    </div>

                    {/* Navigation & Select Button - Más compactos */}
                    <div className="space-y-2">
                      {/* Carousel Navigation */}
                      <div className="flex items-center justify-between gap-3">
                        <Button
                          onClick={goToPrevious}
                          variant="outline"
                          size="sm"
                          className="flex-1 border border-[#002147]/20 hover:border-[#002147] hover:bg-[#002147]/5 h-8"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        
                        <div className="flex gap-1.5">
                          {allPlans.map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === currentPlanIndex
                                  ? 'w-6 bg-[#002147]'
                                  : 'w-1.5 bg-[#002147]/20'
                              }`}
                            />
                          ))}
                        </div>

                        <Button
                          onClick={goToNext}
                          variant="outline"
                          size="sm"
                          className="flex-1 border border-[#002147]/20 hover:border-[#002147] hover:bg-[#002147]/5 h-8"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Select Button - Más compacto */}
                      <Button
                        onClick={selectPlan}
                        className={`w-full py-4 text-sm font-bold rounded-lg transition-all duration-300 ${
                          selectedPlan.basePlan?.id === currentPlan.id
                            ? 'bg-[#D4AF37] text-[#002147] hover:bg-[#C5A028]'
                            : 'bg-[#002147] text-white hover:bg-[#003366]'
                        }`}
                      >
                        {selectedPlan.basePlan?.id === currentPlan.id ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Seleccionado
                          </>
                        ) : (
                          'Seleccionar Plan'
                        )}
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>

          {/* COLUMN 2: Plan Details & Options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <Card className={`border-2 overflow-hidden shadow-2xl transition-all duration-500 ${
              selectedPlan.basePlan 
                ? 'border-[#002147]/20' 
                : 'border-[#002147]/10 opacity-50'
            }`} style={{ height: '500px' }}>
              {/* Header - Más compacto */}
              <div className={`p-3 flex items-center justify-between border-b-2 transition-all duration-500 ${
                selectedPlan.basePlan
                  ? 'bg-gradient-to-r from-[#002147] via-[#003366] to-[#004d99] border-[#D4AF37]'
                  : 'bg-[#002147]/20 border-[#002147]/10'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow-lg transition-all duration-500 ${
                    selectedPlan.basePlan
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-[#002147]/40'
                  }`}>
                    2
                  </div>
                  <h3 className={`text-base font-bold ${selectedPlan.basePlan ? 'text-white' : 'text-[#002147]/40'}`}>
                    Detalles y Opciones
                  </h3>
                </div>
              </div>

              {/* Content - Más compacto */}
              <div className="p-4 overflow-y-auto" style={{ height: 'calc(500px - 55px)' }}>
                {!selectedPlan.basePlan ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-[#002147]/30 text-center">
                      Selecciona un plan para<br/>ver los detalles
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    {/* Plan Description */}
                    <div>
                      <h4 className="font-bold text-[#002147] mb-2 text-sm">📋 Descripción</h4>
                      <p className="text-[#002147]/70 leading-relaxed text-xs">
                        {selectedPlan.basePlan.description}
                      </p>
                    </div>

                    {/* Academic Load */}
                    {selectedPlan.basePlan.academicLoad && (
                      <div>
                        <h4 className="font-bold text-[#002147] mb-2 text-sm">📚 Carga Académica</h4>
                        <p className="text-[#002147]/70 text-xs">{selectedPlan.basePlan.academicLoad}</p>
                      </div>
                    )}

                    {/* Evaluations */}
                    {selectedPlan.basePlan.evaluationsDetail && (
                      <div>
                        <h4 className="font-bold text-[#002147] mb-2 text-sm">✅ Evaluaciones</h4>
                        <p className="text-[#002147]/70 text-xs">{selectedPlan.basePlan.evaluationsDetail}</p>
                      </div>
                    )}

                    {/* Subjects */}
                    <div>
                      <h4 className="font-bold text-[#002147] mb-2 text-sm">📖 Asignaturas</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {parseSubjects(selectedPlan.basePlan.subjects).map((subject, idx) => (
                          <Badge key={idx} className="bg-[#002147]/10 text-[#002147] border border-[#002147]/20 text-xs px-2 py-0.5">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#002147]/10 pt-4">
                      <h4 className="font-bold text-[#002147] mb-3 text-sm">➕ Agrega Extras</h4>
                      
                      {/* Teacher Option - Más compacto */}
                      <button
                        onClick={() => setSelectedPlan(prev => ({ ...prev, hasTeacher: !prev.hasTeacher }))}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                          selectedPlan.hasTeacher
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                            : 'border-[#002147]/20 hover:border-[#002147]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              selectedPlan.hasTeacher
                                ? 'border-[#D4AF37] bg-[#D4AF37]'
                                : 'border-[#002147]/30'
                            }`}>
                              {selectedPlan.hasTeacher && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <p className="font-bold text-[#002147] text-sm">Tutor Personalizado</p>
                              <p className="text-xs text-[#002147]/60">Sesiones individuales</p>
                            </div>
                          </div>
                          <p className="font-bold text-[#002147] text-sm">+$40.000</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* COLUMN 3: Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-4"
          >
            <Card className={`border-2 overflow-hidden shadow-2xl transition-all duration-500 ${
              selectedPlan.basePlan 
                ? 'border-[#D4AF37]/50 bg-gradient-to-br from-[#D4AF37]/5 to-transparent' 
                : 'border-[#002147]/10 opacity-50'
            }`} style={{ height: '500px' }}>
              {/* Header - Más compacto */}
              <div className={`p-3 flex items-center justify-between border-b-2 transition-all duration-500 ${
                selectedPlan.basePlan
                  ? 'bg-gradient-to-r from-[#002147] via-[#003366] to-[#004d99] border-[#D4AF37]'
                  : 'bg-[#002147]/20 border-[#002147]/10'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                    selectedPlan.basePlan
                      ? 'bg-[#D4AF37] text-[#002147]'
                      : 'bg-white/10 text-[#002147]/40'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className={`text-base font-bold ${selectedPlan.basePlan ? 'text-white' : 'text-[#002147]/40'}`}>
                    Tu Plan
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col justify-between" style={{ height: 'calc(500px - 55px)' }}>
                {!selectedPlan.basePlan ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-[#002147]/30 text-center">
                      Tu resumen aparecerá<br/>aquí
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col justify-between h-full"
                  >
                    {/* Summary Items - Más compactos */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-[#002147]/10">
                        <div>
                          <p className="font-semibold text-[#002147] text-sm">{selectedPlan.basePlan.planName}</p>
                          <p className="text-xs text-[#002147]/60">Plan base</p>
                        </div>
                        <p className="font-bold text-[#002147] text-sm">{formatCurrency(selectedPlan.basePlan.monthlyPrice)}</p>
                      </div>

                      {selectedPlan.hasTeacher && (
                        <div className="flex justify-between items-center pb-2 border-b border-[#002147]/10">
                          <div>
                            <p className="font-semibold text-[#002147] text-sm">Tutor Personalizado</p>
                            <p className="text-xs text-[#002147]/60">Extra</p>
                          </div>
                          <p className="font-bold text-[#002147] text-sm">+$40.000</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pb-2 border-b border-[#002147]/10">
                        <div>
                          <p className="font-semibold text-[#002147] text-sm">Matrícula</p>
                          <p className="text-xs text-[#002147]/60">Pago único</p>
                        </div>
                        <p className="font-bold text-[#002147] text-sm">{formatCurrency(selectedPlan.basePlan.enrollmentPrice)}</p>
                      </div>
                    </div>

                    {/* Totals - Más compactos */}
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-[#002147] to-[#003d7a] rounded-lg p-4 text-white">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-xs">Mensualidad</span>
                          <div>
                            <span className="text-2xl font-bold">{formatCurrency(calculateTotal())}</span>
                            <span className="text-xs ml-1">/mes</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-baseline pt-2 border-t border-white/20">
                          <span className="text-xs">Total Anual (8 meses)</span>
                          <span className="text-lg font-bold">{formatCurrency(calculateAnnualTotal())}</span>
                        </div>
                      </div>

                      <Button className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-[#002147] font-bold py-4 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Reservar este Plan
                      </Button>

                      <p className="text-xs text-center text-[#002147]/50">
                        Sin compromiso • Cancela cuando quieras
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
