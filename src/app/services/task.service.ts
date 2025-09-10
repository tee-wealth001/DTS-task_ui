import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  base = 'http://localhost:8000';
  constructor(private http: HttpClient) { }



}
