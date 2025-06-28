import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MapPin, Clock, Sparkles, BookOpen, Plus, X, ArrowRight } from "lucide-react";

interface EntityConnection {
  id: string;
  sourceType: string;
  sourceName: string;
  targetType: string;
  targetName: string;
  connectionType: string;
  description?: string;
}

interface EntityConnectionsProps {
  entityType: string;
  entityId: number;
  entityName: string;
  connections?: EntityConnection[];
  availableEntities?: {
    characters?: Array<{ id: number; name: string }>;
    locations?: Array<{ id: number; name: string }>;
    timelineEvents?: Array<{ id: number; title: string }>;
    magicSystems?: Array<{ id: number; name: string }>;
    loreEntries?: Array<{ id: number; title: string }>;
  };
  onAddConnection?: (connection: Omit<EntityConnection, 'id'>) => void;
  onRemoveConnection?: (connectionId: string) => void;
}

export default function EntityConnections({
  entityType,
  entityId,
  entityName,
  connections = [],
  availableEntities = {},
  onAddConnection,
  onRemoveConnection
}: EntityConnectionsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConnection, setNewConnection] = useState({
    targetType: '',
    targetId: '',
    connectionType: '',
    description: ''
  });

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'character': return Users;
      case 'location': return MapPin;
      case 'timeline': return Clock;
      case 'magic': return Sparkles;
      case 'lore': return BookOpen;
      default: return BookOpen;
    }
  };

  const getConnectionTypes = (sourceType: string, targetType: string) => {
    if (sourceType === 'character' && targetType === 'character') {
      return ['friend', 'enemy', 'ally', 'rival', 'family', 'mentor', 'student', 'romantic'];
    }
    if (sourceType === 'character' && targetType === 'location') {
      return ['lives_in', 'from', 'visits', 'owns', 'works_at'];
    }
    if (sourceType === 'character' && targetType === 'magic') {
      return ['uses', 'studies', 'masters', 'created', 'opposes'];
    }
    if (sourceType === 'character' && targetType === 'timeline') {
      return ['participates', 'witnesses', 'causes', 'affected_by'];
    }
    if (sourceType === 'location' && targetType === 'location') {
      return ['contains', 'adjacent_to', 'connected_to', 'part_of'];
    }
    if (sourceType === 'timeline' && targetType === 'location') {
      return ['occurs_at', 'affects', 'originates_from'];
    }
    return ['related_to', 'references', 'mentions'];
  };

  const handleAddConnection = () => {
    if (newConnection.targetType && newConnection.targetId && newConnection.connectionType) {
      const targetEntities = availableEntities[newConnection.targetType as keyof typeof availableEntities] || [];
      const targetEntity = targetEntities.find(e => e.id.toString() === newConnection.targetId);
      
      if (targetEntity && onAddConnection) {
        onAddConnection({
          sourceType: entityType,
          sourceName: entityName,
          targetType: newConnection.targetType,
          targetName: 'name' in targetEntity ? targetEntity.name : (targetEntity as any).title,
          connectionType: newConnection.connectionType,
          description: newConnection.description
        });
      }
      
      setNewConnection({ targetType: '', targetId: '', connectionType: '', description: '' });
      setShowAddForm(false);
    }
  };

  const groupedConnections = connections.reduce((acc, conn) => {
    if (!acc[conn.targetType]) acc[conn.targetType] = [];
    acc[conn.targetType].push(conn);
    return acc;
  }, {} as Record<string, EntityConnection[]>);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Entity Connections</h3>
        <Button
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Connection
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-4 mb-4 bg-[var(--color-100)]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Entity Type</label>
                <Select value={newConnection.targetType} onValueChange={(value) => 
                  setNewConnection({ ...newConnection, targetType: value, targetId: '', connectionType: '' })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="character">Character</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="timeline">Timeline Event</SelectItem>
                    <SelectItem value="magic">Magic System</SelectItem>
                    <SelectItem value="lore">Lore Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newConnection.targetType && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Entity</label>
                  <Select value={newConnection.targetId} onValueChange={(value) => 
                    setNewConnection({ ...newConnection, targetId: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {(availableEntities[newConnection.targetType as keyof typeof availableEntities] || []).map((entity) => (
                        <SelectItem key={entity.id} value={entity.id.toString()}>
                          {'name' in entity ? entity.name : (entity as any).title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {newConnection.targetType && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Connection Type</label>
                <Select value={newConnection.connectionType} onValueChange={(value) => 
                  setNewConnection({ ...newConnection, connectionType: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {getConnectionTypes(entityType, newConnection.targetType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex space-x-2">
              <Button size="sm" onClick={handleAddConnection} className="bg-green-600 hover:bg-green-700 text-white">
                Add Connection
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {connections.length === 0 ? (
        <div className="text-center py-8 text-[var(--color-600)]">
          <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center mx-auto mb-3">
            <ArrowRight className="w-6 h-6 text-[var(--color-600)]" />
          </div>
          <p>No connections yet</p>
          <p className="text-sm">Add connections to link this {entityType} with other entities</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedConnections).map(([targetType, conns]) => {
            const Icon = getEntityIcon(targetType);
            return (
              <div key={targetType}>
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <h4 className="font-medium text-gray-900 capitalize">{targetType}s</h4>
                </div>
                <div className="space-y-2 ml-6">
                  {conns.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-3 bg-[var(--color-100)] rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{connection.targetName}</span>
                          <ArrowRight className="w-3 h-3 text-[var(--color-600)]" />
                          <Badge variant="outline" className="text-xs">
                            {connection.connectionType.replace('_', ' ')}
                          </Badge>
                        </div>
                        {connection.description && (
                          <p className="text-sm text-gray-600 mt-1">{connection.description}</p>
                        )}
                      </div>
                      {onRemoveConnection && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveConnection(connection.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}