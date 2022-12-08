import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-archived-tasks',
  templateUrl: './archived-tasks.component.html',
  styleUrls: ['./archived-tasks.component.css']
})
export class ArchivedTasksComponent implements OnInit, OnDestroy {
  archivedTasksSub = new Subscription;
  tasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.tasks = this.taskService.archivedTasks;
    this.archivedTasksSub = this.taskService.archivedTaskListChanged.subscribe(data => {
      this.tasks = data;
    });
  }

  onDelete(idx: number) {
    this.taskService.deleteTask(idx, false);
  }

  ngOnDestroy(): void {
      this.archivedTasksSub.unsubscribe();
  }

}
