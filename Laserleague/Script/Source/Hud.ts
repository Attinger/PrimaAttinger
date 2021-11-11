namespace LaserLeague {
    import ƒ = FudgeCore
    import ƒui = FudgeUserInterface;
  
    class GameState extends ƒ.Mutable {
        public name: string = "";
        public health: number = 1;
        protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
    }
  
    export let gameState: GameState = new GameState();
  
    export class Hud {
      private static controller: ƒui.Controller;
  
      public static start(): void {
        let domHud: HTMLDivElement = document.querySelector("#game--hud");
        Hud.controller = new ƒui.Controller(gameState, domHud);
        Hud.controller.updateUserInterface();
      }
    }
  }