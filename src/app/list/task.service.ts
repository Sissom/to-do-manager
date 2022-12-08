import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  archivedTaskListChanged = new Subject<Task[]>();
  currentTaskListChanged = new Subject<Task[]>();
  taskSelected = new Subject<Task>();
  currentTasks: Task[] = [
    {
      name: 'blasdhf',
      description: 'blah blah blah',
      materialsNeeded: ["don't know"],
      priority: 'high',
    },
  ];
  archivedTasks: Task[] = [];

  constructor() {}

  archiveTask(idx: number) {
    this.archivedTasks.push(this.currentTasks[idx]); // Pushes currentTasks to archivedTasks array
    this.currentTasks.splice(idx, 1); // Remove from currentTasks
    this.currentTaskListChanged.next(this.currentTasks.slice()); // Emits changes to currentTasks
    this.archivedTaskListChanged.next(this.archivedTasks.slice()); // Emits changes to archivedTasks
  }

  deleteTask(idx: number, isCurrent: boolean) {
    if (isCurrent == true) {
      // If current array
      this.currentTasks.splice(idx, 1); // Remove from currentTasks
      this.currentTaskListChanged.next(this.currentTasks.slice()); // Emits changes to currentTasks
    } else {
      this.archivedTasks.splice(idx, 1); // Remove from archivedTasks
      this.archivedTaskListChanged.next(this.archivedTasks.slice()); // Emits changes to archivedTasks
    }
  }

  // METHOD: returns archived tasks array (used in http service to save to firebase)
  getArchivedTasks() {
    return this.archivedTasks.slice();
  }

  // METHOD: returns current tasks array (used in http service to save to firebase)
  getCurrentTasks() {
    return this.currentTasks.slice();
  }

  // METHOD: sets archived tasks array to new array of tasks that we pass through (used in http service to fetch from firebase)
  setArchivedTasks(tasks: Task[] | []) {
    this.archivedTasks = tasks || []; // Sets archived tasks array to our new array of tasks OR to an empty array if we don't have any tasks
    this.archivedTaskListChanged.next(this.archivedTasks.slice()); // Notifies any subscribers that archivedTasks has changed
  }

  // METHOD: sets current tasks array to new array of tasks that we pass through (used in http service to fetch from firebase)
  setCurrentTasks(tasks: Task[] | []) {
    this.currentTasks = tasks || []; // Sets current tasks array to our new array of tasks OR to an empty array if we don't have any tasks
    this.currentTaskListChanged.next(this.currentTasks.slice()); // Notifies any subscribers that currentsTasks has changed
  }
}
