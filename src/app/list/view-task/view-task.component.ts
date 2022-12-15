import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface ResponseData {
  etag: string,
  items: VideoData[],
  kind: string,
  nextPageToken: string,
  pageInfo: {
    resultsPerPage: number,
    totalResults: number
  },
  regionCode: string,
}

export interface VideoData {
  etag: string,
  id: {
    kind: string,
    channelId?: string,
    videoId?: string
  },
  kind: string,
  snippet: {
    channelId: string,
    channelTitle: string,
    description: string,
    liveBroadcastContent: string,
    publishTime: string,
    publishedAs: string,
      thumbnails: {
        default: {
          url: string,
          height?: number,
          width?: number
        },
        high: {
          url: string,
          height?: number,
          width?: number
        },
        medium: {
          url: string,
          height?: number,
          width?: number
        }
      },
    title: string
  },

}

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
  videoArray: VideoData[] = [];
  searchResponse: any;

  constructor(private route: ActivatedRoute, private taskService: TaskService, private http: HttpClient) { }

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
    this.videoArray = [];
  }

  displayVideos(search: string) {
    const formattedSearch = search.split(' ').join('+').toLowerCase()
    this.http.get<ResponseData>(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${formattedSearch}&key=${environment.ytAPIKey}`).subscribe(res => {
      console.log(res);
      res.items.map(video => {
        this.videoArray.push(video);
      });
    });
    console.log(this.videoArray);
  }

  ngOnDestroy(): void {
      this.taskSub.unsubscribe;
  }

}
