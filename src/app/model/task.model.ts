export interface Task {
    id?: number;
    title: string;
    description?: string;
    status: 'todo' | 'in progress' | 'completed';
    due_at?: string;
    case_id: number,
    assigned_to: string,
    priority: string,
}