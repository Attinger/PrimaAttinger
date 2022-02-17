namespace Bomberman {
    import f = FudgeCore;
    import ƒAid = FudgeAid;
    f.Project.registerScriptNamespace(Bomberman);  // Register the namespace to FUDGE for serialization

    enum JOB {
      START, NEXT, PLACEBOMB, TURN
    }

    export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
      public static readonly iSubclass: number = f.Component.registerSubclass(StateMachine);
      private static instructions: ƒAid.StateMachineInstructions<JOB> = StateMachine.get();
      public bombTimer: boolean;
      
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
        //setup.setAction(JOB.START, <f.General>this.actStart);
        setup.setAction(JOB.START, <f.General>this.actStart);
        setup.setAction(JOB.NEXT, <f.General>this.actNextMove);
        setup.setAction(JOB.PLACEBOMB, <f.General>this.actPlacebomb);
        setup.setAction(JOB.TURN, <f.General>this.actTurn);
        return setup;
      }

      private static actStart(_machine: StateMachine): void {
        const node: Npc = <Npc>_machine.node;
        node.move();
        _machine.transit(JOB.NEXT);
      }

      private static actNextMove(_machine: StateMachine): void {
       _machine.node.body.collisions.forEach(element => {
          switch (element.node.name) {
            case "DBlock":
              //console.log('DBBLOCK');
              _machine.transit(JOB.PLACEBOMB);
              break;

            case "Wall":      
              _machine.transit(JOB.TURN);
              break;

              case "NewNpc":      
              _machine.transit(JOB.PLACEBOMB);
              break;

              case "NewAgent":      
              _machine.transit(JOB.PLACEBOMB);
              break;
          
            default:
              _machine.transit(JOB.START);
              break;
          }
        });
      } 

      private static  actPlacebomb(_machine: StateMachine): void{
        const nodePos: f.Vector3 = _machine.node.body.getPosition();
        _machine.node.body.setPosition(new f.Vector3(Math.round(nodePos.x), nodePos.y, Math.round(nodePos.z)));
        //console.log(nodePos.y);
        const node: Npc = <Npc>_machine.node;
        node.placeBomb();
        _machine.transit(JOB.TURN);
      }

      private static actTurn(_machine: StateMachine): void  {
          const nodePos: f.Vector3 = _machine.node.body.getPosition();
          _machine.node.body.setPosition(new f.Vector3(Math.round(nodePos.x), nodePos.y, Math.round(nodePos.z)));
          const node: Npc = <Npc>_machine.node;
          node.changeDirection();
          _machine.transit(JOB.START);
        }


      // Activate the functions of this component as response to events
      private hndEvent = (_event: Event): void => {
        switch (_event.type) {
          case f.EVENT.COMPONENT_ADD:
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
            this.node.body.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.handleCollisionEnter);
            this.bombTimer = true;
            this.transit(JOB.START);
            break;
          case f.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(f.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(f.EVENT.COMPONENT_REMOVE, this.hndEvent);
            f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
            break;
        }
      }

      private update = (_event: Event): void => {
        //this.node.body.applyForce(this.rotation);
        this.act();
      }

      public handleCollisionEnter(_event: f.EventPhysics): void {
        //console.log(_event.cmpRigidbody.node.name);
      }

      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }
