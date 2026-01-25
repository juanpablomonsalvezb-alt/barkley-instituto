import { BookOpen, ExternalLink, Download } from "lucide-react";

interface TextbookViewerProps {
  pdfUrl: string;
  title?: string;
  startPage: number;
  endPage: number;
  moduleNumber: number;
}

export function TextbookViewer({ pdfUrl, title, startPage, endPage, moduleNumber }: TextbookViewerProps) {
  const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}&startPage=${startPage}&endPage=${endPage}`;
  const totalPages = endPage - startPage + 1;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12">
      <div className="max-w-xl w-full space-y-8 text-center">
        <div className="w-24 h-24 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
          <BookOpen className="w-12 h-12 text-white" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-3xl font-bold text-white">{title || "Texto Escolar"}</h3>
          <div className="flex items-center justify-center gap-4">
            <span className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg text-sm font-medium">
              Módulo {moduleNumber}
            </span>
            <span className="px-4 py-2 bg-emerald-600/20 text-emerald-300 rounded-lg text-sm font-medium">
              {totalPages} páginas
            </span>
          </div>
          <p className="text-slate-300 text-lg">
            Páginas {startPage} - {endPage}
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4">
          <p className="text-slate-400 text-sm">
            ✓ Solo las páginas de este módulo<br/>
            ✓ PDF optimizado y listo para estudiar<br/>
            ✓ Extraído del texto completo
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={proxyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <ExternalLink className="w-5 h-5" />
            Abrir PDF del Módulo
          </a>
          
          <a
            href={proxyUrl}
            download={`Modulo_${moduleNumber}_Paginas_${startPage}-${endPage}.pdf`}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Descargar PDF ({totalPages} páginas)
          </a>
        </div>

        <p className="text-xs text-slate-500">
          Instituto Barkley • {title || "Texto Escolar"}
        </p>
      </div>
    </div>
  );
}
