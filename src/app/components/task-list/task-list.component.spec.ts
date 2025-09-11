import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { PriorityEnum, Task } from '../../model/task.model';
import { StatusEnum } from '../../enums/enums';
import { MessageService } from 'primeng/api';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let messageService: jasmine.SpyObj<MessageService>;


  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: '',
      status: StatusEnum.Todo,
      due_at: new Date(),
      case_id: 1,
      assigned_to: 'Alice',
      priority: PriorityEnum.High,
    },
    {
      id: 2,
      title: 'Task 2',
      description: '',
      status: StatusEnum.In_progress,
      due_at: new Date(),
      case_id: 2,
      assigned_to: 'Bob',
      priority: PriorityEnum.Low,
    },
  ];

  const mockTask: Task = {
    title: 'Sample Task',
    description: 'Sample description',
    status: StatusEnum.Completed,
    due_at: new Date(),
    case_id: 1,
    assigned_to: 'Alice',
    priority: PriorityEnum.Medium,
  };

  beforeEach(async () => {
    const taskServiceMock = jasmine.createSpyObj('TaskService', ['getAll', 'delete', 'updateStatus']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);


    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MessageService, useValue: messageServiceSpy }

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;

    taskServiceSpy.getAll.and.returnValue(of(mockTasks));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(taskServiceSpy.getAll).toHaveBeenCalled();
    expect(component.tasks.length).toBe(2);
  }));

  it('should unsubscribe on destroy', () => {
    component.ngOnInit();
    const subSpy = spyOn(component['subscriptions'][0], 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(subSpy).toHaveBeenCalled();
  });

  it('edit() should save task to localStorage and navigate', () => {
    const task = mockTasks[0];
    component.edit(task);
    const saved = JSON.parse(localStorage.getItem('selectedTask') || '{}');
    expect(saved.id).toBe(task.id);
    expect(saved.action).toBe('edit');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/form']);
    localStorage.removeItem('selectedTask');
  });

  it('view() should set modal, save, navigate and set selectedTask', () => {
    const task = mockTasks[1];
    component.view(task);
    expect(component.displayModal).toBeTrue();
    const saved = JSON.parse(localStorage.getItem('selectedTask') || '{}');
    expect(saved.id).toBe(task.id);
    expect(saved.action).toBe('view');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/form']);
    expect(component.selectedTask).toBe(task);
    localStorage.removeItem('selectedTask');
  });

  it('delete() should call service and reload tasks', fakeAsync(() => {
    taskServiceSpy.delete.and.returnValue(of({}));
    component.load = jasmine.createSpy('load');
    component.delete(1);
    tick();
    expect(taskServiceSpy.delete).toHaveBeenCalledWith(1);
    expect(component.load).toHaveBeenCalled();
  }));

  it('taskSeverity() should return correct CSS classes', () => {
    expect(component.taskSeverity({ ...mockTasks[0] })).toBe('danger');
    expect(component.taskSeverity({ ...mockTasks[1] })).toBe('info');
    expect(component.taskSeverity({ ...mockTasks[0], priority: PriorityEnum.Medium })).toBe('warn');
  });

  it('taskStatus() should return correct CSS classes', () => {
    expect(component.taskStatus({ ...mockTasks[0] })).toBe('info');
    expect(component.taskStatus({ ...mockTasks[1] })).toBe('warn');
    expect(component.taskStatus({ ...mockTasks[1], status: StatusEnum.Completed })).toBe('success');
  });

  it('addTask() should navigate to /form', () => {
    component.addTask();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/form']);
  });

  it('getInitials() should return first two uppercase initials', () => {
    expect(component.getInitials('Alice Wonderland')).toBe('AW');
    expect(component.getInitials('Bob')).toBe('B');
    expect(component.getInitials('Charlie Delta Echo')).toBe('CD');
  });

  it('getStatusLabel() should return proper label or fallback', () => {
    expect(component.getStatusLabel('todo')).toBe('To Do');
    expect(component.getStatusLabel('in_progress')).toBe('In Progress');
    expect(component.getStatusLabel('completed')).toBe('Completed');
    expect(component.getStatusLabel('unknown_status')).toBe('unknown_status');
  });

  it('onPageChange1() should update pagination properties', () => {
    component.onPageChange1({ first: 5, rows: 20 } as any);
    expect(component.first1).toBe(5);
    expect(component.rows1).toBe(20);

    component.onPageChange1({} as any);
    expect(component.first1).toBe(0);
    expect(component.rows1).toBe(10);
  });

  it('showDialog() should set visible, selectedTaskStatus, selectedTaskId, and task correctly', () => {

    component.showDialog(mockTask);

    expect(component.visible).toBeTrue();
    expect(component.selectedTaskStatus).toBe(mockTask.status);
    expect(component.selectedTaskId).toBe(mockTask.id);
    expect(component.task).toBe(mockTask);
  });

  it('onPatchStatus() should call updateStatus and handle success', () => {
    component.visible = true;
    component.task = { id: 1, status: 'todo' } as Task;
    component.selectedTaskId = component.task.id;
    component.selectedTaskStatus = 'completed';

    taskServiceSpy.updateStatus.and.returnValue(of(mockTask));

    spyOn(component, 'load'); // spy on load method if applicable

    component.onPatchStatus();

    expect(taskServiceSpy.updateStatus).toHaveBeenCalledWith(1, { status: 'completed' });
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success',
      summary: 'Success'
    }));
    expect(component.load).toHaveBeenCalled();
    expect(component.visible).toBeFalse();
  });

  it('onPatchStatus() should not call updateStatus if status unchanged', () => {
    component.task = { id: 1, status: 'todo' } as Task;
    component.selectedTaskId = component.task.id;
    component.selectedTaskStatus = 'todo'; // same as current status

    component.onPatchStatus();

    expect(taskServiceSpy.updateStatus).not.toHaveBeenCalled();
  });

  it('onPatchStatus() should handle error response', () => {
    component.visible = true;
    component.task = { id: 1, status: 'todo' } as Task;
    component.selectedTaskId = component.task.id;
    component.selectedTaskStatus = 'completed';

    const errorResponse = { error: { detail: 'Failed' } };
    taskServiceSpy.updateStatus.and.returnValue(throwError(() => errorResponse));

    component.onPatchStatus();

    expect(taskServiceSpy.updateStatus).toHaveBeenCalledWith(1, { status: 'completed' });
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed'
    }));
    expect(component.visible).toBeTrue(); // should not close on error
  });
});
