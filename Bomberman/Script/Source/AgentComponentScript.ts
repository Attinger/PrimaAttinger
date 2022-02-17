namespace Bomberman {
    import f = FudgeCore;
    f.Project.registerScriptNamespace(Bomberman);  // Register the namespace to FUDGE for serialization
  
    export class AgentComponentScript extends f.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = f.Component.registerSubclass(AgentComponentScript);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public message: string = "AgentComponentScript added to ";
      public agentMaxMovementSpeed: number = 1.5;
      public agentMaxTurnSpeed: number = 200;
      public agentControlForward: f.Control;
      public agentControlTurn: f.Control;
      public agentTransform: f.Matrix4x4;
      public agentRigibody: f.ComponentRigidbody;
      public bombTimeOut: number = 1500;
  
      constructor() {
        super();
        this.agentControlForward = new f.Control("Forward", 2, f.CONTROL_TYPE.PROPORTIONAL);
        this.agentControlTurn = new f.Control("Turn", 2, f.CONTROL_TYPE.PROPORTIONAL);
        this.agentControlForward.setDelay(10);
        this.agentControlTurn.setDelay(10);
  
        // Don't start when running in editor
        if (f.Project.mode == f.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
        this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
      }
  
  
      public create = () => {
        this.agentTransform = this.node.getComponent(f.ComponentTransform).mtxLocal;
        this.agentRigibody = this.node.getComponent(f.ComponentRigidbody);
        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
      }
  
  
      public update = (_event: Event) => {
        let turnValue: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT], [f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT]);
    
        let forwardValue: number = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.W, f.KEYBOARD_CODE.ARROW_UP], [f.KEYBOARD_CODE.S, f.KEYBOARD_CODE.ARROW_DOWN]);

        this.agentControlForward.setInput(forwardValue);
        this.agentControlTurn.setInput(turnValue);

        this.agentRigibody.setVelocity(new f.Vector3(this.agentControlForward.getOutput(),0, this.agentControlTurn.getOutput()));
        this.agentRigibody.setRotation(new f.Vector3(0,90,0));
      }
  
      // Activate the functions of this component as response to events
      public hndEvent = (_event: Event) => {
        switch (_event.type) {
          case f.EVENT.COMPONENT_ADD:
            f.Debug.log(this.message, this.node);
            this.create();
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