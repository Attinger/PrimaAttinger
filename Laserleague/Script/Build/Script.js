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
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let agent;
    let laser;
    let laserRotationSpeed = 125;
    let agentTransform;
    let agentMoveForward = new f.Control("Forward", 1, 0 /* PROPORTIONAL */);
    let agentMoveSide = new f.Control("Turn", 1, 0 /* PROPORTIONAL */);
    let agentMaxMoveSpeed = 5;
    let agentMaxTurnSpeed = 200;
    let agentStartPos = new f.Vector3(-5, -3, 1);
    agentMoveForward.setDelay(500);
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        laser = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser_one")[0];
        let allAgents = graph.getChildrenByName("Agent");
        agent = allAgents[0].getChildrenByName("Agent_one")[0];
        agentTransform = agent.getComponent(f.ComponentTransform).mtxLocal;
        //let laserTransform = laser.getComponent(f.ComponentTransform).mtxLocal;
        viewport.camera.mtxPivot.translateZ(-45);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        //laserTransform.rotateZ(laserRotationSpeed * f.Loop.timeFrameReal / 1000);
        let moveForwardValue = (f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W]) + f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S]));
        agentMoveForward.setInput(moveForwardValue);
        agentTransform.translateY(agentMoveForward.getOutput() * agentMaxMoveSpeed * f.Loop.timeFrameReal / 1000);
        let turnSideValue = (f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A]) + f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D]));
        agentMoveSide.setInput(turnSideValue);
        agentTransform.rotateZ(agentMoveSide.getOutput() * agentMaxTurnSpeed * f.Loop.timeFrameReal / 1000);
        let laserbeams = laser.getChildrenByName("Laserbeam");
        laserbeams.forEach(beam => {
            beam.getComponent(f.ComponentTransform).mtxLocal.rotateZ(laserRotationSpeed * f.Loop.timeFrameReal / 1000);
            checkCollision(agent, beam);
        });
        viewport.draw();
        f.AudioManager.default.update();
    }
    function checkCollision(agent, beam) {
        let distance = f.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
        let x = beam.getComponent(f.ComponentMesh).mtxPivot.scaling.x / 2 + agent.radius;
        let y = beam.getComponent(f.ComponentMesh).mtxPivot.scaling.y + agent.radius;
        if (distance.x <= (x) && distance.x >= -(x) && distance.y <= y && distance.y >= 0) {
            agentTransform.translate(f.Vector3.TRANSFORMATION(agentStartPos, agent.mtxWorldInverse, true));
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map