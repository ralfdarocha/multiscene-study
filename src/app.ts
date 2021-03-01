import { 
    BoxGeometry, 
    Color, 
    Mesh, 
    MeshBasicMaterial, 
    PerspectiveCamera, 
    Scene, 
    WebGLRenderer 
} from 'three';

type MyScene = {
    scene: Scene
    cube: Mesh
    camera: PerspectiveCamera
    ratio: number
    height: number
    canvas?: HTMLCanvasElement
    ctx?: CanvasRenderingContext2D
}

class App {

    private bigCanvas = true;
    private readonly animating = false;
    private readonly scenes: MyScene[] = [];
    private readonly container: HTMLElement = document.getElementById('container');
    private readonly button: HTMLElement = document.getElementById('btn');
    private readonly renderer: WebGLRenderer = new WebGLRenderer({antialias: true});

    constructor() {
        window.addEventListener('resize', this.onResize.bind(this));
        this.start();

        this.button.addEventListener('click', () => {
            this.button.innerText = this.bigCanvas ? 'Toggle to multi canvas' : 'Toggle to single canvas';
            this.clean();
            this.bigCanvas = !this.bigCanvas;
            this.start();
        });
        this.button.innerText = this.bigCanvas ? 'Toggle to multi canvas' : 'Toggle to single canvas';
        
    }

    private start() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.bigCanvas) {
            this.container.append(this.renderer.domElement);
        }

        for (let i = 0; i < 50; i++) {
            const ratio = Math.random() * .8 + .5,
                  cube  = this.drawCube(),
                  scene:MyScene = {
                    ratio : ratio,
                    scene : new Scene(),
                    camera: new PerspectiveCamera(75, 1, 0.1, 1000),
                    cube  : cube,
                    height: Math.floor(this.container.clientWidth * ratio),
                  };
            if (!this.bigCanvas) {
                const canvas = document.createElement('canvas');
                canvas.id = `canvas${i}`
                this.container.appendChild(canvas);
                scene.canvas = canvas;
                scene.ctx = canvas.getContext('2d');
            }
            this.scenes.push(scene)

            this.scenes[i].scene.add(cube);
            this.scenes[i].cube.rotation.x += 15;
            this.scenes[i].cube.rotation.y += 15;
            this.scenes[i].camera.position.z = 5;
        }

        this.onResize();
        
        // ReRenders the scene
        this.reRenderScene();
    }

    private onResize() {
        const width = this.container.clientWidth;
        let size = 0;
        this.scenes.forEach(scene => {
            scene.height = Math.floor(width * scene.ratio);
            if (this.bigCanvas) {
                size += scene.height;
                this.renderer.setSize(width, size);
            } else {
                scene.canvas.width = width;
                scene.canvas.height = scene.height;
            }
            scene.camera.aspect = width / scene.height;
            scene.camera.updateProjectionMatrix();
        });
        if (!this.animating) {
            this.render();
        }
    }   

    private generateColor(): Color {
        return new Color(Math.random(), Math.random(), Math.random());
    }

    private drawCube (): Mesh {
        const geometry:BoxGeometry = new BoxGeometry(1,1,1);
        const colors = [this.generateColor(), this.generateColor(), this.generateColor()];
        
        colors.forEach((color:Color, index:number) => {
            geometry.faces[4 * index].color = color;
            geometry.faces[4 * index + 1].color = color;
            geometry.faces[4 * index + 2].color = color;
            geometry.faces[4 * index + 3].color = color;
        });

        const material:MeshBasicMaterial = new MeshBasicMaterial({ color: 0xffffff, vertexColors: true } );
        const cube:Mesh = new Mesh( geometry, material );

        cube.position.z = .5;        
        return cube;
    }


    private reRenderScene ():void {
        if (this.animating) {
            requestAnimationFrame(() => this.reRenderScene());
        }
        this.scenes.forEach(scene => {
            scene.cube.rotation.x += 0.01;
            scene.cube.rotation.y += 0.01;
        });
        this.render();
    }

    private render():void {
        if (this.bigCanvas) {
            this.renderer.setScissorTest(false);
            this.renderer.clear();
            this.renderer.setScissorTest(true);
        }

        let totalSize = 0;
        const h = this.container.clientHeight,
              w = this.container.clientWidth;
        this.scenes.forEach((scene, i) => {
            if (this.bigCanvas) {
                totalSize += scene.height;
                this.renderer.setClearColor(i % 2 ? 0xe0e0e0 : 0xc0c0c0);
                this.renderer.setViewport(0, h - totalSize, w, scene.height);
                this.renderer.setScissor(0, h - totalSize, w, scene.height);
                this.renderer.render(scene.scene, scene.camera);
            } else {
                this.renderer.clear();
                this.renderer.setClearColor(i % 2 ? 0xe0e0e0 : 0xc0c0c0);
                this.renderer.setSize(w, scene.height);
                this.renderer.render(scene.scene, scene.camera);
                scene.ctx.drawImage(this.renderer.domElement, 0, 0);
            }
        });
    }

    private clean() {
        this.renderer.clear();
        this.container.innerHTML = "";
        this.scenes.length = 0;
        this.renderer.setScissorTest(false);
    }

}

new App();