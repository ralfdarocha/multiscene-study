import { 
    BoxGeometry, 
    Color, 
    Mesh, 
    MeshBasicMaterial, 
    PerspectiveCamera, 
    Scene, 
    WebGLRenderer 
} from 'three';


class App {

    private readonly cubes: Mesh[] = [];
    private readonly scene = new Scene();
    private readonly cameras: PerspectiveCamera[] = [];
    private readonly renderer = new WebGLRenderer({antialias: true});

    constructor() {
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.renderer.domElement);
        
        for(let i=0; i<6; i++) {
            this.cameras.push(new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
            this.drawCube(i);
            this.cameras[i].position.x = i * 4;
            this.cameras[i].position.z = 2;
        }

        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize();
        
        // ReRenders the scene
        this.reRenderScene();
    }

    private onResize() {
        const aspect = (window.innerWidth / 3) / (window.innerHeight / 2);
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.cameras.forEach(camera => {
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
        });
    }

    private generateColor(): Color {
        return new Color(Math.random(), Math.random(), Math.random());
      }

    private drawCube (i: number):void {
        const geometry = new BoxGeometry(1,1,1);
        const colors = [this.generateColor(), this.generateColor(), this.generateColor()];
        
        colors.forEach((color:Color, index:number) => {
            geometry.faces[4 * index].color = color;
            geometry.faces[4 * index + 1].color = color;
            geometry.faces[4 * index + 2].color = color;
            geometry.faces[4 * index + 3].color = color;
        });

        const material:MeshBasicMaterial = new MeshBasicMaterial({ color: 0xffffff, vertexColors: true } );
        const cube:Mesh = new Mesh( geometry, material );
        cube.position.x = i * 4
        cube.position.z = .5;
        this.scene.add(cube);
        this.cubes.push(cube);
    }


    private reRenderScene ():void {
        requestAnimationFrame(() => this.reRenderScene());
        this.cubes.forEach(cube => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        });
        this.render();
    }

    private render():void {
        this.renderer.setScissorTest( false );
        this.renderer.clear();

        this.renderer.setClearColor( 0xe0e0e0 );
        this.renderer.setScissorTest( true );

        let row = 0, col = 0;
        const rows = 2;
        const cols = 3;
        const w = window.innerWidth / cols;
        const h = window.innerHeight / rows;

        for (let i = 0; i < this.cubes.length; i++ ) {
            this.renderer.setViewport(col * w, row * h, w, h );
            this.renderer.setScissor(col * w, row * h, w, h );
            this.renderer.render(this.scene, this.cameras[i]);
            if ((i + 1) % cols == 0) {
                row++;
            }
            col = ((i + 1) % cols == 0) ? 0 : col + 1
        };
    }


}

new App();