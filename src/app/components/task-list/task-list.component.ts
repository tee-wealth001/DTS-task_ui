import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../model/task.model';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Paginator, PaginatorModule, PaginatorState } from 'primeng/paginator';
import { PriorityEnum, StatusEnum } from '../../enums/enums';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, BadgeModule, DialogModule, PaginatorModule, SelectModule],
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

  status = [
    { label: 'To Do', value: StatusEnum.Todo },
    { label: 'In Progress', value: StatusEnum.In_progress },
    { label: 'Completed', value: StatusEnum.Completed }
  ];

  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService, private router: Router, private messageService: MessageService) { }

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
      'in progress': 'In Progress',
      'completed': 'Completed'
    };
    return labels[status] || status;
  }

  onPageChange1(event: PaginatorState) {
    this.first1 = event.first ?? 0;
    this.rows1 = event.rows ?? 10;
  }

  toggleStatus(task: Task) {
    if (task.status === StatusEnum.Todo) {
      task.status = StatusEnum.In_progress;
    } else if (task.status === StatusEnum.In_progress) {
      task.status = StatusEnum.Completed;
    } else {
      task.status = StatusEnum.Todo;
    }
  }

  visible: boolean = false;
  selectedTaskStatus: string = ''
  selectedTaskId: number | undefined
  task: Task | null = null;


  showDialog(task: Task) {
    this.visible = true;
    this.selectedTaskStatus = task.status
    this.selectedTaskId = task.id
    this.task = task;
  }

  onPatchStatus() {
    if (this.selectedTaskStatus !== this.task?.status) {

      const patchData = {
        status: this.selectedTaskStatus,
        // add other fields here if needed
      };
      console.log(this.selectedTaskStatus, this.task?.status)

      this.taskService.updateStatus(this.selectedTaskId, patchData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Task status updated successfully',
              life: 3000
            });
            this.load()
            this.visible = false;
          },
          error: (error) => {
            console.error('Error updating task status:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.detail || 'Failed to update task status'
            });
          }
        });
    }
  }

}