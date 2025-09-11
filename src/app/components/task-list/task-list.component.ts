import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../model/task.model';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { Paginator, PaginatorModule, PaginatorState } from 'primeng/paginator';
import { PriorityEnum, StatusEnum } from '../../enums/enums';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, BadgeModule, DialogModule, PaginatorModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];

  private subscriptions: any[] = [];

  displayModal = false;

  selectedTask: Task | null = null;

  first1: number = 0;

  rows1: number = 10;

  constructor(private taskService: TaskService, private router: Router) { }

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

  // write edit function to save to local storage
  edit(task: Task) {
    localStorage.setItem('selectedTask', JSON.stringify({ id: task.id, action: 'edit' }));
    this.router.navigate(['/form']);
  }

  view(task: Task) {
    this.displayModal = true;
    localStorage.setItem('selectedTask', JSON.stringify({ id: task.id, action: 'view' }));
    this.router.navigate(['/form']);
    this.selectedTask = task
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

  taskSeverity(task: Task) {
    if (task.priority === PriorityEnum.High) return 'danger';
    else if (task.priority === PriorityEnum.Low) return 'info';
    else return 'warn';
  }

  taskStatus(task: Task) {
    if (task.status === StatusEnum.Todo) return 'info';
    else if (task.status === StatusEnum.In_progress) return 'warn';
    else return 'success';
  }

  addTask() {
    console.log('Add Task button clicked');
    this.router.navigate(['/form']);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'todo': 'To Do',
      'in_progress': 'In Progress',
      'completed': 'Completed'
    };
    return labels[status] || status;
  }

  onPageChange1(event: PaginatorState) {
    this.first1 = event.first ?? 0;
    this.rows1 = event.rows ?? 10;
  }
}