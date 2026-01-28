import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bot, 
  Plus, 
  Save, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Power,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Level {
  id: string;
  name: string;
  programType: string;
}

interface GeminiCopilot {
  id?: string;
  name: string;
  geminiLink: string;
  description?: string;
  levelIds: string; // JSON string of array
  isActive: boolean;
}

export default function GeminiCopilotsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<GeminiCopilot, "id">>({
    name: "",
    geminiLink: "",
    description: "",
    levelIds: "[]",
    isActive: true,
  });
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Fetch levels
  const { data: levels } = useQuery<Level[]>({
    queryKey: ["/api/levels"],
  });

  // Fetch copilots
  const { data: copilots, isLoading } = useQuery<GeminiCopilot[]>({
    queryKey: ["/api/gemini-copilots"],
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Omit<GeminiCopilot, "id"> & { id?: string }) => {
      const url = data.id ? `/api/gemini-copilots/${data.id}` : "/api/gemini-copilots";
      const method = data.id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          geminiLink: data.geminiLink,
          description: data.description || null,
          levelIds: data.levelIds,
          isActive: data.isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error ${response.status}: ${errorData}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "✅ Guardado exitoso",
        description: "El copiloto se ha guardado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/gemini-copilots"] });
      resetForm();
    },
    onError: (error: Error) => {
      console.error("Error creating copilot:", error);
      toast({
        title: "❌ Error",
        description: error.message || "No se pudo guardar el copiloto",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/gemini-copilots/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "✅ Eliminado",
        description: "El copiloto se ha eliminado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/gemini-copilots"] });
    },
    onError: () => {
      toast({
        title: "❌ Error",
        description: "No se pudo eliminar el copiloto",
        variant: "destructive",
      });
    },
  });

  // Toggle active mutation
  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/gemini-copilots/${id}/toggle`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al cambiar estado");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gemini-copilots"] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      geminiLink: "",
      description: "",
      levelIds: "[]",
      isActive: true,
    });
    setSelectedLevels([]);
    setEditingId(null);
  };

  const handleEdit = (copilot: GeminiCopilot) => {
    setFormData({
      name: copilot.name,
      geminiLink: copilot.geminiLink,
      description: copilot.description || "",
      levelIds: copilot.levelIds,
      isActive: copilot.isActive,
    });
    try {
      const levelIds = JSON.parse(copilot.levelIds);
      setSelectedLevels(levelIds);
    } catch {
      setSelectedLevels([]);
    }
    setEditingId(copilot.id || null);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.geminiLink.trim()) {
      toast({
        title: "⚠️ Campos requeridos",
        description: "Nombre y Link son obligatorios",
        variant: "destructive",
      });
      return;
    }

    const dataToSave = {
      ...formData,
      levelIds: JSON.stringify(selectedLevels),
      ...(editingId && { id: editingId }),
    };

    saveMutation.mutate(dataToSave);
  };

  const toggleLevel = (levelId: string) => {
    setSelectedLevels(prev =>
      prev.includes(levelId)
        ? prev.filter(id => id !== levelId)
        : [...prev, levelId]
    );
  };

  const validateLink = (link: string): boolean => {
    try {
      const url = new URL(link);
      return url.hostname.includes("gemini") || url.hostname.includes("google");
    } catch {
      return false;
    }
  };

  const getLevelNames = (levelIdsJson: string): string => {
    try {
      const levelIds = JSON.parse(levelIdsJson);
      if (!levels) return levelIds.join(", ");
      
      return levelIds
        .map((id: string) => levels.find(l => l.id === id)?.name || id)
        .join(", ");
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Bot className="w-10 h-10 text-primary" />
            Gestión de Copilotos Gemini
          </h1>
          <p className="text-slate-600">
            Configura los copilotos de IA que asistirán a los estudiantes en sus cursos
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Cómo funciona:</strong> Cada copiloto puede servir múltiples niveles (ej: 3° y 4° Medio).
            Los estudiantes verán el copiloto correspondiente según su nivel de estudio.
          </AlertDescription>
        </Alert>

        {/* Form Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingId ? "✏️ Editar Copiloto" : "➕ Nuevo Copiloto"}
            </CardTitle>
            <CardDescription>
              Configura el nombre, link y niveles que atenderá este copiloto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Nombre del Copiloto *
              </Label>
              <Input
                id="name"
                placeholder="Ej: Academic Copilot I"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Gemini Link */}
            <div className="space-y-2">
              <Label htmlFor="link" className="text-base font-semibold">
                Link de Gemini *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="link"
                  placeholder="https://gemini.google.com/..."
                  value={formData.geminiLink}
                  onChange={(e) => setFormData({ ...formData, geminiLink: e.target.value })}
                  className={formData.geminiLink && !validateLink(formData.geminiLink) ? "border-red-500" : ""}
                />
                {formData.geminiLink && validateLink(formData.geminiLink) && (
                  <CheckCircle className="w-10 h-10 text-green-600 shrink-0" />
                )}
                {formData.geminiLink && !validateLink(formData.geminiLink) && (
                  <AlertCircle className="w-10 h-10 text-red-600 shrink-0" />
                )}
              </div>
              {formData.geminiLink && validateLink(formData.geminiLink) && (
                <a
                  href={formData.geminiLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Probar link en nueva pestaña
                </a>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Descripción (opcional)
              </Label>
              <Textarea
                id="description"
                placeholder="Ej: Copiloto para estudiantes de 3° y 4° Medio en todas las asignaturas"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            {/* Level Selection */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                Niveles que Atenderá *
              </Label>
              <p className="text-sm text-slate-600 mb-2">
                Selecciona los niveles para los cuales este copiloto estará disponible
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {levels?.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => toggleLevel(level.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedLevels.includes(level.id)
                        ? "border-primary bg-primary/10 font-semibold"
                        : "border-slate-200 hover:border-primary/50"
                    }`}
                  >
                    <span className="text-sm">{level.name}</span>
                    <span className="block text-xs text-slate-500 mt-1">
                      {level.programType}
                    </span>
                  </button>
                ))}
              </div>
              {selectedLevels.length > 0 && (
                <p className="text-sm text-green-600 font-medium mt-2">
                  ✓ {selectedLevels.length} nivel(es) seleccionado(s)
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex-1"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {editingId ? "Actualizar" : "Crear"} Copiloto
              </Button>
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Copilots List */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Copilotos Configurados</CardTitle>
            <CardDescription>
              {copilots?.length || 0} copiloto(s) en total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-slate-600">Cargando copilotos...</span>
              </div>
            ) : copilots && copilots.length > 0 ? (
              <div className="space-y-4">
                {copilots.map((copilot) => (
                  <div
                    key={copilot.id}
                    className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {copilot.name}
                          </h3>
                          <Badge variant={copilot.isActive ? "default" : "secondary"}>
                            {copilot.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                        
                        {copilot.description && (
                          <p className="text-sm text-slate-600 mb-2">{copilot.description}</p>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                          <span className="font-medium">Niveles:</span>
                          <span>{getLevelNames(copilot.levelIds)}</span>
                        </div>

                        <a
                          href={copilot.geminiLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ver copiloto en Gemini
                        </a>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleMutation.mutate(copilot.id!)}
                          disabled={toggleMutation.isPending}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(copilot)}
                        >
                          ✏️
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm(`¿Eliminar "${copilot.name}"?`)) {
                              deleteMutation.mutate(copilot.id!);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Bot className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No hay copilotos configurados</p>
                <p className="text-sm">Crea tu primer copiloto usando el formulario arriba</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
