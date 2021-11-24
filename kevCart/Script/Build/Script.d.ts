declare namespace Script {
    import f = FudgeCore;
    class Cart extends f.Node {
        constructor();
    }
}
declare namespace Script {
    import f = FudgeCore;
    class CartComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        cartStartPosition: f.Vector3;
        cartMaxMovementSpeed: number;
        cartMaxTurnSpeed: number;
        cartControlForward: f.Control;
        cartControlTurn: f.Control;
        cartTransform: f.Matrix4x4;
        constructor();
        create: () => void;
        update: (_event: Event) => void;
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
}
