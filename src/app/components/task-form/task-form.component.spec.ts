import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { StatusEnum } from '../../enums/enums';
import { PriorityEnum } from '../../model/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let router: jasmine.SpyObj<Router>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['get', 'create', 'update']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('getSelectedTask', () => {
    it('should parse task from localStorage and load task', fakeAsync(() => {
      const mockTask = {
        title: 'Test',
        description: 'Sample description',
        status: StatusEnum.Completed,
        due_at: new Date(),
        case_id: 1,
        assigned_to: 'Alice',
        priority: PriorityEnum.Medium,
      };
      localStorage.setItem('selectedTask', JSON.stringify({ id: 1, action: 'edit' }));
      taskService.get.and.returnValue(of(mockTask));

      component.getSelectedTask();
      tick();

      expect(component.savedTaskId).toBe('1');
      expect(component.savedAction).toBe('edit');
      expect(taskService.get).toHaveBeenCalledWith(1);
      expect(component.task.title).toBe('Test');
    }));

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('selectedTask', '{invalidJson}');
      component.getSelectedTask();
      expect(component.savedTaskId).toBeNull();
      expect(component.savedAction).toBeNull();
    });

    it('should handle empty localStorage', () => {
      component.getSelectedTask();
      expect(component.savedTaskId).toBeNull();
      expect(component.savedAction).toBeNull();
    });
  });

  describe('formatDateTime', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-01T10:15:30Z');
      const formatted = component.formatDateTime(date);
      expect(formatted.toISOString()).toBe('2025-01-01T10:15:30.000Z');
    });

    it('should return new Date if input is null or undefined', () => {
      const now = component.formatDateTime(null);
      expect(now instanceof Date).toBeTrue();
    });
  });

  describe('cancel', () => {
    it('should reset form, remove localStorage and navigate', () => {
      const formSpy = jasmine.createSpyObj('NgForm', ['resetForm']);
      localStorage.setItem('selectedTask', JSON.stringify({ id: 1 }));

      component.cancel(formSpy);
      expect(formSpy.resetForm).toHaveBeenCalled();
      expect(localStorage.getItem('selectedTask')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });

  describe('onSubmit', () => {
    it('should create a new task if no savedTaskId', fakeAsync(() => {
      const formSpy = jasmine.createSpyObj('NgForm', ['resetForm'], { valid: true });
      taskService.create.and.returnValue(of({} as any));

      component.onSubmit(formSpy);
      tick();

      expect(taskService.create).toHaveBeenCalled();
      expect(formSpy.resetForm).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['']);
      expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
    }));

    it('should update a task if savedTaskId exists', fakeAsync(() => {
      component.savedTaskId = '1';
      const mockTask = {
        title: 'Sample Task',
        description: 'Sample description',
        status: StatusEnum.Completed,
        due_at: new Date(),
        case_id: 1,
        assigned_to: 'Alice',
        priority: PriorityEnum.Medium,
      }
      const formSpy = jasmine.createSpyObj('NgForm', ['resetForm'], { valid: true });
      taskService.update.and.returnValue(of(mockTask));

      component.onSubmit(formSpy);
      tick();

      expect(taskService.update).toHaveBeenCalledWith(1, jasmine.any(Object));
      expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
    }));

    it('should handle error when saving task fails', fakeAsync(() => {
      const formSpy = jasmine.createSpyObj('NgForm', ['resetForm'], { valid: true });
      const errorResponse = { error: { detail: 'Some error' } };
      taskService.create.and.returnValue(throwError(() => errorResponse));

      component.onSubmit(formSpy);
      tick();

      expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
        severity: 'error',
        detail: 'Some error'
      }));
    }));

    it('should not submit if form is invalid', () => {
      const formSpy = jasmine.createSpyObj('NgForm', ['resetForm'], { valid: false });
      component.onSubmit(formSpy);
      expect(taskService.create).not.toHaveBeenCalled();
      expect(taskService.update).not.toHaveBeenCalled();
    });
  });
});
