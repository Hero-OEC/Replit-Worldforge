import Header from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function MagicSystems() {
  return (
    <>
      <Header
        title="Magic Systems"
        subtitle="Define magical rules, limitations, and power structures"
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="text-center py-12">
          <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Magic & Power Systems</h3>
          <p className="text-gray-500 mb-6">Document magical rules, power sources, limitations, and costs.</p>
          <Card className="max-w-md mx-auto p-6 bg-white border border-gray-200">
            <p className="text-sm text-gray-600">
              Magic system documentation will be implemented here. This will include 
              system creation forms, rule definitions, power scaling, limitations, 
              magical sources, and cost structures.
            </p>
          </Card>
        </div>
      </main>
    </>
  );
}
