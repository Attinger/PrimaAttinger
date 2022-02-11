namespace Bomberman {
    import f = FudgeCore;
  
    export class Bomb extends f.Node {


        constructor(x:number, y:number, z:number) {
  
            super("NewBomb");

            let bombPosition: f.Vector3 = new f.Vector3(Math.floor(x),y,Math.floor(z));
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
        
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(1);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(0.5);


            setTimeout(()=>{
                let bombPos = this.mtxLocal.translation;
                
                console.log(bombPos);
                this.removeComponent(this.getComponent(f.ComponentMaterial));
                for(let i = 1; i <= 1; i++) {
                    this.addChild(new Flames(i, 0, 0, 1));
                    this.addChild(new Flames(-i, 0, 0, 1));
                    this.addChild(new Flames(0, 0, i, 1));
                    this.addChild(new Flames(0, 0, -i, 1));
                }
                
            }, bombTimer);
        }
    }
}