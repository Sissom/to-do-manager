import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HTTPService } from 'src/app/shared/http/http.service';
import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit, OnDestroy {
  editTaskForm: FormGroup;
  priorities: string[] = ['Low', 'Medium', 'High', 'Urgent'];
  taskSub!: Subscription;
  selectedTask!: Task;
  isCurrent: boolean = false;
  idx!: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    private http: HTTPService,
    private route: ActivatedRoute
    )
    {
    this.editTaskForm = this.formBuilder.group({
      name: new FormControl<string | null>(null, Validators.required),
      description: new FormControl<string | null>(null),
      materials: new FormControl<string | null>(null),
      priority: new FormControl<string | null>(null)
      })
    }

  ngOnInit(): void {
    this.taskSub = this.taskService.taskSelected.subscribe(res => {
      this.selectedTask = res;
    });

    this.route.params.subscribe((params: Params) => {
      this.idx = +params['id'];
      if (this.route.pathFromRoot.toString().includes('current-tasks')) {
        this.isCurrent = true;
      }});

    this.taskService.getSelectedTask(this.idx, this.isCurrent);
    this.editTaskForm.patchValue({
      'name': this.selectedTask.name,
      'description': this.selectedTask.description,
      'materials': this.selectedTask.materialsNeeded,
      'priority': this.selectedTask.priority
    });

  }

  onCancel() {
    this.router.navigate(["../.."], {relativeTo: this.route});
  }

  onSubmit() {
    let newTask = new Task(
      this.editTaskForm.value.name,
      this.editTaskForm.value.description,
      this.editTaskForm.value.materials,
      this.editTaskForm.value.priority
      );
    this.taskService.editTask(this.idx, this.isCurrent, newTask);
    this.http.saveTasksToFirebase();
    this.router.navigate(["../.."], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
      this.taskSub.unsubscribe;
  }

}
