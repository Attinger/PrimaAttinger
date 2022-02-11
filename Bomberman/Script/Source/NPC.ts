namespace Bomberman {
    import f = FudgeCore;
  
    export class Npc extends f.Node {
        constructor(x:number, y:number, z:number) {
  
            super("NewNpc");

            let npcPosition: f.Vector3 = new f.Vector3(x,y,z);
            const cmpTransform: f.ComponentTransform = new f.ComponentTransform;
            
  
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshNpc")));
            this.addComponent(new f.ComponentMaterial(
                new f.Material("mtrNpc", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 0.3, 0, 1))))
            );

        
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(1);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.rotateY(90);
            this.addComponent(cmpTransform);

            this.getComponent(f.ComponentTransform).mtxLocal.mutate({translation: npcPosition,});
            const body = new f.ComponentRigidbody(0.5,f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.PYRAMID, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
            body.initialization = f.BODY_INIT.TO_MESH;
            this.addComponent(body);
            this.addComponent(new StateMachine);

            //this.addComponent(new stateMachineScript);
        }
    }
}