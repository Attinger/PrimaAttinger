namespace Bomberman {
    import f = FudgeCore;
  
    export class Bomb extends f.Node {
        private body: any;

        constructor(x:number, y:number, z:number, rotated: boolean) {
  
            super("NewBomb");

            let bombPosition: f.Vector3 = new f.Vector3(x,y,z);
            let bombRotation: f.Vector3 = new f.Vector3(0,90,0);
            let bombTimer: number = 1000;
            const cmpTransform = new f.ComponentTransform;

            let bombTexture: f.TextureImage = new f.TextureImage();
            bombTexture.load("../assets/bomb.png");
            let bombCoat: f.CoatTextured = new f.CoatTextured(new f.Color(255,255,255,255), bombTexture);

            let explosionTexture: f.TextureImage = new f.TextureImage();
            explosionTexture.load("../assets/explosion.png");

            
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshBombX")));
            this.addComponent(new f.ComponentMaterial(new f.Material("Texture",f.ShaderTextureFlat,bombCoat)));

            this.addComponent(cmpTransform);

            this.getComponent(f.ComponentTransform).mtxLocal.mutate({translation: bombPosition,});
            if(rotated) {
                this.getComponent(f.ComponentTransform).mtxLocal.mutate({rotation: bombRotation,});
            } 
        
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(1);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(0.5);

            setTimeout(()=>{
                this.getComponent(f.ComponentMaterial).material.coat = new f.CoatTextured(new f.Color(255,255,255,255), explosionTexture);
                this.getComponent(f.ComponentMesh).mtxPivot.scaleX(7);
                this.body = new f.ComponentRigidbody(1,f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
                this.body.initialization = f.BODY_INIT.TO_MESH;
                this.body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.handleCollisionEnter);
                this.addComponent(this.body);

                setTimeout(() => {
                    this.removeComponent(this.getComponent(f.ComponentRigidbody));
                    this.getParent().removeChild(this);
                }, 1000);
            }, bombTimer);
        }

        public handleCollisionEnter(_event: f.EventPhysics): void { 
            let blockFly: f.Vector3 = new f.Vector3(0,10,15);   
            if(_event.cmpRigidbody.node.name === "NewAgent"){
                //TODO: Add gamestate -1health
                console.log('aua');
            }

            dBlockArray.forEach(element => {
                if(element === _event.cmpRigidbody.node) {
                    element.getComponent(f.ComponentTransform).mtxLocal.mutate({translation: blockFly,});
                }
            });
        }
    }
}