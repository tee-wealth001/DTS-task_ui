export interface Task {
    id?: number;
    title: string;
    description?: string;
    status: 'todo' | 'in progress' | 'completed';
    due_at?: Date;
    case_id: number,
    assigned_to: string,
    priority: string,
}