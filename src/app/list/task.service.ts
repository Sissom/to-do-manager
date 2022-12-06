import { Injectable } from "@angular/core";
import { Task } from "./task.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})

export class TaskService {
  taskListChanged = new Subject<Task[]>();
  taskSelected = new Subject<Task>();
  currentTasks: Task[] = [];
  archivedTasks: Task[] = [];


  constructor(){
  }

  archiveTask(idx: number){
    this.archivedTasks.push(this.currentTasks[idx]); // Pushes currentTasks to archivedTasks array
    this.currentTasks.splice(idx, 1); // Remove from currentTasks
    this.taskListChanged.next(this.currentTasks.slice()); // Emits changes to currentTasks
    this.taskListChanged.next(this.archivedTasks.slice()); // Emits changes to archivedTasks
  }



  deleteTask(idx: number, isCurrent: boolean) {
    if (isCurrent == true){ // If current array
      this.currentTasks.splice(idx, 1); // Remove from currentTasks
      this.taskListChanged.next(this.currentTasks.slice()); // Emits changes to currentTasks
    }
    else {
      this.archivedTasks.splice(idx, 1); // Remove from archivedTasks
      this.taskListChanged.next(this.archivedTasks.slice()); // Emits changes to archivedTasks
    }
  }


}
