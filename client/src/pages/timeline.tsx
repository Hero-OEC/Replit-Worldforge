import Header from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function Timeline() {
  return (
    <>
      <Header
        title="Timeline"
        subtitle="Organize story events and plot progression"
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline Builder</h3>
          <p className="text-gray-500 mb-6">Create and organize story events in chronological order.</p>
          <Card className="max-w-md mx-auto p-6 bg-white border border-gray-200">
            <p className="text-sm text-gray-600">
              Timeline functionality will be implemented here. This will include drag-and-drop 
              event management, story arc visualization, and chronological organization tools.
            </p>
          </Card>
        </div>
      </main>
    </>
  );
}
