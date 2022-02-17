namespace Bomberman {
    import f = FudgeCore;
  
    export class Flames extends f.Node {

        constructor(x:number, y:number, z:number, worldpos: f.Vector3) {
  
            super("Flame");

            //console.log(scale);

            let flamePosition: f.Vector3 = new f.Vector3(x,y,z);
            let flameTimer: number = 1000;
            const cmpTransform: f.ComponentTransform = new f.ComponentTransform;

            let explosionTexture: f.TextureImage = new f.TextureImage();
            explosionTexture.load("../assets/explosion.png");
            let explosionCoat: f.CoatTextured = new f.CoatTextured(new f.Color(255,255,255,255), explosionTexture);
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshFlameX")));
            this.addComponent(new f.ComponentMaterial(new f.Material("Texture",f.ShaderTextureFlat,explosionCoat)));
            this.addComponent(cmpTransform);
            this.cmpTransform.mtxLocal.mutate({translation: flamePosition});

            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(0.9);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(0.01);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(0.9);

            let bombExplosion = new DataEvent("bombExploded", {"bubbles": true, "cancelable":false}, new f.Vector3(worldpos.x + flamePosition.x, worldpos.y + flamePosition.y, worldpos.z + flamePosition.z));
            root.dispatchEvent(bombExplosion);

            setTimeout(()=>{
                this.getParent().removeChild(this);
            }, flameTimer);
        }
    }
}