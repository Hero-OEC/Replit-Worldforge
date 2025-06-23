import Header from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Characters() {
  return (
    <>
      <Header
        title="Characters"
        subtitle="Manage character profiles, personalities, and relationships"
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Character Management</h3>
          <p className="text-gray-500 mb-6">Create detailed character profiles with appearance, personality, and backstory.</p>
          <Card className="max-w-md mx-auto p-6 bg-white border border-gray-200">
            <p className="text-sm text-gray-600">
              Character management functionality will be implemented here. This will include 
              character creation forms, profile cards, relationship mapping, and detailed 
              character development tools.
            </p>
          </Card>
        </div>
      </main>
    </>
  );
}
