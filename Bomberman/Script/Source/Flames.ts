namespace Bomberman {
    import f = FudgeCore;
  
    export class Flames extends f.Node {
        private body: f.ComponentRigidbody;

        constructor(x:number, y:number, z:number, scale: number) {
  
            super("Flame");

            console.log(scale);

            let flamePosition: f.Vector3 = new f.Vector3(x,y,z);
            let flameTimer: number = 1000;
            const cmpTransform = new f.ComponentTransform;

            let explosionTexture: f.TextureImage = new f.TextureImage();
            explosionTexture.load("../assets/explosion.png");
            let explosionCoat: f.CoatTextured = new f.CoatTextured(new f.Color(255,255,255,255), explosionTexture);
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshFlameX")));
            this.addComponent(new f.ComponentMaterial(new f.Material("Texture",f.ShaderTextureFlat,explosionCoat)));
            this.addComponent(cmpTransform);
            this.body = new f.ComponentRigidbody(1,f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
            this.body.initialization = f.BODY_INIT.TO_MESH;
            this.body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.handleCollisionEnter);
            this.addComponent(this.body);
            this.body.setPosition(new f.Vector3(x,y,z));
                
            this.cmpTransform.mtxLocal.mutate({translation: flamePosition});

            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(1);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(1);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(1);

            setTimeout(()=>{
                this.removeComponent(this.getComponent(f.ComponentRigidbody));
                this.getParent().removeChild(this);
            }, flameTimer);
        }

        public handleCollisionEnter(_event: f.EventPhysics): void { 

            console.log(this);


            //this.collisions.forEach((elem: any)=> {
               // console.log(elem.node.name);
              //  if(elem.node.name == "DBlock") {
                  //  const test = elem.node;
                  //  test.removeComponent(elem);
                   // test.getParent().removeChild(test);
                   // const flame = this.node;
                   // flame.removeComponent(this);
              //      flame.getParent().removeChild(flame);
               // }

               // if(elem.node.name == "Wall") {
                   // const flame = this.node;
                  //  flame.removeComponent(this);
                  //  flame.getParent().removeChild(flame);
               // }
            //})
        }
    }
}