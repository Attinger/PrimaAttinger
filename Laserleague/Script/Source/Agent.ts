namespace LaserLeague {
    import f = FudgeCore;
    export class Agent extends f.Node {
      public healthValue: number = 1;
      public name: string = "Agent Smith";
      constructor() {
        super("NewAgent");
  
        this.addComponent(new f.ComponentTransform);
  
        this.addComponent(new f.ComponentMesh(new f.MeshSphere("MeshAgent")));
        this.addComponent(new f.ComponentMaterial(
          new f.Material("mtrAgent", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 0.3, 0, 1))))
        );
        
      this.getComponent(f.ComponentMesh).mtxPivot.scaleX(1);
      gameState.name = this.name;
      }
    }
  }