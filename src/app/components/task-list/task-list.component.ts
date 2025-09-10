import { Component, OnInit } from '@angular/core';
import { Task } from '../../model/task.model';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  constructor(private taskService: TaskService) { }
  private subscriptions: any[] = [];

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  load() {
    const sub = this.taskService.getAll().subscribe(t => this.tasks = t);
    this.subscriptions.push(sub);
  }

  delete(id?: number) {
    if (!id) return;
    const sub = this.taskService.delete(id).subscribe(() => this.load());
    this.subscriptions.push(sub);
  }

  setStatus(id?: number, status?: string) {
    if (!id || !status) return;
    const sub = this.taskService.updateStatus(id, status).subscribe(() => this.load());
    this.subscriptions.push(sub);
  }
}