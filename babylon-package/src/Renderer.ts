import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { DebugLayerTab } from "@babylonjs/core/Debug/debugLayer";
import { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { IDisposable, Scene } from "@babylonjs/core/scene";
import { PostProcess } from "@babylonjs/core/PostProcesses";
import { Nullable, ShaderLanguage, WebGPUEngine } from "@babylonjs/core";

export default class Renderer implements IDisposable {
    private _engine: Nullable<AbstractEngine> = null;
    private _scene: Nullable<Scene> = null;
    private _renderCanvas: HTMLCanvasElement = document.createElement('canvas');
    private _renderContainer: HTMLDivElement;
    private readonly _shaderSource = '/assets/shaders/wgsl/'

    private _wireframeEnabled = false;

    public constructor(renderContainer: HTMLDivElement) {
        this.init(renderContainer);
        this._renderContainer = renderContainer;
    }

    public async init(renderContainer: HTMLDivElement) {

        let engine = await this.createEngine(this._renderCanvas);
        let scene = this.createScene(engine);
        this._createEngineView(engine, scene, renderContainer);

        const sphere = CreateSphere(
            "sphere",
            { diameter: 2, segments: 32 },
            scene
        );
        sphere.position.y = 1;

        const ground = CreateGround(
            "ground",
            { width: 6, height: 6 },
            scene
        );
        ground.receiveShadows = true;

        const light = new DirectionalLight(
            "light",
            new Vector3(0, -1, 1),
            scene
        );
        light.intensity = 0.5;
        light.position.y = 10;

        this.setupEngineViews(engine);

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });

        this._scene = scene;
        this._engine = engine;
    }

    dispose(): void {
        this._scene?.dispose();
        this._engine?.dispose();
    }

    protected async createEngine(canvas: HTMLCanvasElement): Promise<AbstractEngine> {
        const engine = new WebGPUEngine(canvas, { antialias: true, stencil: true});
        await engine.initAsync()
        engine.enableOfflineSupport = false;
        engine.dbgShowShaderCode = true;

        console.info(
            `${engine.getInfo().renderer}, ${engine.getInfo().version}\n${engine.getInfo().vendor}`
        );

        return engine;
    }

    protected createScene(engine: AbstractEngine): Scene {
        const scene = new Scene(engine, { useGeometryUniqueIdsMap: true, useMaterialMeshMap: true });
        scene.clearColor = new Color4(0.0, 0.5, 0.75, 1.0);

        return scene;
    }

    protected setupEngineViews(engine: AbstractEngine) {
        engine.onBeforeViewRenderObservable.add(() => {
            this._setWireframe(this._wireframeEnabled);
        })
    }

    private _createCanvas(parentElement: HTMLElement): HTMLCanvasElement {
        const viewCanvas = document.createElement('canvas');
        viewCanvas.style.width = "100%"
        viewCanvas.style.height = "100%";
        viewCanvas.style.display = "flex";
        viewCanvas.style.position = "relative";
        viewCanvas.tabIndex = 0;
        parentElement.appendChild(viewCanvas);

        return viewCanvas;
    }

    private _createCamera(scene: Scene): Camera {
        const camera = new ArcRotateCamera('Camera', 0, Math.PI / 3, 10, Vector3.Zero(), scene, true);
        camera.minZ = 0.01;

        return camera;
    }

    private _createEngineView(engine: AbstractEngine, scene: Scene, viewContainer: HTMLDivElement) {
        const canvas = this._createCanvas(viewContainer);
        const camera = this._createCamera(scene);
        camera.attachControl(canvas);
        engine.registerView(canvas, [camera]);

        new PostProcess("a", this._shaderSource + "blackWhite", {
            shaderLanguage: ShaderLanguage.WGSL,
            camera: camera
        });
    }

    private _setWireframe(isEnabled: boolean) {
        this._scene?.materials.forEach(mat => {
            mat.wireframe = isEnabled;
        })
    }

    public async toggleInspector() {
        const { Inspector } = await import('@babylonjs/inspector');
        if (Inspector.IsVisible) {
            Inspector.Hide();
        } else {
            if (!this._scene) {
                return;
            }

            Inspector.Show(this._scene, {
                globalRoot: this._renderContainer,
                overlay: true,
                gizmoCamera: this._scene.activeCamera ?? undefined,
                initialTab: DebugLayerTab.Statistics,
            });
        }
    }

    public toggleWireframe() {
        this._wireframeEnabled = !this._wireframeEnabled;
    }
}

