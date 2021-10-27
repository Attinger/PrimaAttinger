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
declare namespace Script {
    import f = FudgeCore;
    class LaserComponentScript extends f.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        laserRotationSpeed: number;
        constructor();
        rotateLasers: (_event: Event) => void;
        hndEvent: (_event: Event) => void;
    }
}
