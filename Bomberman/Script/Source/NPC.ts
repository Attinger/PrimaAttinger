namespace Bomberman {
    import f = FudgeCore;
  
    export class Npc extends f.Node {
        public body;
        //private direction: f.Vector3;
        public canPlaceBomb: boolean;
        public npcDirection: f.Vector3;
        public npcRotation: f.Vector3;
        
        constructor(x:number, y:number, z:number) {
  
            super("NewNpc");

            this.canPlaceBomb = true;

            let npcPosition: f.Vector3 = new f.Vector3(x,y,z);
            const cmpTransform: f.ComponentTransform = new f.ComponentTransform;

            this.npcDirection = new f.Vector3(1,0,0);
            this.npcRotation = new f.Vector3(0,0,0);
            
  
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshNpc")));
            this.addComponent(new f.ComponentMaterial(
                new f.Material("mtrNpc", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 0.3, 0, 1))))
            );

        
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(1);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(0.5);
            this.addComponent(cmpTransform);

            this.getComponent(f.ComponentTransform).mtxLocal.mutate({translation: npcPosition,});

            this.body = new f.ComponentRigidbody(1,f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
            this.body.initialization = f.BODY_INIT.TO_MESH;
            this.body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.handleCollisionEnter);
            this.addComponent(this.body);
            this.addComponent(new StateMachine); 

            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
        }

        public changeDirection():void {
            if(this.npcDirection.x > 0) {
                this.npcDirection =  new f.Vector3(0,0,2);
              }
            else if(this.npcDirection.z > 0) {
             this.npcDirection =  new f.Vector3(-2,0,0);
            }
            else if(this.npcDirection.x < 0) {
                this.npcDirection =  new f.Vector3(0,0,-2);
            }
            else if(this.npcDirection.z < 0) {
                this.npcDirection =  new f.Vector3(2,0,0);
            }

            this.npcDirection =  new f.Vector3(this.npcDirection.x,this.npcDirection.y,this.npcDirection.z);       
        }

        public move(): void {
            this.body.setVelocity(this.npcDirection);
        }

        public placeBomb() {
            if(this.canPlaceBomb){
                const npcPos = this.getComponent(f.ComponentTransform).mtxLocal.translation;
                const x = new Bomb(npcPos.x,npcPos.y,npcPos.z);
                const y = root.getChildrenByName("Bomb")[0];
                y.addChild(x);
                this.canPlaceBomb = false;
                this.timeOut();
            }
           
            //this.timeOut();
        }

        public async timeOut() {
            setTimeout(() => {
                this.canPlaceBomb = true;
            }, 1000);
        }

        private update = (_event: Event): void => {
            this.body.setRotation(this.npcRotation);
        }

        public handleCollisionEnter(_event: f.EventPhysics): void {
            console.log(_event.cmpRigidbody.node.name);
            //this.collisions.forEach( (element: any) => {
                //console.log(element);
               // this.direction = ƒ.Vector3.DIFFERENCE(element.node.getComponent(f.Component).mtxWorld.translation, this.node.getComponent(f.ComponentTransform).mtxWorld.translation);
               // if(element.node.name === 'Wall') {
                   // this.direction = -this.direction;
                //}
               // console.log(this.direction)
            //});
        }

        //public update = (_event: Event) => {
            //this.body.applyForce(new f.Vector3(this.direction));
        //}
    }
}