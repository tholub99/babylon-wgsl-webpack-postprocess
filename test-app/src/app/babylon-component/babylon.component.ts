import { AfterViewInit, Component, Input } from '@angular/core';
import { CreateRenderer, Renderer } from 'babylonjs-wgsl-postprocess';

@Component({
    selector: 'app-babylon',
    standalone: true,
    template: '',
    styleUrls: ['./babylon.component.css'],
    
})

export class BabylonComponent implements AfterViewInit {
    @Input() public renderContainer!: HTMLDivElement;

    private _renderer: Renderer | null = null;

    public ngAfterViewInit(){
        requestAnimationFrame(() => {
            this._createRenderer(this.renderContainer);
        });
    }

    private _createRenderer(renderContainer: HTMLDivElement) {
        if (this._renderer) {
            this._renderer.dispose();
        }

        this._renderer = CreateRenderer(renderContainer);

        addEventListener('pointerdown', (event) => {
            if(!this._renderer || event.button !== 0) {
                return;
            }

            if(event.target instanceof HTMLCanvasElement) {
                event.target.focus();
            }
        });

        addEventListener('keydown', (event) => {
            if (event.key === 'i') {
                if (event.target instanceof HTMLCanvasElement) {
                    this._renderer?.toggleInspector();
                }
            }

            if (event.key === 'o') {
                if (event.target instanceof HTMLCanvasElement) {
                    this._renderer?.toggleWireframe();
                }
            }
        });
    }
}