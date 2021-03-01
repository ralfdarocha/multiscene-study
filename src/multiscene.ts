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
}

class App {

    private readonly scenes: MyScene[] = [];
    private readonly container: HTMLElement = document.getElementById('container');
    private readonly renderer: WebGLRenderer = new WebGLRenderer({antialias: true});

    constructor() {
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.container.append(this.renderer.domElement);
        
        for (let i = 0; i < 6; i++) {
            const ratio = Math.random() * 1.1 + .5,
                  cube  = this.drawCube();
            this.scenes.push({
                ratio : ratio,
                scene : new Scene(),
                camera: new PerspectiveCamera(75, 1, 0.1, 1000),
                cube  : cube,
                height: Math.floor(this.container.clientWidth * ratio)
            })
            this.scenes[i].scene.add(cube);
            this.scenes[i].camera.position.z = 7;
        }

        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize();
        
        // ReRenders the scene
        this.reRenderScene();
    }

    private onResize() {
        const width = this.container.clientWidth;
        let size = 0;
        this.scenes.forEach(scene => {
            this.renderer.setSize(width, size);
            scene.height = Math.floor(width * scene.ratio);
            scene.camera.aspect = width / scene.height;
            scene.camera.updateProjectionMatrix();
            size += scene.height;
        });
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
        requestAnimationFrame(() => this.reRenderScene());
        this.scenes.forEach(scene => {
            scene.cube.rotation.x += 0.01;
            scene.cube.rotation.y += 0.01;
        });
        this.render();
    }

    private render():void {
        this.renderer.setScissorTest( false );
        this.renderer.clear();
        this.renderer.setScissorTest( true );

        let totalSize = 0;
        const h = this.container.clientHeight;
        const w = this.container.clientWidth;
        this.scenes.forEach((scene, i) => {
            totalSize += scene.height;
            this.renderer.setClearColor(i % 2 ? 0xe0e0e0 : 0xc0c0c0);
            this.renderer.setViewport(0, h - totalSize, w, scene.height);
            this.renderer.setScissor(0, h - totalSize, w, scene.height);
            this.renderer.render(scene.scene, scene.camera);
        });
    }


}

new App();