import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StatusEnum } from '../enums/enums';
import { PriorityEnum, Task } from '../model/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tasks', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', description: '', status: StatusEnum.Todo, due_at: new Date(), case_id: 1, assigned_to: 'Alice', priority: PriorityEnum.Low },
      { id: 2, title: 'Task 2', description: '', status: StatusEnum.Completed, due_at: new Date(), case_id: 2, assigned_to: 'Bob', priority: PriorityEnum.High },
    ];

    service.getAll().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(`${baseUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should fetch task by id', () => {
    const mockTask: Task = { id: 1, title: 'Task 1', description: '', status: StatusEnum.Todo, due_at: new Date(), case_id: 1, assigned_to: 'Alice', priority: PriorityEnum.Low };

    service.get(1).subscribe(task => {
      expect(task).toEqual(mockTask);
    });

    const req = httpMock.expectOne(`${baseUrl}/tasks/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('should create a task', () => {
    const newTask: Task = { id: 3, title: 'New Task', description: '', status: StatusEnum.Todo, due_at: new Date(), case_id: 3, assigned_to: 'Charlie', priority: PriorityEnum.Medium };

    service.create(newTask).subscribe(task => {
      expect(task).toEqual(newTask);
    });

    const req = httpMock.expectOne(`${baseUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    req.flush(newTask);
  });

  it('should update a task', () => {
    const updatedTask: Task = { id: 1, title: 'Updated Task', description: '', status: StatusEnum.In_progress, due_at: new Date(), case_id: 1, assigned_to: 'Alice', priority: PriorityEnum.High };

    service.update(1, updatedTask).subscribe(task => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpMock.expectOne(`${baseUrl}/tasks/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTask);
  });

  it('should update task status', () => {
    const updatedTask: Task = { id: 1, title: 'Task 1', description: '', status: StatusEnum.Completed, due_at: new Date(), case_id: 1, assigned_to: 'Alice', priority: PriorityEnum.Low };

    service.updateStatus(1, StatusEnum.Completed).subscribe(task => {
      expect(task.status).toBe(StatusEnum.Completed);
    });

    const req = httpMock.expectOne(`${baseUrl}/tasks/1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: StatusEnum.Completed });
    req.flush(updatedTask);
  });

  it('should delete a task', () => {
    service.delete(1).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/tasks/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
