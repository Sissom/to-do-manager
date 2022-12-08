import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskService } from 'src/app/list/task.service';

@Injectable({
  providedIn: 'root',
})
export class HTTPService {
  currentTasksRootURL =
    'https://to-do-manager-2ffb3-default-rtdb.firebaseio.com/currentTasks.json';
  archivedTasksRootURL =
    'https://to-do-manager-2ffb3-default-rtdb.firebaseio.com/archivedTasks.json';

  constructor(private http: HttpClient, private taskService: TaskService) {}

  // METHOD - saves both current and archived tasks arrays to Firebase
  saveTasksToFirebase() {
    const archivedTasks = this.taskService.getArchivedTasks(); // Returns archived tasks array
    const currentTasks = this.taskService.getCurrentTasks(); // Returns current tasks array

    // saves archived tasks array to firebase
    this.http.put(this.archivedTasksRootURL, archivedTasks).subscribe((res) => {
      console.log('Firebase Archived Tasks Response: ', res);
    });
    // saves current tasks array to firebase
    this.http.put(this.currentTasksRootURL, currentTasks).subscribe((res) => {
      console.log('Firebase Current Tasks Response: ', res);
    });
  }

  // METHOD - fetches archived tasks array from Firebase  (stopped here so I need to figure out this error)
  fetchArchivedTasks() {
    return this.http;
    // .get(this.archivedTasksRootURL, {})
    // .subscribe((res: Task[] | []) => {
    //   this.taskService.setArchivedTasks(res);
    // });
  }

  // METHOD - fetches current tasks array from Firebase
  fetchCurrentTasks() {}

  // METHOD - fetches both current and archived tasks arrays from Firebase (will call both METHODS above in this method)
  fetchTasksFromFirebase() {}
}
