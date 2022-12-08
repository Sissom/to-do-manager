import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-current-tasks',
  templateUrl: './current-tasks.component.html',
  styleUrls: ['./current-tasks.component.css']
})
export class CurrentTasksComponent implements OnInit, OnDestroy {
  currentTasksSub = new Subscription;
  tasks: Task[] = [
];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.tasks = this.taskService.currentTasks;
    this.currentTasksSub = this.taskService.currentTaskListChanged.subscribe(data => {
      this.tasks = data;
    });
  }

  onArchive(idx: number) {
    this.taskService.archiveTask(idx);
  }

  onDelete(idx: number) {
    this.taskService.deleteTask(idx, true);
  }

  ngOnDestroy(): void {
      this.currentTasksSub.unsubscribe();
  }

}
