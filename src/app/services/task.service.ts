import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../model/task.model';
import { API_BASE_URL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  base = API_BASE_URL;
  constructor(private http: HttpClient) { }


  getAll(): Observable<Task[]> { return this.http.get<Task[]>(`${this.base}/tasks`); }
  get(id: number) { return this.http.get<Task>(`${this.base}/tasks/${id}`); }
  create(task: Task) { return this.http.post<Task>(`${this.base}/tasks`, task); }
  update(id: number, task: Task) { return this.http.put<Task>(`${this.base}/tasks/${id}`, task); }
  delete(id: number) { return this.http.delete(`${this.base}/tasks/${id}`); }

}
