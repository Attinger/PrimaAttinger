namespace Bomberman {
    import f = FudgeCore;
  
    export class Agent extends f.Node {
        constructor() {
  
            super("NewAgent");

            let agentPosition: f.Vector3 = new f.Vector3(1,1,1);
            const cmpTransform: f.ComponentTransform = new f.ComponentTransform;
            
  
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshAgent")));
            this.addComponent(new f.ComponentMaterial(
                new f.Material("mtrAgent", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 0.3, 0, 1))))
            );
        
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(1);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.rotateY(90);
            this.addComponent(cmpTransform);
            const body = new f.ComponentRigidbody(0.1,f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
            body.initialization = f.BODY_INIT.TO_MESH;
            this.addComponent(body);


            this.getComponent(f.ComponentTransform).mtxLocal.mutate({translation: agentPosition,});
            this.addComponent(new AgentComponentScript);
        }
    }
}