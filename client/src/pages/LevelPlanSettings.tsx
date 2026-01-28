import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, DollarSign, BookOpen, Users, Crown, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LevelPlanConfiguration {
  id: string;
  levelGroupKey: string;
  levelGroupName: string;
  programType: "menores" | "adultos";
  levelsIncluded: string; // JSON array
  monthlyPriceFull: number;
  monthlyPriceStandard: number;
  monthlyPriceTutor: number;
  enrollmentPrice: number;
  modules: number;
  evaluationsPerModule: number;
  totalEvaluations: number;
  essays: number;
  sessionsPerMonth: number | null;
  subjects: string; // JSON array
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function LevelPlanSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<LevelPlanConfiguration | null>(null);
  const [subjectsInput, setSubjectsInput] = useState("");

  const { data: plans = [], isLoading } = useQuery<LevelPlanConfiguration[]>({
    queryKey: ["/api/level-plans"],
  });

  const initializeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/level-plans/initialize", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al inicializar");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "✅ Planes inicializados", description: "Los planes por defecto se han creado" });
      queryClient.invalidateQueries({ queryKey: ["/api/level-plans"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (plan: LevelPlanConfiguration) => {
      const response = await fetch(`/api/level-plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          levelGroupName: plan.levelGroupName,
          monthlyPriceFull: plan.monthlyPriceFull,
          monthlyPriceStandard: plan.monthlyPriceStandard,
          monthlyPriceTutor: plan.monthlyPriceTutor,
          enrollmentPrice: plan.enrollmentPrice,
          modules: plan.modules,
          evaluationsPerModule: plan.evaluationsPerModule,
          totalEvaluations: plan.totalEvaluations,
          essays: plan.essays,
          sessionsPerMonth: plan.sessionsPerMonth,
          subjects: plan.subjects,
          isActive: plan.isActive,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al guardar");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "✅ Guardado exitoso", description: "Los cambios se han guardado correctamente" });
      queryClient.invalidateQueries({ queryKey: ["/api/level-plans"] });
      setEditingPlan(null);
      setSubjectsInput("");
    },
    onError: (error: Error) => {
      toast({ 
        title: "❌ Error", 
        description: error.message || "No se pudieron guardar los cambios", 
        variant: "destructive" 
      });
    },
  });

  const handleEdit = (plan: LevelPlanConfiguration) => {
    setEditingPlan(plan);
    try {
      const subjects = JSON.parse(plan.subjects);
      setSubjectsInput(subjects.join(", "));
    } catch {
      setSubjectsInput("");
    }
  };

  const handleSave = () => {
    if (!editingPlan) return;

    // Convertir asignaturas de texto a JSON array
    const subjectsArray = subjectsInput
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updatedPlan = {
      ...editingPlan,
      subjects: JSON.stringify(subjectsArray),
    };

    updateMutation.mutate(updatedPlan);
  };

  const parseSubjects = (subjectsJson: string): string[] => {
    try {
      return JSON.parse(subjectsJson);
    } catch {
      return [];
    }
  };

  const parseLevels = (levelsJson: string): string[] => {
    try {
      return JSON.parse(levelsJson);
    } catch {
      return [];
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-CL")}`;
  };

  // Separar planes por tipo
  const menoresPlan = plans.filter(p => p.programType === "menores");
  const adultosPlan = plans.filter(p => p.programType === "adultos");

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#002147] mb-2">
          Configuración de Planes por Nivel
        </h1>
        <p className="text-[#002147]/70">
          Organizado por niveles académicos. Cada grupo puede tener asignaturas específicas.
        </p>
      </div>

      {/* Initialize Button */}
      {plans.length === 0 && !isLoading && (
        <Card className="mb-6 border-[#D4AF37]">
          <CardContent className="pt-6">
            <p className="mb-4 text-[#002147]">No hay planes configurados. Inicializa los planes por defecto:</p>
            <Button 
              onClick={() => initializeMutation.mutate()}
              disabled={initializeMutation.isPending}
              className="bg-[#002147] hover:bg-[#003366]"
            >
              {initializeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Inicializar Planes por Defecto
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="menores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="menores">Menores de Edad</TabsTrigger>
          <TabsTrigger value="adultos">Adultos (EPJA)</TabsTrigger>
        </TabsList>

        {/* Menores de Edad */}
        <TabsContent value="menores" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#002147]" />
            </div>
          ) : menoresPlan.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-[#002147]/70">
                No hay planes configurados para menores de edad
              </CardContent>
            </Card>
          ) : (
            menoresPlan.map((plan) => (
              <Card key={plan.id} className="border-[#002147]/20">
                <CardHeader className="bg-gradient-to-r from-[#002147]/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-[#002147]">{plan.levelGroupName}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        Niveles: {parseLevels(plan.levelsIncluded).join(", ")}
                      </CardDescription>
                    </div>
                    <Badge variant={plan.isActive ? "default" : "secondary"} className="bg-[#D4AF37] text-white">
                      {plan.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {editingPlan?.id === plan.id ? (
                    // EDITING MODE
                    <div className="space-y-6">
                      {/* Precios de los 3 planes */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-[#D4AF37]" />
                            Plan Full (mensual)
                          </Label>
                          <Input
                            type="number"
                            value={editingPlan.monthlyPriceFull}
                            onChange={(e) => setEditingPlan({ ...editingPlan, monthlyPriceFull: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#002147]" />
                            Plan Estándar (mensual)
                          </Label>
                          <Input
                            type="number"
                            value={editingPlan.monthlyPriceStandard}
                            onChange={(e) => setEditingPlan({ ...editingPlan, monthlyPriceStandard: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#002147]" />
                            Solo Tutor (mensual)
                          </Label>
                          <Input
                            type="number"
                            value={editingPlan.monthlyPriceTutor}
                            onChange={(e) => setEditingPlan({ ...editingPlan, monthlyPriceTutor: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>

                      {/* Matrícula */}
                      <div className="space-y-2">
                        <Label>Precio de Matrícula (común para todos)</Label>
                        <Input
                          type="number"
                          value={editingPlan.enrollmentPrice}
                          onChange={(e) => setEditingPlan({ ...editingPlan, enrollmentPrice: parseInt(e.target.value) || 0 })}
                        />
                      </div>

                      {/* Detalles Académicos */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Módulos</Label>
                          <Input
                            type="number"
                            value={editingPlan.modules}
                            onChange={(e) => setEditingPlan({ ...editingPlan, modules: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Eval. por Módulo</Label>
                          <Input
                            type="number"
                            value={editingPlan.evaluationsPerModule}
                            onChange={(e) => setEditingPlan({ ...editingPlan, evaluationsPerModule: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Total Evaluaciones</Label>
                          <Input
                            type="number"
                            value={editingPlan.totalEvaluations}
                            onChange={(e) => setEditingPlan({ ...editingPlan, totalEvaluations: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Ensayos Mineduc</Label>
                          <Input
                            type="number"
                            value={editingPlan.essays}
                            onChange={(e) => setEditingPlan({ ...editingPlan, essays: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>

                      {/* Asignaturas */}
                      <div className="space-y-2">
                        <Label>Asignaturas (separadas por comas)</Label>
                        <Textarea
                          value={subjectsInput}
                          onChange={(e) => setSubjectsInput(e.target.value)}
                          placeholder="Lenguaje, Matemática, Ciencias Naturales, Historia, Inglés"
                          rows={3}
                        />
                        <p className="text-xs text-[#002147]/60">
                          Específicas para este grupo de niveles
                        </p>
                      </div>

                      {/* Botones */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={updateMutation.isPending}
                          className="bg-[#002147] hover:bg-[#003366]"
                        >
                          {updateMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Guardar Cambios
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingPlan(null);
                            setSubjectsInput("");
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // VIEWING MODE
                    <div className="space-y-6">
                      {/* Precios */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-lg border border-[#D4AF37]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-5 h-5 text-[#D4AF37]" />
                            <h4 className="font-semibold text-[#002147]">Plan Full</h4>
                          </div>
                          <p className="text-2xl font-bold text-[#002147]">{formatPrice(plan.monthlyPriceFull)}</p>
                          <p className="text-sm text-[#002147]/60">mensual</p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-[#002147]/5 to-transparent rounded-lg border border-[#002147]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-5 h-5 text-[#002147]" />
                            <h4 className="font-semibold text-[#002147]">Plan Estándar</h4>
                          </div>
                          <p className="text-2xl font-bold text-[#002147]">{formatPrice(plan.monthlyPriceStandard)}</p>
                          <p className="text-sm text-[#002147]/60">mensual</p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-[#002147]/5 to-transparent rounded-lg border border-[#002147]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-[#002147]" />
                            <h4 className="font-semibold text-[#002147]">Solo Tutor</h4>
                          </div>
                          <p className="text-2xl font-bold text-[#002147]">{formatPrice(plan.monthlyPriceTutor)}</p>
                          <p className="text-sm text-[#002147]/60">mensual</p>
                        </div>
                      </div>

                      {/* Matrícula */}
                      <div className="flex items-center gap-3 p-4 bg-[#D4AF37]/5 rounded-lg border border-[#D4AF37]/20">
                        <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                        <div>
                          <p className="text-sm font-semibold text-[#002147]">Matrícula</p>
                          <p className="text-xl font-bold text-[#002147]">{formatPrice(plan.enrollmentPrice)}</p>
                        </div>
                      </div>

                      {/* Carga Académica */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-[#002147]/5 rounded-lg">
                          <p className="text-2xl font-bold text-[#002147]">{plan.modules}</p>
                          <p className="text-xs text-[#002147]/60">Módulos</p>
                        </div>
                        <div className="text-center p-3 bg-[#002147]/5 rounded-lg">
                          <p className="text-2xl font-bold text-[#002147]">{plan.evaluationsPerModule}</p>
                          <p className="text-xs text-[#002147]/60">Eval. por Módulo</p>
                        </div>
                        <div className="text-center p-3 bg-[#002147]/5 rounded-lg">
                          <p className="text-2xl font-bold text-[#002147]">{plan.totalEvaluations}</p>
                          <p className="text-xs text-[#002147]/60">Total Evaluaciones</p>
                        </div>
                        <div className="text-center p-3 bg-[#002147]/5 rounded-lg">
                          <p className="text-2xl font-bold text-[#002147]">{plan.essays}</p>
                          <p className="text-xs text-[#002147]/60">Ensayos Mineduc</p>
                        </div>
                      </div>

                      {/* Asignaturas */}
                      <div>
                        <p className="text-sm font-semibold text-[#002147] mb-3">Asignaturas:</p>
                        <div className="flex flex-wrap gap-2">
                          {parseSubjects(plan.subjects).map((subject, idx) => (
                            <Badge key={idx} variant="outline" className="border-[#002147] text-[#002147]">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Botón Editar */}
                      <div className="pt-4 border-t">
                        <Button
                          onClick={() => handleEdit(plan)}
                          className="bg-[#002147] hover:bg-[#003366]"
                        >
                          Editar Configuración
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Adultos (EPJA) */}
        <TabsContent value="adultos" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#002147]" />
            </div>
          ) : adultosPlan.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-[#002147]/70">
                No hay planes configurados para adultos (EPJA)
              </CardContent>
            </Card>
          ) : (
            adultosPlan.map((plan) => (
              <Card key={plan.id} className="border-[#D4AF37]/30">
                <CardHeader className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-[#002147]">{plan.levelGroupName}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        Niveles: {parseLevels(plan.levelsIncluded).join(", ")} • Educación de Adultos
                      </CardDescription>
                    </div>
                    <Badge variant={plan.isActive ? "default" : "secondary"} className="bg-[#D4AF37] text-white">
                      {plan.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {editingPlan?.id === plan.id ? (
                    // EDITING MODE - Solo Full y Estándar para Adultos
                    <div className="space-y-6">
                      {/* Precios - Solo 2 planes para adultos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-[#D4AF37]" />
                            Plan Full (mensual)
                          </Label>
                          <Input
                            type="number"
                            value={editingPlan.monthlyPriceFull}
                            onChange={(e) => setEditingPlan({ ...editingPlan, monthlyPriceFull: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#002147]" />
                            Plan Estándar (mensual)
                          </Label>
                          <Input
                            type="number"
                            value={editingPlan.monthlyPriceStandard}
                            onChange={(e) => setEditingPlan({ ...editingPlan, monthlyPriceStandard: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>

                      {/* Matrícula */}
                      <div className="space-y-2">
                        <Label>Precio de Matrícula (común para todos)</Label>
                        <Input
                          type="number"
                          value={editingPlan.enrollmentPrice}
                          onChange={(e) => setEditingPlan({ ...editingPlan, enrollmentPrice: parseInt(e.target.value) || 0 })}
                        />
                      </div>

                      {/* Detalles Académicos */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Módulos</Label>
                          <Input
                            type="number"
                            value={editingPlan.modules}
                            onChange={(e) => setEditingPlan({ ...editingPlan, modules: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Eval. por Módulo</Label>
                          <Input
                            type="number"
                            value={editingPlan.evaluationsPerModule}
                            onChange={(e) => setEditingPlan({ ...editingPlan, evaluationsPerModule: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Total Evaluaciones</Label>
                          <Input
                            type="number"
                            value={editingPlan.totalEvaluations}
                            onChange={(e) => setEditingPlan({ ...editingPlan, totalEvaluations: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Ensayos Mineduc</Label>
                          <Input
                            type="number"
                            value={editingPlan.essays}
                            onChange={(e) => setEditingPlan({ ...editingPlan, essays: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>

                      {/* Asignaturas */}
                      <div className="space-y-2">
                        <Label>Asignaturas (separadas por comas)</Label>
                        <Textarea
                          value={subjectsInput}
                          onChange={(e) => setSubjectsInput(e.target.value)}
                          placeholder="Lengua Castellana, Matemática, Ciencias Naturales, Estudios Sociales"
                          rows={3}
                        />
                        <p className="text-xs text-[#002147]/60">
                          Específicas para adultos (EPJA)
                        </p>
                      </div>

                      {/* Botones */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={updateMutation.isPending}
                          className="bg-[#002147] hover:bg-[#003366]"
                        >
                          {updateMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Guardar Cambios
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingPlan(null);
                            setSubjectsInput("");
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // VIEWING MODE - Solo Full y Estándar para Adultos
                    <div className="space-y-6">
                      {/* Precios - Solo 2 planes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-lg border border-[#D4AF37]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-5 h-5 text-[#D4AF37]" />
                            <h4 className="font-semibold text-[#002147]">Plan Full</h4>
                          </div>
                          <p className="text-2xl font-bold text-[#002147]">{formatPrice(plan.monthlyPriceFull)}</p>
                          <p className="text-sm text-[#002147]/60">mensual</p>
                          <p className="text-xs text-[#D4AF37] mt-2">Con tutorías personalizadas</p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-[#002147]/5 to-transparent rounded-lg border border-[#002147]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-5 h-5 text-[#002147]" />
                            <h4 className="font-semibold text-[#002147]">Plan Estándar</h4>
                          </div>
                          <p className="text-2xl font-bold text-[#002147]">{formatPrice(plan.monthlyPriceStandard)}</p>
                          <p className="text-sm text-[#002147]/60">mensual</p>
                          <p className="text-xs text-[#002147]/60 mt-2">Solo acceso a plataforma</p>
                        </div>
                      </div>

                      {/* Matrícula */}
                      <div className="flex items-center gap-3 p-4 bg-[#D4AF37]/5 rounded-lg border border-[#D4AF37]/20">
                        <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                        <div>
                          <p className="text-sm font-semibold text-[#002147]">Matrícula</p>
                          <p className="text-xl font-bold text-[#002147]">{formatPrice(plan.enrollmentPrice)}</p>
                        </div>
                      </div>

                      {/* Carga Académica */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-[#002147]/5 rounded-lg">
                          <p className="text-2xl font-bold text-[#002147]">{plan.modules}</p>
                          <p className="text-xs text-[#002147]/60">Módulos</p>
                        </div>
                        <div className="text-center p-3 bg-[#002147]/5 rounded-lg">
                          <p className="text-2xl font-bold text-[#002147]">{plan.evaluationsPerModule}</p>
                          <p className="text-xs text-[#002147]/60">Eval. por Módulo</p>
                        </div>
                        <div className="text-center p-3 bg-[#002147]/5 rounded-lg">
                          <p className="text-2xl font-bold text-[#002147]">{plan.totalEvaluations}</p>
                          <p className="text-xs text-[#002147]/60">Total Evaluaciones</p>
                        </div>
                        <div className="text-center p-3 bg-[#002147]/5 rounded-lg">
                          <p className="text-2xl font-bold text-[#002147]">{plan.essays}</p>
                          <p className="text-xs text-[#002147]/60">Ensayos Mineduc</p>
                        </div>
                      </div>

                      {/* Asignaturas */}
                      <div>
                        <p className="text-sm font-semibold text-[#002147] mb-3">Asignaturas:</p>
                        <div className="flex flex-wrap gap-2">
                          {parseSubjects(plan.subjects).map((subject, idx) => (
                            <Badge key={idx} variant="outline" className="border-[#D4AF37] text-[#002147]">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Botón Editar */}
                      <div className="pt-4 border-t">
                        <Button
                          onClick={() => handleEdit(plan)}
                          className="bg-[#002147] hover:bg-[#003366]"
                        >
                          Editar Configuración
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
