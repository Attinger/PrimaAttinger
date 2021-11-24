namespace Script {
    import f = FudgeCore;
    f.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  
    export class CartComponentScript extends f.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = f.Component.registerSubclass(CartComponentScript);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public message: string = "CartComponentScript added to ";
      public cartStartPosition: f.Vector3 = new f.Vector3(9,1,1);
      public cartMaxMovementSpeed: number = 20.0;
      public cartMaxTurnSpeed: number = 90;
      public cartControlForward: f.Control;
      public cartControlTurn: f.Control;
      public cartTransform: f.Matrix4x4;
  
      constructor() {
        super();
        this.cartControlForward = new f.Control("Forward", 1, f.CONTROL_TYPE.PROPORTIONAL);
        this.cartControlTurn = new f.Control("Turn", 1, f.CONTROL_TYPE.PROPORTIONAL);
        this.cartControlForward.setDelay(500);
  
        // Don't start when running in editor
        if (f.Project.mode == f.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
        this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
      }
  
  
      public create = () => {
        this.cartTransform = this.node.getComponent(f.ComponentTransform).mtxLocal;
        this.cartTransform.mutate({
            translation: this.cartStartPosition,
          });
        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
      }
  
  
      public update = (_event: Event) => {
        let forwardValue: number = (
          f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W])
        );
    
        let turnValue: number = (
          f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_RIGHT,f.KEYBOARD_CODE.D]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_LEFT,f.KEYBOARD_CODE.A])
        );
  
        this.cartControlForward.setInput(forwardValue);
        this.cartControlTurn.setInput(turnValue);
        this.cartTransform.rotateY(this.cartControlTurn.getOutput() * this.cartMaxTurnSpeed * f.Loop.timeFrameReal / 1000);
        this.cartTransform.translateX(this.cartControlForward.getOutput() * this.cartMaxMovementSpeed * f.Loop.timeFrameReal / 1000);
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