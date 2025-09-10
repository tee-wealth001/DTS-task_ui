import { Routes } from '@angular/router';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';

export const appRoutes: Routes = [
    { path: 'form', component: TaskFormComponent },
    { path: '', component: TaskListComponent }
];