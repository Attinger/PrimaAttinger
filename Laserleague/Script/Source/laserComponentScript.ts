namespace LaserLeague {
    import f = FudgeCore;
    f.Project.registerScriptNamespace(LaserLeague);  // Register the namespace to FUDGE for serialization
  
    export class laserComponentScript extends f.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = f.Component.registerSubclass(laserComponentScript);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public message: string = "LaserComponentScript added to ";
      public laserRotationSpeed: number = 120;
    
      constructor() {
        super();
  
        // Don't start when running in editor
        if (f.Project.mode == f.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
        this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
      }

      public rotateLasers = (_event: Event) => {
        this.node.mtxLocal.rotateZ(this.laserRotationSpeed * f.Loop.timeFrameReal / 1000);
      }
  
      // Activate the functions of this component as response to events
      public hndEvent = (_event: Event) => {
        switch (_event.type) {
          case f.EVENT.COMPONENT_ADD:
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.rotateLasers);
            break;
          case f.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
            break;
        }
      }
  
      // protected reduceMutator(_mutator: f.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }