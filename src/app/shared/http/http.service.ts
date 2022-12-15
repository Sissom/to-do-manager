import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskService } from 'src/app/list/task.service';
import { Task } from 'src/app/list/task.model';
import { AuthService, UserData } from '../auth/auth.service';


@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  userData: UserData = JSON.parse(localStorage.getItem('userData') as string);
  firebaseDatabaseURL = "https://to-do-manager-2ffb3-default-rtdb.firebaseio.com/tasks/";


  constructor(private http: HttpClient, private taskService: TaskService, private authService: AuthService) {}

  fetchCurrentTasks() {
    return this.http
    .get<Task[]>(`${this.firebaseDatabaseURL}${this.userData.id}/currentTasks.json`, {})
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

  fetchArchivedTasks() {
    return this.http
    .get<Task[]>(`${this.firebaseDatabaseURL}${this.userData.id}/archivedTasks.json`, {})
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

    saveTasksToFirebase() {
      const tasks = {
        archivedTasks: this.taskService.getArchivedTasks(),
        currentTasks: this.taskService.getCurrentTasks(),
      };

      this.http.patch(`${this.firebaseDatabaseURL}/${this.userData.id}`, tasks).subscribe((res) => {
        console.log('Firebase DB Response:', res);
      });
    }
}
