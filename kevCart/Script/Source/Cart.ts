namespace Script {
    import f = FudgeCore;
  
    export class Cart extends f.Node {
      
        constructor() {
  
            super("NewCart");
  
            this.addComponent(new f.ComponentTransform);
  
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshCart")));
            this.addComponent(new f.ComponentMaterial(
                new f.Material("mtrCart", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 0.3, 0, 1))))
            );
        
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(7);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(2);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(3);

            this.addComponent(new CartComponentScript);
        }
    }
}