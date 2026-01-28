import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, DollarSign, BookOpen, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlanConfiguration {
  id: string;
  planKey: string;
  planName: string;
  planSubtitle: string | null;
  monthlyPrice: number;
  enrollmentPrice: number;
  annualTotal: number | null;
  academicLoad: string | null;
  evaluationsDetail: string | null;
  subjects: string;
  description: string | null;
  category: string | null;
  linkText: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function PlanSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<PlanConfiguration | null>(null);

  const { data: plans = [], isLoading } = useQuery<PlanConfiguration[]>({
    queryKey: ["/api/plans"],
  });

  const initializeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/plans/initialize", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al inicializar planes");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({
        title: "Planes inicializados",
        description: "Los planes por defecto han sido creados correctamente.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (plan: PlanConfiguration) => {
      const response = await fetch(`/api/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: plan.planName,
          planSubtitle: plan.planSubtitle,
          monthlyPrice: plan.monthlyPrice,
          enrollmentPrice: plan.enrollmentPrice,
          annualTotal: plan.annualTotal,
          academicLoad: plan.academicLoad,
          evaluationsDetail: plan.evaluationsDetail,
          subjects: plan.subjects,
          description: plan.description,
          category: plan.category,
          linkText: plan.linkText,
        }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al actualizar plan");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      setEditingPlan(null);
      toast({
        title: "Plan actualizado",
        description: "Los cambios han sido guardados correctamente.",
      });
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(value);
  };

  const parseSubjects = (subjectsStr: string): string[] => {
    try {
      return JSON.parse(subjectsStr);
    } catch {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#002147]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#002147] mb-2">
          Configuración de Planes
        </h1>
        <p className="text-[#002147]/70">
          Panel de Control para gestionar los planes del Barkley Institute
        </p>
      </div>

      {/* Initialize Button */}
      {plans.length === 0 && (
        <Card className="mb-6 border-[#D4AF37]">
          <CardHeader>
            <CardTitle className="text-[#002147]">No hay planes configurados</CardTitle>
            <CardDescription>
              Inicializa los planes por defecto para comenzar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => initializeMutation.mutate()}
              disabled={initializeMutation.isPending}
              className="bg-[#002147] hover:bg-[#003366] text-white"
            >
              {initializeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Inicializando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Inicializar Planes por Defecto
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Plans List */}
      <div className="grid grid-cols-1 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-2 border-[#002147]/10 hover:border-[#D4AF37] transition-colors">
            <CardHeader className="bg-[#002147] text-white">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-serif">{plan.planName}</CardTitle>
                  {plan.planSubtitle && (
                    <CardDescription className="text-white/70 mt-1">
                      {plan.planSubtitle}
                    </CardDescription>
                  )}
                </div>
                <Badge className="bg-[#D4AF37] text-[#002147] hover:bg-[#D4AF37]/90">
                  {plan.category || "General"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {editingPlan?.id === plan.id ? (
                /* Edit Form */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="planName" className="text-[#002147] font-semibold">
                        Nombre del Plan *
                      </Label>
                      <Input
                        id="planName"
                        value={editingPlan.planName}
                        onChange={(e) => setEditingPlan({ ...editingPlan, planName: e.target.value })}
                        className="border-[#002147]/30 focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="planSubtitle" className="text-[#002147] font-semibold">
                        Subtítulo
                      </Label>
                      <Input
                        id="planSubtitle"
                        value={editingPlan.planSubtitle || ""}
                        onChange={(e) => setEditingPlan({ ...editingPlan, planSubtitle: e.target.value })}
                        className="border-[#002147]/30 focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyPrice" className="text-[#002147] font-semibold flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Mensualidad *
                      </Label>
                      <Input
                        id="monthlyPrice"
                        type="number"
                        value={editingPlan.monthlyPrice}
                        onChange={(e) => setEditingPlan({ ...editingPlan, monthlyPrice: parseInt(e.target.value) })}
                        className="border-[#002147]/30 focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="enrollmentPrice" className="text-[#002147] font-semibold flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Matrícula *
                      </Label>
                      <Input
                        id="enrollmentPrice"
                        type="number"
                        value={editingPlan.enrollmentPrice}
                        onChange={(e) => setEditingPlan({ ...editingPlan, enrollmentPrice: parseInt(e.target.value) })}
                        className="border-[#002147]/30 focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="annualTotal" className="text-[#002147] font-semibold flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Total Anual
                      </Label>
                      <Input
                        id="annualTotal"
                        type="number"
                        value={editingPlan.annualTotal || ""}
                        onChange={(e) => setEditingPlan({ ...editingPlan, annualTotal: parseInt(e.target.value) || null })}
                        className="border-[#002147]/30 focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="academicLoad" className="text-[#002147] font-semibold flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Carga Académica
                      </Label>
                      <Input
                        id="academicLoad"
                        value={editingPlan.academicLoad || ""}
                        onChange={(e) => setEditingPlan({ ...editingPlan, academicLoad: e.target.value })}
                        placeholder="15 Módulos"
                        className="border-[#002147]/30 focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="evaluationsDetail" className="text-[#002147] font-semibold flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Evaluaciones
                      </Label>
                      <Input
                        id="evaluationsDetail"
                        value={editingPlan.evaluationsDetail || ""}
                        onChange={(e) => setEditingPlan({ ...editingPlan, evaluationsDetail: e.target.value })}
                        placeholder="75 Quizzes y 2 Ensayos por asignatura"
                        className="border-[#002147]/30 focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subjects" className="text-[#002147] font-semibold">
                      Asignaturas (JSON Array)
                    </Label>
                    <Input
                      id="subjects"
                      value={editingPlan.subjects}
                      onChange={(e) => setEditingPlan({ ...editingPlan, subjects: e.target.value })}
                      placeholder='["Lenguaje","Matemática","Historia","Ciencias","Inglés"]'
                      className="border-[#002147]/30 focus:border-[#D4AF37] font-mono text-sm"
                    />
                    <p className="text-xs text-[#002147]/60">
                      Ejemplo: ["Lenguaje","Matemática","Historia","Ciencias","Inglés"]
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[#002147] font-semibold">
                      Descripción
                    </Label>
                    <Textarea
                      id="description"
                      value={editingPlan.description || ""}
                      onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                      rows={3}
                      className="border-[#002147]/30 focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-[#002147]/10">
                    <Button
                      variant="outline"
                      onClick={() => setEditingPlan(null)}
                      className="border-[#002147] text-[#002147] hover:bg-[#002147]/5"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => updateMutation.mutate(editingPlan)}
                      disabled={updateMutation.isPending}
                      className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#002147]"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="space-y-4">
                  {/* Pricing */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-[#D4AF37]/10 rounded-lg">
                    <div>
                      <p className="text-xs text-[#002147]/60 mb-1 font-semibold uppercase tracking-wider">Mensualidad</p>
                      <p className="text-2xl font-bold text-[#002147]">{formatCurrency(plan.monthlyPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#002147]/60 mb-1 font-semibold uppercase tracking-wider">Matrícula</p>
                      <p className="text-2xl font-bold text-[#002147]">{formatCurrency(plan.enrollmentPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#002147]/60 mb-1 font-semibold uppercase tracking-wider">Total Anual</p>
                      <p className="text-2xl font-bold text-[#D4AF37]">
                        {plan.annualTotal ? formatCurrency(plan.annualTotal) : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Academic Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.academicLoad && (
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#002147]">Carga Académica</p>
                          <p className="text-sm text-[#002147]/70">{plan.academicLoad}</p>
                        </div>
                      </div>
                    )}
                    {plan.evaluationsDetail && (
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#002147]">Evaluaciones</p>
                          <p className="text-sm text-[#002147]/70">{plan.evaluationsDetail}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subjects */}
                  <div>
                    <p className="text-sm font-semibold text-[#002147] mb-2">Asignaturas:</p>
                    <div className="flex flex-wrap gap-2">
                      {parseSubjects(plan.subjects).map((subject, idx) => (
                        <Badge key={idx} variant="outline" className="border-[#002147] text-[#002147]">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  {plan.description && (
                    <p className="text-sm text-[#002147]/70 leading-relaxed border-l-4 border-[#D4AF37] pl-4">
                      {plan.description}
                    </p>
                  )}

                  <div className="flex justify-end pt-4 border-t border-[#002147]/10">
                    <Button
                      onClick={() => setEditingPlan(plan)}
                      className="bg-[#002147] hover:bg-[#003366] text-white"
                    >
                      Editar Plan
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
