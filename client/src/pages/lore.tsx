import Header from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Scroll } from "lucide-react";

export default function Lore() {
  return (
    <>
      <Header
        title="Lore & History"
        subtitle="Document world history, cultures, and background stories"
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="text-center py-12">
          <Scroll className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">World Lore</h3>
          <p className="text-gray-500 mb-6">Create comprehensive world history, cultural details, and background lore.</p>
          <Card className="max-w-md mx-auto p-6 bg-white border border-gray-200">
            <p className="text-sm text-gray-600">
              Lore management functionality will be implemented here. This will include 
              historical timeline creation, cultural documentation, religion and politics, 
              world events, and searchable lore entries with tagging system.
            </p>
          </Card>
        </div>
      </main>
    </>
  );
}
