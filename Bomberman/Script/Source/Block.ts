namespace Bomberman {
    import f = FudgeCore;

    export class Block extends f.Node {
        private blockPosition: f.Vector3;
        constructor(xPos:number, yPos:number, destroyable: boolean, name: string) {
        super(name);
        
        this.blockPosition = new f.Vector3(xPos,1,yPos);

        const cmpTransform: f.ComponentTransform = new f.ComponentTransform;

  
        this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshBlock")));
        let blockTexture: f.TextureImage = new f.TextureImage();
        blockTexture.load("../assets/basic-block.jpg");
        let coat: f.CoatTextured = new f.CoatTextured(new f.Color(255,255,255,255), blockTexture);

        let destoryableTexture: f.TextureImage = new f.TextureImage();
        destoryableTexture.load("../assets/destroyable-block.jpg");
        let coatDestroy: f.CoatTextured = new f.CoatTextured(new f.Color(255,255,255,255), destoryableTexture);
        if(!destroyable) {
          this.addComponent(new f.ComponentMaterial(new f.Material("Texture",f.ShaderTextureFlat,coat)));
          const body = new f.ComponentRigidbody(1,f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
          body.initialization = f.BODY_INIT.TO_MESH;
          this.addComponent(body);
        } else {
          const body = new f.ComponentRigidbody(1,f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
          body.initialization = f.BODY_INIT.TO_MESH;
          this.addComponent(body);
          this.addComponent(new f.ComponentMaterial(new f.Material("Texture",f.ShaderTextureFlat,coatDestroy)));
        }
        
        this.addComponent(cmpTransform);

        this.getComponent(f.ComponentTransform).mtxLocal.mutate({translation: this.blockPosition,});
      }

    }
  }