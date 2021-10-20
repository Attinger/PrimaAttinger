"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let laserRotationSpeed = 50;
    let agentMoveSpeed = 0;
    let agentMaxMoveSpeed = 5;
    let agentAccelerationSpeed = 0.1;
    document.addEventListener("interactiveViewportStarted", start);
    let transform;
    let agentMove;
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        let laser = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser_one")[0];
        let agent = graph.getChildrenByName("Agent")[0].getChildrenByName("Agent_one")[0];
        transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;
        agentMove = agent.getComponent(ƒ.ComponentTransform).mtxLocal;
        viewport.camera.mtxPivot.translateZ(-45);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }
    function update(_event) {
        transform.rotateZ(laserRotationSpeed * ƒ.Loop.timeFrameReal / 1000);
        viewport.draw();
        ƒ.AudioManager.default.update();
        //Agent speed erhöhen bei Pfeiltaste nach oben oder W 
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])) {
            if (agentMoveSpeed < agentMaxMoveSpeed) {
                agentMoveSpeed += agentAccelerationSpeed;
            }
            agentMove.translateY(agentMoveSpeed * ƒ.Loop.timeFrameReal / 1000);
        }
        //Agent speed reduzieren bei Pfeiltaste nach oben oder W 
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])) {
            if (agentMoveSpeed < agentMaxMoveSpeed) {
                agentMoveSpeed += agentAccelerationSpeed;
            }
            agentMove.translateY(-agentMoveSpeed * ƒ.Loop.timeFrameReal / 1000);
        }
        if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])) {
            agentMoveSpeed = 0;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
            agentMove.rotateZ(-5);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
            agentMove.rotateZ(5);
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map