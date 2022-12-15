import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskService } from '../task.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit, OnDestroy {
  selectedTask!: Task;
  idx!: number;
  isCurrent: boolean = false;
  taskSub!: Subscription;

  constructor(private route: ActivatedRoute, private taskService: TaskService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.idx = +params['id'];
      console.log("idx:" + this.idx);
      if (this.route.pathFromRoot.toString().includes('current-tasks')) {
        this.isCurrent = true;
      }});

    this.taskSub = this.taskService.taskSelected.subscribe((res) => {
        this.selectedTask = res;
        console.log(res);
      });
    this.taskService.getSelectedTask(this.idx, this.isCurrent);
  }

  ngOnDestroy(): void {
      this.taskSub.unsubscribe;
  }

}
