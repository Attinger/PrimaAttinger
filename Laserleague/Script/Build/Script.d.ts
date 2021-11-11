declare namespace LaserLeague {
    import f = FudgeCore;
    class Agent extends f.Node {
        healthValue: number;
        name: string;
        constructor();
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        name: string;
        health: number;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
    export let gameState: GameState;
    export class Hud {
        private static controller;
        static start(): void;
    }
    export {};
}
declare namespace LaserLeague {
}
declare namespace LaserLeague {
    import f = FudgeCore;
    class laserComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        laserRotationSpeed: number;
        constructor();
        rotateLasers: (_event: Event) => void;
        hndEvent: (_event: Event) => void;
    }
}
