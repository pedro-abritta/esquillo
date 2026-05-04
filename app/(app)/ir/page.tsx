"use client";

import { Header } from "@/components/shared/Header";
import { DocumentCard } from "@/components/feature/DocumentCard";
import { DocumentUploadDialog } from "@/components/feature/DocumentUploadDialog";
import { Mascot } from "@/components/shared/Mascot";
import { IR_CATEGORIES } from "@/lib/constants";
import { Plus, Download, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { getDocuments } from "@/lib/db/documents";
import type { Document } from "@/lib/types";

export default function IR() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(Object.keys(IR_CATEGORIES)[0]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    getDocuments()
      .then(setDocuments)
      .catch(() => setError("Erro ao carregar documentos."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const documentsByCategory = Object.entries(IR_CATEGORIES).reduce(
    (acc, [key]) => {
      acc[key] = documents.filter((doc) => doc.category === key);
      return acc;
    },
    {} as Record<string, Document[]>
  );

  const totalDocuments = documents.length;
  const organizedCount = documents.filter((doc) => doc.status === "ORGANIZED").length;

  return (
    <div className="flex flex-col h-full">
      <Header title="Imposto de Renda" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Total de documentos</p>
              <h3 className="text-2xl font-600 text-gray-900">{totalDocuments}</h3>
            </div>
            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Organizados</p>
              <h3 className="text-2xl font-600 text-gray-900">{organizedCount}</h3>
            </div>
            <div className="p-6 bg-white border-thin border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Andamento</p>
              <h3 className="text-2xl font-600 text-gray-900">
                {totalDocuments > 0 ? `${((organizedCount / totalDocuments) * 100).toFixed(0)}%` : "—"}
              </h3>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-500"
            >
              <Plus size={16} />
              Upload de documento
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-md hover:bg-success/90 transition-colors text-sm font-500">
              <Download size={16} />
              Exportar ZIP
            </button>
          </div>

          {/* Categories */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-sm text-danger text-center py-8">{error}</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(IR_CATEGORIES).map(([key, label]) => {
                const categoryDocs = documentsByCategory[key];
                const isExpanded = expandedCategory === key;

                return (
                  <div key={key} className="bg-white border-thin border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : key)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ChevronDown size={16} className={cn("text-gray-600 transition-transform", isExpanded && "transform rotate-180")} />
                        <div className="text-left">
                          <h3 className="font-600 text-gray-900">{label}</h3>
                          <p className="text-xs text-gray-500">
                            {categoryDocs.length} documento{categoryDocs.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-500 text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {categoryDocs.filter(d => d.status === "ORGANIZED").length}/{categoryDocs.length}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        {categoryDocs.length > 0 ? (
                          <div className="grid grid-cols-3 gap-4">
                            {categoryDocs.map((doc) => (
                              <DocumentCard
                                key={doc.id}
                                document={doc}
                                onDelete={refresh}
                                onStatusChange={refresh}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 space-y-4">
                            <Mascot size="sm" />
                            <p className="text-sm text-gray-500">Nenhum documento nesta categoria</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DocumentUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={refresh}
      />
    </div>
  );
}
