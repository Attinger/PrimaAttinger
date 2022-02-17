declare namespace Bomberman {
    import f = FudgeCore;
    class Agent extends f.Node {
        constructor();
        explosion: (_event: any) => void;
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
        private blockPosition;
        constructor(xPos: number, yPos: number, destroyable: boolean, name: string);
        explosion: (_event: any) => void;
    }
}
declare namespace Bomberman {
    import f = FudgeCore;
    class Bomb extends f.Node {
        constructor(x: number, y: number, z: number);
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
    class DataEvent extends Event {
        private data;
        constructor(type: string, eventInitDict: EventInit, data: any);
        getData(): any;
    }
}
declare namespace Bomberman {
    import f = FudgeCore;
    class Flames extends f.Node {
        constructor(x: number, y: number, z: number, worldpos: f.Vector3);
    }
}
declare namespace Bomberman {
    import f = FudgeCore;
    class GameState extends f.Mutable {
        private static controller;
        private static instance;
        agentHealth: number;
        private constructor();
        static get(): GameState;
        gameOver(): void;
        pauseLoop(): void;
        protected reduceMutator(_mutator: f.Mutator): void;
    }
}
declare namespace Bomberman {
    import f = FudgeCore;
    let root: f.Node;
    let agent: Agent;
    let bomb: Bomb;
    let bombNode: f.Node;
    let theBomb: f.Node;
    let flame: Flames;
    let dBlockArray: f.Node[];
}
declare namespace Bomberman {
    import f = FudgeCore;
    class Npc extends f.Node {
        body: f.ComponentRigidbody;
        canPlaceBomb: boolean;
        npcDirection: f.Vector3;
        npcRotation: f.Vector3;
        constructor(x: number, y: number, z: number);
        changeDirection(): void;
        move(): void;
        placeBomb(): void;
        timeOut(): Promise<void>;
        private update;
        handleCollisionEnter(_event: f.EventPhysics): void;
    }
}
declare namespace Bomberman {
    import f = FudgeCore;
    import ƒAid = FudgeAid;
    enum JOB {
        START = 0,
        NEXT = 1,
        PLACEBOMB = 2,
        TURN = 3
    }
    export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        bombTimer: boolean;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static actStart;
        private static actNextMove;
        private static actPlacebomb;
        private static actTurn;
        private hndEvent;
        private update;
        handleCollisionEnter(_event: f.EventPhysics): void;
    }
    export {};
}
