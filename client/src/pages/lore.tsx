import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Sparkles, Edit3, MoreHorizontal, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Navbar from "@/components/layout/navbar";
import type { ProjectWithStats } from "@shared/schema";

export default function Lore() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [entryData, setEntryData] = useState({
    title: "",
    content: "",
    category: "",
    tags: ""
  });

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  const sampleLoreEntries = [
    {
      id: 1,
      title: "The Ancient War of Shadows",
      content: "A thousand years ago, the realm was plunged into darkness when the Shadow Lords attempted to overthrow the Circle of Light. This war lasted for three centuries and reshaped the magical landscape of the world.",
      category: "History",
      tags: ["war", "ancient", "magic", "shadow lords"]
    },
    {
      id: 2,
      title: "The Crystal of Eternal Flame",
      content: "A legendary artifact said to contain the first flame ever created by the gods. It is said that whoever possesses it can command fire magic beyond mortal comprehension.",
      category: "Artifacts",
      tags: ["artifact", "fire", "crystal", "legendary"]
    },
    {
      id: 3,
      title: "The Prophecy of the Chosen One",
      content: "Ancient texts speak of one who will rise when the realm faces its darkest hour. Born under the eclipse, marked by flame, they will either save the world or destroy it.",
      category: "Prophecies",
      tags: ["prophecy", "chosen one", "eclipse", "flame"]
    },
    {
      id: 4,
      title: "The Academy's Founding",
      content: "The Academy of Mystic Arts was founded by Archmage Theron after the Shadow War to ensure that magical knowledge would never again be hoarded by the few.",
      category: "Institutions",
      tags: ["academy", "founding", "education", "theron"]
    }
  ];

  const resetForm = () => {
    setEntryData({
      title: "",
      content: "",
      category: "",
      tags: ""
    });
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setEntryData({
      title: entry.title,
      content: entry.content,
      category: entry.category,
      tags: entry.tags.join(", ")
    });
  };

  const handleSubmit = () => {
    console.log("Lore entry data:", entryData);
    setEditingEntry(null);
    setShowAddDialog(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this lore entry?")) {
      console.log("Delete lore entry:", id);
    }
  };

  const filteredEntries = sampleLoreEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      'History': 'bg-blue-100 text-blue-800',
      'Artifacts': 'bg-purple-100 text-purple-800',
      'Prophecies': 'bg-yellow-100 text-yellow-800',
      'Institutions': 'bg-green-100 text-green-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        rightContent={
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lore Entry
          </Button>
        }
      />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-orange-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Lore</h1>
                <p className="text-gray-600">Manage your world's history and knowledge</p>
              </div>
            </div>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="p-6 hover:shadow-md transition-shadow bg-white border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                      <Badge className={getCategoryColor(entry.category)}>
                        {entry.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(entry)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{entry.content}</p>

                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lore entries found</h3>
              <p className="text-gray-600">Create your first lore entry to get started.</p>
            </div>
          )}
        </div>
      </main>

      <Dialog open={showAddDialog || !!editingEntry} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setEditingEntry(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? "Edit Lore Entry" : "Add New Lore Entry"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <Input
                  value={entryData.title}
                  onChange={(e) => setEntryData({...entryData, title: e.target.value})}
                  placeholder="Lore entry title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Input
                  value={entryData.category}
                  onChange={(e) => setEntryData({...entryData, category: e.target.value})}
                  placeholder="e.g., History, Artifacts, Prophecies"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={entryData.content}
                onChange={(e) => setEntryData({...entryData, content: e.target.value})}
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md resize-none"
                placeholder="Write your lore entry content..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <Input
                value={entryData.tags}
                onChange={(e) => setEntryData({...entryData, tags: e.target.value})}
                placeholder="Separate tags with commas: magic, ancient, prophecy"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingEntry(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-orange-500 text-white hover:bg-orange-600">
                <Save className="w-4 h-4 mr-2" />
                {editingEntry ? "Update" : "Create"} Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}