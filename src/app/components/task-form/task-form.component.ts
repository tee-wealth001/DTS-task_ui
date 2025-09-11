import { Component, OnInit } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { Task } from '../../model/task.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FluidModule, CommonModule, FormsModule, SelectModule, InputTextModule, DatePickerModule, ButtonModule, InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    ToastModule,],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router) { }

  task: Task = {
    title: '',
    description: '',
    status: 'todo',
    due_at: '',
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

    console.log('Task ID:', this.savedTaskId);
    console.log('Task Action:', this.savedAction);

    if (this.savedTaskId) {
      this.taskService.get(+this.savedTaskId).subscribe(task => {
        this.task = task;
      });
    }
  }


  cancel(taskForm: NgForm) {
    taskForm.resetForm();
    localStorage.removeItem('selectedTask');
    this.router.navigate(['']);
  }

  onSubmit(taskForm: NgForm) {
    if (taskForm.valid) {
      if (this.savedTaskId) {
        this.taskService.update(+this.savedTaskId, this.task).subscribe({
          next: (updatedTask) => {
            console.log('Task updated successfully:', updatedTask);
            taskForm.resetForm();
            this.task = {
              title: '',
              description: '',
              status: 'todo',
              due_at: '',
              case_id: 0,
              assigned_to: '',
              priority: ''
            };
            localStorage.removeItem('selectedTask');
            this.router.navigate(['']);
          },
          error: (error) => {
            console.error('Error updating task:', error);
          }
        });
      } else {
        this.taskService.create(this.task).subscribe({
          next: (createdTask) => {
            console.log('Task created successfully:', createdTask);
            taskForm.resetForm();
            this.task = {
              title: '',
              description: '',
              status: 'todo',
              due_at: '',
              case_id: 0,
              assigned_to: '',
              priority: ''
            };
            this.router.navigate(['']);
          },
          error: (error) => {
            console.error('Error creating task:', error);
          }
        });
      }
    }
  }

}
