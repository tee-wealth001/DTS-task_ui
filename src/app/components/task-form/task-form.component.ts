import { Component } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { Task } from '../../model/task.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';

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
export class TaskFormComponent {

  task: Task = {
    title: '',
    description: '',
    status: 'todo',
    due_at: '',
    case_id: 0,
    assigned_to: '',
    priority: ''
  };

}
