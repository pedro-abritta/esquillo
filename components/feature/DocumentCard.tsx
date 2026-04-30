import { Document } from "@/lib/types";
import { formatShortDate, cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface DocumentCardProps {
  document: Document;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const statusColors: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  ORGANIZED: "bg-success/10 text-success",
  USED: "bg-info/10 text-info",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  ORGANIZED: "Organizado",
  USED: "Utilizado",
};

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="p-4 bg-white border-thin border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <FileText size={24} className="text-primary opacity-60" />
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-600 text-gray-900 line-clamp-2">
            {document.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {formatShortDate(document.uploadedAt)} • {formatFileSize(document.size)}
          </p>

          <div className="mt-3 flex justify-between items-center">
            <span
              className={cn(
                "text-xs font-500 px-2 py-1 rounded-full",
                statusColors[document.status] || "bg-gray-100 text-gray-600"
              )}
            >
              {statusLabels[document.status] || document.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
