namespace Bomberman {
    import f = FudgeCore;
    import ƒAid = FudgeAid;
    f.Project.registerScriptNamespace(Bomberman);  // Register the namespace to FUDGE for serialization
  
    enum JOB {
      IDLE, ESCAPE, DIE, RESPAWN
    }
  
    export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
      public static readonly iSubclass: number = f.Component.registerSubclass(StateMachine);
      private static instructions: ƒAid.StateMachineInstructions<JOB> = StateMachine.get();
      public forceEscape: number = 25;
      public torqueIdle: number = 5;
      //private cmpBody: ƒ.ComponentRigidbody;
  
  
      constructor() {
        super();
        this.instructions = StateMachine.instructions; // setup instructions with the static set
  
        // Don't start when running in editor
        if (f.Project.mode == f.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
        this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
        this.addEventListener(f.EVENT.NODE_DESERIALIZED, this.hndEvent);
      }
  
      public static get(): ƒAid.StateMachineInstructions<JOB> {
        let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
        setup.transitDefault = StateMachine.transitDefault;
        setup.actDefault = StateMachine.actDefault;
        setup.setAction(JOB.IDLE, <f.General>this.actIdle);
        setup.setAction(JOB.ESCAPE, <f.General>this.actEscape);
        setup.setAction(JOB.DIE, <f.General>this.actDie);
        setup.setAction(JOB.RESPAWN, <f.General>this.actRespawn);
        setup.setTransition(JOB.ESCAPE, JOB.DIE, <f.General>this.transitDie);
        return setup;
      }
  
      private static transitDefault(_machine: StateMachine): void {
        console.log("Transit to", _machine.stateNext);
      }
  
      private static async actDefault(_machine: StateMachine): Promise<void> {
        _machine.node.getComponent(f.ComponentRigidbody).applyForce(f.Vector3.X(1));
      }
  
      private static async actIdle(_machine: StateMachine): Promise<void> {
        _machine.node.getComponent(f.ComponentRigidbody).applyForce(f.Vector3.X(1));
      }
      private static async actEscape(_machine: StateMachine): Promise<void> {
      }
      private static async actDie(_machine: StateMachine): Promise<void> {
      }
  
      private static transitDie(_machine: StateMachine): void {
      }
  
      private static actRespawn(_machine: StateMachine): void {
      }
  
      // Activate the functions of this component as response to events
      private hndEvent = (_event: Event): void => {
        switch (_event.type) {
          case f.EVENT.COMPONENT_ADD:
            f.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            this.transit(JOB.IDLE);
            break;
          case f.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
            f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
            break;
          case ƒ.EVENT.NODE_DESERIALIZED:
            this.node.getComponent(f.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, (_event: ƒ.EventPhysics) => {
                console.log('test');
              });
              break;
        }
      }
  
      private update = (_event: Event): void => {
        this.act();
      }
  
  
  
      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }