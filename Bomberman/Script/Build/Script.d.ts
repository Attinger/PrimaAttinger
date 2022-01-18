declare namespace Bomberman {
    import f = FudgeCore;
    class Agent extends f.Node {
        constructor();
    }
}
declare namespace Bomberman {
    import f = FudgeCore;
    class AgentComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        agentMaxMovementSpeed: number;
        agentMaxTurnSpeed: number;
        agentControlForward: f.Control;
        agentControlTurn: f.Control;
        agentTransform: f.Matrix4x4;
        agentRigibody: f.ComponentRigidbody;
        bombTimeOut: number;
        constructor();
        create: () => void;
        update: (_event: Event) => void;
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Bomberman {
    import f = FudgeCore;
    class Block extends f.Node {
        constructor(xPos: number, yPos: number, destroyable: boolean, name: string);
    }
}
declare namespace Bomberman {
    import f = FudgeCore;
    class Bomb extends f.Node {
        private body;
        constructor(x: number, y: number, z: number, rotated: boolean);
        handleCollisionEnter(_event: f.EventPhysics): void;
    }
}
declare namespace Bomberman {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Bomberman {
    import f = FudgeCore;
    class GameState extends f.Mutable {
        private static controller;
        private static instance;
        mapSizeX: number;
        mapSizeY: number;
        mapSizeName: string;
        private constructor();
        static get(): GameState;
        protected reduceMutator(_mutator: f.Mutator): void;
    }
}
declare namespace Bomberman {
    import f = FudgeCore;
    let root: f.Node;
    let bombNode: f.Node;
    let dBlockArray: f.Node[];
}
