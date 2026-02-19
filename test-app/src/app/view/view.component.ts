import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BabylonComponent } from '../babylon-component/babylon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BabylonComponent],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css', '../sandbox-styles.css']
})

export class ViewComponent {
  title = 'babylon-view';
  @ViewChild(BabylonComponent, {static: true}) babylonComponent: BabylonComponent | undefined;
}
