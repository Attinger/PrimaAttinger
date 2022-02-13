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
        constructor(x: number, y: number, z: number, scale: number, worldpos: f.Vector3);
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
    let theBomb: f.Node;
    let flame: Flames;
    let dBlockArray: f.Node[];
}
declare namespace Bomberman {
    import f = FudgeCore;
    class Npc extends f.Node {
        constructor(x: number, y: number, z: number);
    }
}
declare namespace Bomberman {
    import ƒAid = FudgeAid;
    enum JOB {
        IDLE = 0,
        ESCAPE = 1,
        DIE = 2,
        RESPAWN = 3
    }
    export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        forceEscape: number;
        torqueIdle: number;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static transitDefault;
        private static actDefault;
        private static actIdle;
        private static actEscape;
        private static actDie;
        private static transitDie;
        private static actRespawn;
        private hndEvent;
        private update;
    }
    export {};
}
