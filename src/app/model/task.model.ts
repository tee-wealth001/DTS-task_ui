export interface Task {
    id?: number;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    due_at?: string;
    case_id: number,
    assigned_to: string,
    priority: string,
}