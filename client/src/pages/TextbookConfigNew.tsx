import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  BookOpen,
  Save,
  Loader2,
  Check,
  FileText,
  ExternalLink,
  Plus,
  Trash2,
  Eye
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  slug: string;
}

interface TextbookConfig {
  id: string;
  subjectId: string;
  pdfUrl: string;
  pdfName: string;
  totalPages: number | null;
  modulePagesConfig: string;
}

interface ModulePageRange {
  start: number;
  end: number;
}

export default function TextbookConfigNew() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [moduleRanges, setModuleRanges] = useState<Record<number, ModulePageRange>>({});
  const [editingModule, setEditingModule] = useState<number | null>(null);

  // Fetch all subjects
  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ['/api/subjects'],
    queryFn: async () => {
      const res = await fetch('/api/subjects', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch subjects');
      return res.json();
    }
  });

  // Fetch textbook config for selected subject
  const { data: existingConfig, isLoading: isLoadingConfig } = useQuery<TextbookConfig>({
    queryKey: ['/api/textbooks/subject', selectedSubjectId],
    queryFn: async () => {
      const res = await fetch(`/api/textbooks/subject/${selectedSubjectId}`, { 
        credentials: 'include' 
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch config');
      return res.json();
    },
    enabled: !!selectedSubjectId,
  });

  // Load existing config when subject changes
  useState(() => {
    if (existingConfig) {
      setPdfUrl(existingConfig.pdfUrl);
      setPdfName(existingConfig.pdfName);
      setTotalPages(existingConfig.totalPages || 0);
      
      try {
        const config = JSON.parse(existingConfig.modulePagesConfig);
        const ranges: Record<number, ModulePageRange> = {};
        Object.entries(config).forEach(([key, value]: [string, any]) => {
          const moduleNum = parseInt(key.replace('module_', ''));
          ranges[moduleNum] = { start: value.start, end: value.end };
        });
        setModuleRanges(ranges);
      } catch (e) {
        console.error("Error parsing config:", e);
      }
    }
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      // Convert moduleRanges to the format expected by backend
      const modulePagesConfig: Record<string, ModulePageRange> = {};
      Object.entries(moduleRanges).forEach(([moduleNum, range]) => {
        modulePagesConfig[`module_${moduleNum}`] = range;
      });

      const res = await fetch('/api/textbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subjectId: selectedSubjectId,
          pdfUrl,
          pdfName,
          totalPages: totalPages || null,
          modulePagesConfig: JSON.stringify(modulePagesConfig)
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to save config');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('¡Configuración guardada exitosamente!');
      queryClient.invalidateQueries({ queryKey: ['/api/textbooks'] });
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const addModuleRange = () => {
    const nextModule = Math.max(0, ...Object.keys(moduleRanges).map(Number)) + 1;
    setModuleRanges({
      ...moduleRanges,
      [nextModule]: { start: 1, end: 1 }
    });
    setEditingModule(nextModule);
  };

  const removeModuleRange = (moduleNum: number) => {
    const newRanges = { ...moduleRanges };
    delete newRanges[moduleNum];
    setModuleRanges(newRanges);
  };

  const updateModuleRange = (moduleNum: number, field: 'start' | 'end', value: number) => {
    setModuleRanges({
      ...moduleRanges,
      [moduleNum]: {
        ...moduleRanges[moduleNum],
        [field]: value
      }
    });
  };

  const handleQuickSetup = () => {
    if (!totalPages || totalPages <= 0) {
      toast.error('Por favor ingresa el total de páginas del PDF');
      return;
    }

    // Distribute 15 modules evenly across the PDF
    const pagesPerModule = Math.floor(totalPages / 15);
    const newRanges: Record<number, ModulePageRange> = {};

    for (let i = 1; i <= 15; i++) {
      const start = (i - 1) * pagesPerModule + 1;
      const end = i === 15 ? totalPages : i * pagesPerModule;
      newRanges[i] = { start, end };
    }

    setModuleRanges(newRanges);
    toast.success('Distribución automática creada para 15 módulos');
  };

  const canSave = selectedSubjectId && pdfUrl && pdfName && Object.keys(moduleRanges).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-serif font-black text-[#1e1e1e]">
                  Configuración de Libros de Texto
                </h1>
                <p className="text-gray-600 mt-1">
                  Asigna páginas del PDF a cada módulo
                </p>
              </div>
            </div>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!canSave || saveMutation.isPending}
              className="bg-[#A51C30] hover:bg-[#821626]"
            >
              {saveMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Guardar Configuración</>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#A51C30]" />
                    Seleccionar Asignatura
                  </CardTitle>
                  <CardDescription>
                    Elige la asignatura para configurar su libro de texto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una asignatura" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isLoadingConfig && selectedSubjectId && (
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cargando configuración existente...
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* PDF Configuration */}
            {selectedSubjectId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#A51C30]" />
                      Información del PDF
                    </CardTitle>
                    <CardDescription>
                      URL de Google Drive y detalles del libro
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="pdfUrl">URL del PDF (Google Drive)</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="pdfUrl"
                          type="url"
                          placeholder="https://drive.google.com/file/d/..."
                          value={pdfUrl}
                          onChange={(e) => setPdfUrl(e.target.value)}
                        />
                        {pdfUrl && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(pdfUrl, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Comparte el archivo en Drive y pega el link aquí
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="pdfName">Nombre del Libro</Label>
                      <Input
                        id="pdfName"
                        placeholder="Ej: Matemática 7° Básico - Texto del Estudiante"
                        value={pdfName}
                        onChange={(e) => setPdfName(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="totalPages">Total de Páginas</Label>
                      <Input
                        id="totalPages"
                        type="number"
                        placeholder="Ej: 250"
                        value={totalPages || ''}
                        onChange={(e) => setTotalPages(parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      variant="outline"
                      onClick={handleQuickSetup}
                      disabled={!totalPages || totalPages <= 0}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Distribución Automática (15 Módulos)
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Module Ranges */}
            {selectedSubjectId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-[#A51C30]" />
                          Páginas por Módulo
                        </CardTitle>
                        <CardDescription>
                          Asigna rangos de páginas a cada módulo
                        </CardDescription>
                      </div>
                      <Button onClick={addModuleRange} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Módulo
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.keys(moduleRanges).length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No hay módulos configurados</p>
                          <p className="text-sm">Click en "Agregar Módulo" o usa la distribución automática</p>
                        </div>
                      ) : (
                        Object.entries(moduleRanges)
                          .sort(([a], [b]) => parseInt(a) - parseInt(b))
                          .map(([moduleNum, range]) => (
                            <motion.div
                              key={moduleNum}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <Badge className="bg-[#A51C30] hover:bg-[#821626]">
                                Módulo {moduleNum}
                              </Badge>
                              <div className="flex items-center gap-2 flex-1">
                                <Input
                                  type="number"
                                  placeholder="Desde"
                                  value={range.start}
                                  onChange={(e) => updateModuleRange(
                                    parseInt(moduleNum),
                                    'start',
                                    parseInt(e.target.value) || 1
                                  )}
                                  className="w-24"
                                />
                                <span className="text-gray-500">-</span>
                                <Input
                                  type="number"
                                  placeholder="Hasta"
                                  value={range.end}
                                  onChange={(e) => updateModuleRange(
                                    parseInt(moduleNum),
                                    'end',
                                    parseInt(e.target.value) || 1
                                  )}
                                  className="w-24"
                                />
                                <span className="text-sm text-gray-600">
                                  ({range.end - range.start + 1} págs)
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeModuleRange(parseInt(moduleNum))}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </motion.div>
                          ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Column - Preview & Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  Resumen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Asignatura</p>
                  <p className="font-semibold">
                    {subjects.find(s => s.id === selectedSubjectId)?.name || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Libro</p>
                  <p className="font-semibold">{pdfName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Páginas</p>
                  <p className="font-semibold">{totalPages || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Módulos Configurados</p>
                  <p className="font-semibold">{Object.keys(moduleRanges).length}</p>
                </div>
                {Object.keys(moduleRanges).length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Páginas Asignadas</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(moduleRanges)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([num, range]) => (
                          <Badge key={num} variant="outline" className="text-xs">
                            M{num}: {range.start}-{range.end}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">💡 Consejos</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-700">
                <p>• Usa la distribución automática para crear 15 módulos equitativos</p>
                <p>• Ajusta manualmente cada rango según el contenido real</p>
                <p>• Los estudiantes solo verán las páginas asignadas a su módulo</p>
                <p>• Asegúrate de que el link de Drive sea público o compartido</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
