import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AgentTask } from '../../types';

interface AgentState {
  availableTasks: AgentTask[];
  activeTasks: AgentTask[];
  completedTasks: AgentTask[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AgentState = {
  availableTasks: [],
  activeTasks: [],
  completedTasks: [],
  isLoading: false,
  error: null,
};

// Sample task templates
const taskTemplates = [
  {
    type: 'STREAM' as const,
    name: 'Live Stream',
    description: 'Your idol streams gameplay or chat with fans',
    duration: 60,
    energy: 20,
    cooldown: 120,
    reward: 10,
  },
  {
    type: 'CONCERT' as const,
    name: 'Virtual Concert',
    description: 'Your idol performs on a virtual stage',
    duration: 30,
    energy: 50,
    cooldown: 240,
    reward: 30,
  },
  {
    type: 'COMPETITION' as const,
    name: 'Arena Battle',
    description: 'Your idol competes in a mech battle',
    duration: 45,
    energy: 40,
    cooldown: 180,
    reward: 25,
  },
  {
    type: 'SOCIAL' as const,
    name: 'Fan Engagement',
    description: 'Your idol interacts with fans on social platforms',
    duration: 30,
    energy: 15,
    cooldown: 60,
    reward: 5,
  },
];

// Generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Async thunks
export const fetchAvailableTasks = createAsyncThunk('agent/fetchTasks', async () => {
  // Simulating API call to fetch tasks
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Generate random tasks from templates
  const availableTasks: AgentTask[] = taskTemplates.map((template) => ({
    ...template,
    id: generateId(),
    status: 'AVAILABLE' as const,
  }));
  
  return availableTasks;
});

export const startTask = createAsyncThunk(
  'agent/startTask',
  async (taskId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { agent: AgentState };
      const task = state.agent.availableTasks.find((t) => t.id === taskId);
      
      if (!task) {
        return rejectWithValue('Task not found');
      }
      
      // Simulate starting the task
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      return {
        ...task,
        status: 'IN_PROGRESS' as const,
      };
    } catch (error) {
      return rejectWithValue('Failed to start task: ' + (error as Error).message);
    }
  }
);

export const completeTask = createAsyncThunk(
  'agent/completeTask',
  async (taskId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { agent: AgentState };
      const task = state.agent.activeTasks.find((t) => t.id === taskId);
      
      if (!task) {
        return rejectWithValue('Task not found');
      }
      
      // Simulate completing the task
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      return {
        ...task,
        status: 'COMPLETED' as const,
      };
    } catch (error) {
      return rejectWithValue('Failed to complete task: ' + (error as Error).message);
    }
  }
);

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    resetTasks: (state) => {
      state.availableTasks = [];
      state.activeTasks = [];
      state.completedTasks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchAvailableTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAvailableTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableTasks = action.payload;
      })
      .addCase(fetchAvailableTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Start task
      .addCase(startTask.fulfilled, (state, action) => {
        state.availableTasks = state.availableTasks.filter(
          (task) => task.id !== action.payload.id
        );
        state.activeTasks.push(action.payload);
      })
      .addCase(startTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Complete task
      .addCase(completeTask.fulfilled, (state, action) => {
        state.activeTasks = state.activeTasks.filter(
          (task) => task.id !== action.payload.id
        );
        state.completedTasks.push(action.payload);
        
        // Generate a new task to replace the completed one
        const template = taskTemplates.find((t) => t.type === action.payload.type);
        if (template) {
          state.availableTasks.push({
            ...template,
            id: generateId(),
            status: 'AVAILABLE' as const,
          });
        }
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetTasks } = agentSlice.actions;

export default agentSlice.reducer; 