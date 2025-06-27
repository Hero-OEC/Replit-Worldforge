import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Scroll, Edit3, MoreHorizontal, Trash2, Save, X, FileText, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Navbar from "@/components/layout/navbar";
import type { ProjectWithStats } from "@shared/schema";

// Category configuration for consistent styling
const categoryConfig = {
  "Plot": {
    icon: BookOpen,
    color: "bg-blue-500",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-200"
  },
  "Characters": {
    icon: Users,
    color: "bg-green-500",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-200"
  },
  "World Building": {
    icon: Search,
    color: "bg-purple-500",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    borderColor: "border-purple-200"
  },
  "Research": {
    icon: Scroll,
    color: "bg-yellow-500",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-200"
  }
};

export default function Notes() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [noteData, setNoteData] = useState({
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

  const sampleNotes = [
    {
      id: 1,
      title: "Plot Outline - Act 1",
      content: "Elena discovers her powers during the entrance exam at the Academy. She accidentally sets fire to the testing chamber but instead of being expelled, she's taken under Theron's wing. Key scenes: arrival at academy, meeting Marcus, first magic lesson gone wrong.",
      category: "Plot",
      tags: ["plot", "act1", "elena", "academy"],
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Character Development - Elena's Arc",
      content: "Elena starts as insecure about her abilities. Through trials and failures, she learns to control her fire magic and gains confidence. Her character arc mirrors the classic hero's journey but with focus on self-acceptance rather than defeating evil.",
      category: "Characters",
      tags: ["elena", "character-arc", "development", "fire-magic"],
      createdAt: "2024-01-12"
    },
    {
      id: 3,
      title: "Magic System Rules",
      content: "Fire magic requires emotional control. The more intense the emotion, the stronger the flame, but also the more dangerous. Users must learn meditation and breathing techniques. Overuse leads to 'burnout' - temporary loss of magical ability.",
      category: "World Building",
      tags: ["magic-system", "fire-magic", "rules", "limitations"],
      createdAt: "2024-01-10"
    },
    {
      id: 4,
      title: "Research: Medieval Academy Life",
      content: "Notes from research on medieval university structures. Students lived in dormitories, followed strict schedules, and studied by candlelight. Will adapt this for magical academy with crystal lights and floating books.",
      category: "Research",
      tags: ["research", "medieval", "academy", "historical"],
      createdAt: "2024-01-08"
    }
  ];

  const resetForm = () => {
    setNoteData({
      title: "",
      content: "",
      category: "",
      tags: ""
    });
  };

  const handleEdit = (note: any) => {
    setEditingNote(note);
    setNoteData({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags.join(", ")
    });
  };

  const handleSubmit = () => {
    console.log("Note data:", noteData);
    setEditingNote(null);
    setShowAddDialog(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      console.log("Delete note:", id);
    }
  };

  const filteredNotes = sampleNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNoteClick = (noteId: number) => {
    setLocation(`/project/${projectId}/notes/${noteId}`);
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
      />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-orange-600 cursor-pointer group">
                  <Scroll className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
                  <p className="text-gray-600">Capture your ideas and research</p>
                </div>
              </div>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => {
              const categoryInfo = categoryConfig[note.category as keyof typeof categoryConfig] || categoryConfig["Plot"];
              const CategoryIcon = categoryInfo.icon;
              
              return (
                <Card 
                  key={note.id} 
                  className="p-6 hover:shadow-md transition-shadow border border-gray-200 cursor-pointer hover:border-orange-300" 
                  style={{ backgroundColor: '#f8f6f2' }}
                  onClick={() => handleNoteClick(note.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-10 h-10 ${categoryInfo.color} rounded-lg flex items-center justify-center`}>
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{note.title}</h3>
                        <Badge className={`${categoryInfo.bgColor} ${categoryInfo.textColor} border-0`}>
                          {note.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(note); }}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-4">{note.content}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 text-xs font-normal rounded-md bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-gray-400">
                    {note.createdAt}
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <Scroll className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600">Create your first note to get started.</p>
            </div>
          )}
        </div>
      </main>

      <Dialog open={showAddDialog || !!editingNote} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setEditingNote(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? "Edit Note" : "Add New Note"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <Input
                  value={noteData.title}
                  onChange={(e) => setNoteData({...noteData, title: e.target.value})}
                  placeholder="Note title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Input
                  value={noteData.category}
                  onChange={(e) => setNoteData({...noteData, category: e.target.value})}
                  placeholder="e.g., Plot, Characters, Research"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={noteData.content}
                onChange={(e) => setNoteData({...noteData, content: e.target.value})}
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md resize-none"
                placeholder="Write your note content..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <Input
                value={noteData.tags}
                onChange={(e) => setNoteData({...noteData, tags: e.target.value})}
                placeholder="Separate tags with commas: plot, character, idea"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingNote(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-orange-500 text-white hover:bg-orange-600">
                <Save className="w-4 h-4 mr-2" />
                {editingNote ? "Update" : "Create"} Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}