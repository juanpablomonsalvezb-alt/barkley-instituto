import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  FolderOpen, 
  FileVideo, 
  FileAudio, 
  FileImage, 
  Presentation, 
  FileText,
  RefreshCw,
  CloudDownload,
  Check,
  AlertCircle,
  Plus
} from "lucide-react";

interface DriveFolder {
  id: string;
  name: string;
}

interface DriveResource {
  id: string;
  name: string;
  type: string;
  embedUrl: string;
  mimeType: string;
}

interface ModuleContent {
  moduleNumber: number;
  folderName: string;
  resources: DriveResource[];
}

interface LevelSubject {
  id: string;
  levelId: string;
  subjectId: string;
  driveFolderId?: string;
}

interface LearningObjective {
  id: string;
  levelSubjectId: string;
  moduleNumber: number;
  title: string;
}

function getResourceIcon(type: string) {
  switch (type) {
    case 'video': return <FileVideo className="h-4 w-4 text-red-500" />;
    case 'audio': return <FileAudio className="h-4 w-4 text-purple-500" />;
    case 'infografia': return <FileImage className="h-4 w-4 text-green-500" />;
    case 'presentacion': return <Presentation className="h-4 w-4 text-orange-500" />;
    default: return <FileText className="h-4 w-4 text-gray-500" />;
  }
}

function getResourceTypeName(type: string) {
  const names: Record<string, string> = {
    'video': 'Video',
    'audio': 'Audio',
    'infografia': 'Infografía',
    'presentacion': 'Presentación'
  };
  return names[type] || type;
}

