import Header from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function Locations() {
  return (
    <>
      <Header
        title="Locations"
        subtitle="Document places, geography, and world settings"
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Location Database</h3>
          <p className="text-gray-500 mb-6">Create and organize locations with detailed descriptions and cultural information.</p>
          <Card className="max-w-md mx-auto p-6 bg-white border border-gray-200">
            <p className="text-sm text-gray-600">
              Location management functionality will be implemented here. This will include 
              location creation forms, maps integration, geographical details, cultural 
              information, and location relationship mapping.
            </p>
          </Card>
        </div>
      </main>
    </>
  );
}
