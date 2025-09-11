# Task Management Frontend

This is the **Angular standalone frontend** for the Task Management system. It interacts with the FastAPI backend and provides CRUD functionality for tasks. The project uses **TailwindCSS**, **PrimeNG**, and **RxJS**.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Setup & Installation](#setup--installation)
* [Running the App](#running-the-app)
* [Unit Testing](#unit-testing)
* [API Configuration](#api-configuration)
* [Routing](#routing)
* [Components](#components)
* [Services](#services)
* [Styling](#styling)

---

## Features

* View, create, update, and delete tasks
* Form validation with reactive forms
* Filter tasks by status and priority
* Assign tasks to users
* Async API calls with **HttpClient**
* Styled with **TailwindCSS** and **PrimeNG**
* Standalone Angular components
* Unit tests for all components and services

---

## Tech Stack

* Angular 18 (Standalone components)
* TypeScript
* TailwindCSS
* PrimeNG + tailwindcss-primeui
* RxJS
* HttpClient for API calls

---

## Project Structure

```
src/
├─ app/
│  ├─ services/
│  │  └─ task.service.ts        # CRUD API calls
│  ├─ models/
│  │  └─ task.model.ts          # Task interface
│  ├─ enums/
│  │  └─ enum.ts                # Status and priority enums
│  ├─ components/
│  │  ├─ task-list/
│  │  │  ├─ task-list.component.ts
│  │  │  ├─ task-list.component.html
│  │  │  └─ task-list.component.scss
│  │  └─ task-form/
│  │     ├─ task-form.component.ts
│  │     ├─ task-form.component.html
│  │     └─ task-form.component.scss
│  ├─ app-config.ts             # Config constants (API base URL, etc.)
│  └─ app.routes.ts             # App routes
```

---

## Setup & Installation

### 1. Clone the repo

```bash
git clone <https://github.com/tee-wealth001/DTS-task_ui.git>
cd <DTS-task_ui>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API

Set the backend API URL in `app-config.ts`:

```ts
export const API_BASE_URL = 'http://localhost:8000';
```

---

## Running the App

```bash
ng serve
```

* Open browser at `http://localhost:4200`

---

## Unit Testing

All components and services have `spec.ts` tests. Run tests using:

```bash
ng test
```

* **Angular CLI** uses Karma/Jasmine by default
* Tests include:

  * CRUD operations in `task.service.ts`
  * Component rendering and form validation
  * Button click events and output handling

---

## Routing

Defined in `app.routes.ts`:

| Path             | Component         | Description        |
| ---------------- | ----------------- | ------------------ |
| `/`              | TaskListComponent | Show all tasks     |
| `/form`          | TaskFormComponent | Create a new task  |
| `/form`          | TaskFormComponent | Edit existing task |

---

## Components

### Task List (`task-list.component`)

* Displays tasks in a **PrimeNG table**
* Buttons for edit and delete
* Filters for status and priority

### Task Form (`task-form.component`)

* Reactive form for **create/edit tasks**
* Dropdowns for `status`, `priority`, `assigned_to`
* Validations for required fields
* Buttons for **submit** and **cancel**

---

## Services

### TaskService

Provides **CRUD API calls**:

| Method                 | Description         |
| ---------------------- | ------------------- |
| `getTasks()`           | Get all tasks       |
| `getTask(id)`          | Get task by ID      |
| `createTask(task)`     | Create a task       |
| `updateTask(id, task)` | Full update task    |
| `updateStatus(id, status)` | update task status    |
| `deleteTask(id)`       | Delete task by ID   |

---

## Styling

* **TailwindCSS** for utility-first styling
* **PrimeNG** components styled via `tailwindcss-primeui`
* All forms and tables are responsive

---

## Notes

* Ensure the backend is running and reachable at the URL in `app-config.ts`
* Use `ng test` to verify unit tests before deployment
* Standalone components simplify modular imports and lazy loading

---
