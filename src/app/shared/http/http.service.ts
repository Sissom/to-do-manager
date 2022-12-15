import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskService } from 'src/app/list/task.service';
import { Task } from 'src/app/list/task.model';
import { UserData } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  userData: UserData = JSON.parse(localStorage.getItem('userData') as string);
  firebaseDatabaseURL = `https://to-do-manager-2ffb3-default-rtdb.firebaseio.com/tasks/${this.userData.id}.json`;
  firebaseUserURL = `https://to-do-manager-2ffb3-default-rtdb.firebaseio.com/tasks/${this.userData.id}/`;

  constructor(private http: HttpClient, private taskService: TaskService) {}

  // METHOD - fetches archived tasks array from Firebase
  fetchArchivedTasks() {
    return this.http
      .get<Task[]>(`${this.firebaseUserURL}archivedTasks.json`, {})
      .subscribe((tasks) => {
        console.log(tasks);
        if (tasks === null) {
          this.taskService.archivedTasks = [];
        } else {
          this.taskService.setArchivedTasks(tasks);
          console.log('Response from DB: ', tasks);
        }
      });
  }

  // METHOD - fetches current tasks array from Firebase
  fetchCurrentTasks() {
    return this.http
      .get<Task[]>(this.firebaseUserURL + 'currentTasks.json', {})
      .subscribe((tasks) => {
        console.log(tasks);
        if (tasks === null) {
          this.taskService.currentTasks = [];
        } else {
          this.taskService.setCurrentTasks(tasks);
          console.log('Response from DB: ', tasks);
        }
      });
  }

  // METHOD - saves both current and archived tasks arrays to Firebase
  saveTasksToFirebase() {
    const tasks = {
      archivedTasks: this.taskService.getArchivedTasks(),
      currentTasks: this.taskService.getCurrentTasks(),
    };

    this.http.patch(this.firebaseDatabaseURL, tasks).subscribe((res) => {
      console.log('Firebase DB Response:', res);
    });
  }
}
