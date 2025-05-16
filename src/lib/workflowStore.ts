
'use client';

import type { Workflow, Node, Connection } from './types';
import { v4 as uuidv4 } from 'uuid';

const WORKFLOWS_STORAGE_KEY = 'nativeui-ai-workflows';
const ACTIVE_WORKFLOW_ID_KEY = 'nativeui-ai-active-workflow-id';

const getLocalStorage = (): Storage | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

export const getAllWorkflows = (): Workflow[] => {
  const storage = getLocalStorage();
  if (!storage) return [];
  const rawWorkflows = storage.getItem(WORKFLOWS_STORAGE_KEY);
  if (!rawWorkflows) return [];
  try {
    return JSON.parse(rawWorkflows) as Workflow[];
  } catch (error) {
    console.error('Error parsing workflows from localStorage:', error);
    return [];
  }
};

export const getWorkflowById = (id: string): Workflow | null => {
  const workflows = getAllWorkflows();
  return workflows.find(wf => wf.id === id) || null;
};

export const saveWorkflow = (workflow: Workflow): Workflow | null => {
  const storage = getLocalStorage();
  if (!storage) return null;

  const workflows = getAllWorkflows();
  const index = workflows.findIndex(wf => wf.id === workflow.id);
  const now = new Date().toISOString();
  
  const workflowToSave: Workflow = {
    ...workflow,
    updatedAt: now,
  };

  if (index > -1) {
    workflows[index] = workflowToSave;
  } else {
    workflowToSave.createdAt = workflowToSave.createdAt || now; // Set createdAt if new
    workflows.push(workflowToSave);
  }

  try {
    storage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(workflows));
    return workflowToSave;
  } catch (error) {
    console.error('Error saving workflow to localStorage:', error);
    return null;
  }
};

export const createNewWorkflow = (name: string, nodes: Node[] = [], connections: Connection[] = [], zoomLevel: number = 1): Workflow | null => {
  const now = new Date().toISOString();
  const newWorkflow: Workflow = {
    id: uuidv4(),
    name,
    nodes,
    connections,
    zoomLevel,
    createdAt: now,
    updatedAt: now,
  };
  return saveWorkflow(newWorkflow);
};

export const deleteWorkflow = (id: string): boolean => {
  const storage = getLocalStorage();
  if (!storage) return false;
  const workflows = getAllWorkflows();
  const updatedWorkflows = workflows.filter(wf => wf.id !== id);
  try {
    storage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(updatedWorkflows));
    if (getActiveWorkflowId() === id) {
      setActiveWorkflowId(null); // Clear active if deleted
    }
    return true;
  } catch (error) {
    console.error('Error deleting workflow from localStorage:', error);
    return false;
  }
};

export const getActiveWorkflowId = (): string | null => {
  const storage = getLocalStorage();
  if (!storage) return null;
  return storage.getItem(ACTIVE_WORKFLOW_ID_KEY);
};

export const setActiveWorkflowId = (id: string | null): void => {
  const storage = getLocalStorage();
  if (!storage) return;
  if (id) {
    storage.setItem(ACTIVE_WORKFLOW_ID_KEY, id);
  } else {
    storage.removeItem(ACTIVE_WORKFLOW_ID_KEY);
  }
};
