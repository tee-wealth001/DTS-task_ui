import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  base = 'http://localhost:8000';
  constructor(private http: HttpClient) { }


  getAll(): Observable<Task[]> { return this.http.get<Task[]>(`${this.base}/tasks`); }
  get(id: number) { return this.http.get<Task>(`${this.base}/tasks/${id}`); }
  create(task: TaskService) { return this.http.post<Task>(`${this.base}/tasks`, task); }
  update(id: number, task: Partial<TaskService>) { return this.http.put<Task>(`${this.base}/tasks/${id}`, task); }
  updateStatus(id: number, status: string) { return this.http.patch<Task>(`${this.base}/tasks/${id}/status`, { status }); }
  delete(id: number) { return this.http.delete(`${this.base}/tasks/${id}`); }

}
