import { Component, OnDestroy, OnInit } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { Task } from '../../model/task.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FluidModule, CommonModule, FormsModule, SelectModule, InputTextModule, DatePickerModule, ButtonModule, InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit, OnDestroy {

  constructor(private taskService: TaskService, private router: Router, private messageService: MessageService) { }

  private destroy$ = new Subject<void>();

  task: Task = {
    title: '',
    description: '',
    status: 'todo',
    due_at: new Date(),
    case_id: 0,
    assigned_to: '',
    priority: ''
  };

  status = [
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in progress' },
    { label: 'Completed', value: 'completed' }
  ];

  priority = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
  ];

  assignedUsers = [
    { label: 'Alice', value: 'Alice' },
    { label: 'Bob', value: 'Bob' },
    { label: 'Charlie', value: 'Charlie' }
  ];

  savedTaskId: string | null = null;
  savedAction: string | null = null;

  ngOnInit() {
    this.getSelectedTask();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSelectedTask() {
    const selectedTask = localStorage.getItem('selectedTask');
    if (selectedTask) {
      try {
        const parsed = JSON.parse(selectedTask);
        this.savedTaskId = parsed?.id ? String(parsed.id) : null;
        this.savedAction = parsed?.action ? String(parsed.action) : null;
      } catch {
        this.savedTaskId = null;
        this.savedAction = null;
      }
    } else {
      this.savedTaskId = null;
      this.savedAction = null;
    }

    if (this.savedTaskId) {
      this.taskService.get(+this.savedTaskId).pipe(takeUntil(this.destroy$))
        .subscribe(task => {
          this.task = task;
          console.log(task)
          if (task.due_at) {
            this.task.due_at = new Date(task.due_at);
          }
        });
    }
  }


  cancel(taskForm: NgForm) {
    taskForm.resetForm();
    localStorage.removeItem('selectedTask');
    this.router.navigate(['']);
  }


  formatDateTime = (date: Date | null | undefined): Date => {
    if (!date) return new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  };


  onSubmit(taskForm: NgForm) {
    if (taskForm.valid) {
      const taskToSave = {
        ...this.task,
        due_at: this.formatDateTime(this.task.due_at)
      };

      const request$ = this.savedTaskId
        ? this.taskService.update(+this.savedTaskId, taskToSave)
        : this.taskService.create(taskToSave);

      request$
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            taskForm.resetForm();
            this.task = {
              title: '',
              description: '',
              status: 'todo',
              due_at: new Date(),
              case_id: 0,
              assigned_to: '',
              priority: ''
            };
            localStorage.removeItem('selectedTask');
            this.router.navigate(['']);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Task ${this.savedTaskId ? 'updated' : 'created'} successfully`,
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error saving task:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to save task'
            });
          }
        });
    }
  }
}
