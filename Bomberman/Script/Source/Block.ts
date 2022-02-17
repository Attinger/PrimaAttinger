namespace Bomberman {
    import f = FudgeCore;

    export class Block extends f.Node {
        private blockPosition: f.Vector3;
        constructor(xPos:number, yPos:number, destroyable: boolean, name: string) {
        super(name);
        
        this.blockPosition = new f.Vector3(xPos,1,yPos);

        const cmpTransform: f.ComponentTransform = new f.ComponentTransform;

  
        this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshBlock")));

        if(!destroyable) {
          this.addComponent(new ƒ.ComponentMaterial(
            new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.1, 0, 3, 2))))
          );
          const body = new f.ComponentRigidbody(1,f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
          body.initialization = f.BODY_INIT.TO_MESH;
          this.addComponent(body);
        } else {
          const body = new f.ComponentRigidbody(1,f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
          body.initialization = f.BODY_INIT.TO_MESH;
          this.addComponent(body);
          this.addComponent(new ƒ.ComponentMaterial(
            new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1))))
          );
          root.addEventListener("bombExploded", this.explosion);
        }

        
        this.addComponent(cmpTransform);

        this.getComponent(f.ComponentTransform).mtxLocal.mutate({translation: this.blockPosition,});
      }

      public explosion = (_event: any)  => {
        const flamePos: f.Vector3 = new f.Vector3(_event.data.x, _event.data.y, _event.data.z);
        if(this.getComponent(f.ComponentRigidbody) != undefined) {
          if(flamePos.equals(this.mtxWorld.translation, 0.1)) {
            this.removeComponent(this.getComponent(f.ComponentRigidbody));
            this.getParent().removeChild(this);
          }
        }
      }
    }
  }