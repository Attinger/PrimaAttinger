namespace Bomberman {
    import f = FudgeCore;
    import fui = FudgeUserInterface;
  
    export class GameState extends f.Mutable {
      private static controller: fui.Controller;
      private static instance: GameState;
      public agentHealth: number;

      private constructor() {
        super();
        let domHud: HTMLDivElement = document.querySelector("#ui");
        GameState.instance = this;
        GameState.controller = new fui.Controller(this, domHud);
        console.log("Hud-Controller", GameState.controller);
      }
  
      public static get(): GameState {
        return GameState.instance || new GameState();
      }

      public gameOver() {
        this.pauseLoop();
        document.querySelector('.endscreen--loose').classList.remove('hidden');
      }

      public pauseLoop(): void  {
        f.Loop.stop();
      }
  
      protected reduceMutator(_mutator: f.Mutator): void {/* */ }
    }
  }