export default function DriveSync() {
  const { toast } = useToast();
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [selectedLevelSubjectId, setSelectedLevelSubjectId] = useState<string>("");

  const { data: folders, isLoading: foldersLoading, error: foldersError } = useQuery<DriveFolder[]>({
    queryKey: ['/api/admin/drive/folders'],
    retry: 1
  });

  const { data: levelSubjectsList } = useQuery<any[]>({
    queryKey: ['/api/level-subjects']
  });

  const { data: modules, isLoading: modulesLoading, refetch: refetchModules } = useQuery<ModuleContent[]>({
    queryKey: ['/api/admin/drive/folders', selectedFolderId, 'modules'],
    enabled: !!selectedFolderId,
    queryFn: async () => {
      const res = await fetch(`/api/admin/drive/folders/${selectedFolderId}/modules`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch modules');
      return res.json();
    }
  });

  const { data: objectives } = useQuery<LearningObjective[]>({
    queryKey: ['/api/level-subjects', selectedLevelSubjectId, 'objectives'],
    enabled: !!selectedLevelSubjectId,
    queryFn: async () => {
      const res = await fetch(`/api/level-subjects/${selectedLevelSubjectId}/objectives`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch objectives');
      return res.json();
    }
  });

  const syncMutation = useMutation({
    mutationFn: async (data: { folderId: string; learningObjectiveId: string; moduleNumber: number }) => {
      const res = await fetch('/api/admin/drive/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to sync resources');
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sincronización completada",
        description: `${data.resourcesCreated} recursos importados correctamente`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/objectives'] });
    },
    onError: (error) => {
      toast({
        title: "Error de sincronización",
        description: String(error),
        variant: "destructive"
      });
    }
  });

  const createModulesMutation = useMutation({
    mutationFn: async (levelSubjectId: string) => {
      const res = await fetch(`/api/admin/level-subjects/${levelSubjectId}/create-modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create modules');
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Módulos creados",
        description: `Se crearon ${data.count} módulos correctamente`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/level-subjects', selectedLevelSubjectId, 'objectives'] });
    },
    onError: (error) => {
      toast({
        title: "Error al crear módulos",
        description: String(error),
        variant: "destructive"
      });
    }
  });

  const handleCreateModules = () => {
    if (selectedLevelSubjectId) {
      createModulesMutation.mutate(selectedLevelSubjectId);
    }
  };

  const handleSync = (moduleContent: ModuleContent) => {
    const objective = objectives?.find(o => o.moduleNumber === moduleContent.moduleNumber);
    if (!objective) {
      toast({
        title: "Objetivo no encontrado",
        description: `No existe un objetivo para el Módulo ${moduleContent.moduleNumber}. Créalo primero.`,
        variant: "destructive"
      });
      return;
    }

    const moduleFolderId = modules?.find(m => m.moduleNumber === moduleContent.moduleNumber)?.folderName;
    
    syncMutation.mutate({
      folderId: selectedFolderId,
      learningObjectiveId: objective.id,
      moduleNumber: moduleContent.moduleNumber
    });
  };

  if (foldersError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" data-testid="link-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Sincronizar desde Google Drive</h1>
          </div>
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Error de conexión</h3>
              <p className="text-gray-500">
                No se pudo conectar a Google Drive. Verifica que la integración esté configurada correctamente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" data-testid="link-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Sincronizar desde Google Drive</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Carpeta de Drive
              </CardTitle>
              <CardDescription>
                Selecciona la carpeta de la materia en Drive
              </CardDescription>
            </CardHeader>
            <CardContent>
              {foldersLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Cargando carpetas...
                </div>
              ) : (
                <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                  <SelectTrigger data-testid="select-drive-folder">
                    <SelectValue placeholder="Seleccionar carpeta..." />
                  </SelectTrigger>
                  <SelectContent>
                    {folders?.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Materia Destino</CardTitle>
              <CardDescription>
                Selecciona dónde importar los recursos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedLevelSubjectId} onValueChange={setSelectedLevelSubjectId}>
                <SelectTrigger data-testid="select-level-subject">
                  <SelectValue placeholder="Seleccionar nivel y materia..." />
                </SelectTrigger>
                <SelectContent>
                  {levelSubjectsList?.map((ls) => (
                    <SelectItem key={ls.id} value={ls.id}>
                      {ls.level?.name} - {ls.subject?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedLevelSubjectId && objectives?.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-3">
                    No hay módulos creados para esta materia. Debes crearlos antes de sincronizar recursos.
                  </p>
                  <Button 
                    onClick={handleCreateModules}
                    disabled={createModulesMutation.isPending}
                    data-testid="button-create-modules"
                  >
                    {createModulesMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Crear 15 Módulos
                  </Button>
                </div>
              )}

              {selectedLevelSubjectId && objectives && objectives.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {objectives.length} módulos disponibles para sincronizar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedFolderId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Módulos Detectados</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchModules()}
                  data-testid="button-refresh"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </CardTitle>
              <CardDescription>
                Carpetas de módulos encontradas en la carpeta seleccionada
              </CardDescription>
            </CardHeader>
            <CardContent>
              {modulesLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Escaneando carpetas...
                </div>
              ) : modules?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No se encontraron carpetas de módulos.</p>
                  <p className="text-sm">Crea carpetas como "Módulo 1", "Módulo 2", etc.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {modules?.map((module) => (
                    <div 
                      key={module.moduleNumber} 
                      className="border rounded-lg p-4"
                      data-testid={`module-card-${module.moduleNumber}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{module.folderName}</h3>
                          <p className="text-sm text-gray-500">
                            {module.resources.length} recursos detectados
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleSync(module)}
                          disabled={syncMutation.isPending || !selectedLevelSubjectId}
                          data-testid={`button-sync-${module.moduleNumber}`}
                        >
                          {syncMutation.isPending ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CloudDownload className="h-4 w-4 mr-2" />
                          )}
                          Sincronizar
                        </Button>
                      </div>
                      
                      {module.resources.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {module.resources.map((resource) => (
                            <Badge 
                              key={resource.id} 
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {getResourceIcon(resource.type)}
                              <span className="truncate max-w-[150px]" title={resource.name}>
                                {resource.name}
                              </span>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Estructura de Carpetas Requerida</CardTitle>
            <CardDescription>
              Organiza tus archivos en Drive siguiendo esta estructura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
              <div className="space-y-1">
                <p>📁 Instituto Barkley/</p>
                <p className="pl-4">📁 7° Básico - Matemática/</p>
                <p className="pl-8">📁 Módulo 1/</p>
                <p className="pl-12">📹 Video explicativo.mp4</p>
                <p className="pl-12">🖼️ Infografía.pdf</p>
                <p className="pl-12">🎧 Audio resumen.mp3</p>
                <p className="pl-12">📊 Presentación.pptx</p>
                <p className="pl-12">📝 Flashcards.pdf</p>
                <p className="pl-12">📋 Cuestionario (Google Forms link)</p>
                <p className="pl-8">📁 Módulo 2/</p>
                <p className="pl-12">...</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Los archivos se clasifican automáticamente según su tipo (video, audio, imagen, presentación, documento).
              Los nombres de las carpetas deben contener "Módulo" seguido del número.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
