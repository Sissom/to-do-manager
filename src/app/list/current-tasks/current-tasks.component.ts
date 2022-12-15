import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HTTPService } from 'src/app/shared/http/http.service';
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

  constructor(private taskService: TaskService, private httpService: HTTPService) { }

  ngOnInit(): void {
    this.currentTasksSub = this.taskService.currentTaskListChanged.subscribe(data => {
      this.tasks = data;
    });
    this.httpService.fetchCurrentTasks();
    this.httpService.fetchArchivedTasks();
  }

  onArchive(idx: number) {
    this.taskService.archiveTask(idx);
    this.httpService.saveTasksToFirebase();
  }

  onDelete(idx: number) {
    this.taskService.deleteTask(idx, true);
    this.httpService.saveTasksToFirebase();
  }

  ngOnDestroy(): void {
      this.currentTasksSub.unsubscribe();
  }

}
