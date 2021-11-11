"use strict";
var LaserLeague;
(function (LaserLeague) {
    var f = FudgeCore;
    class Agent extends f.Node {
        healthValue = 1;
        name = "Agent Smith";
        constructor() {
            super("NewAgent");
            this.addComponent(new f.ComponentTransform);
            this.addComponent(new f.ComponentMesh(new f.MeshSphere("MeshAgent")));
            this.addComponent(new f.ComponentMaterial(new f.Material("mtrAgent", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 0.3, 0, 1)))));
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(1);
            LaserLeague.gameState.name = this.name;
        }
    }
    LaserLeague.Agent = Agent;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        name = "";
        health = 1;
        reduceMutator(_mutator) { }
    }
    LaserLeague.gameState = new GameState();
    class Hud {
        static controller;
        static start() {
            let domHud = document.querySelector("#game--hud");
            Hud.controller = new ƒui.Controller(LaserLeague.gameState, domHud);
            Hud.controller.updateUserInterface();
        }
    }
    LaserLeague.Hud = Hud;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let agent;
    let allLasers;
    let lasers;
    let root;
    let agentTransform;
    let agentMoveForward = new f.Control("Forward", 1, 0 /* PROPORTIONAL */);
    let agentMoveSide = new f.Control("Turn", 1, 0 /* PROPORTIONAL */);
    let agentMaxMoveSpeed = 5;
    let agentMaxTurnSpeed = 200;
    let agentStartPos = new f.Vector3(9, 1, 1);
    let hitSound;
    let gotHit = new f.Audio("./sound/hit.mp3");
    agentMoveForward.setDelay(500);
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        agent = new LaserLeague.Agent();
        root = graph.getChildrenByName("Agent")[0];
        allLasers = graph.getChildrenByName("Lasers")[0];
        hitSound = new f.ComponentAudio(gotHit, false, false);
        hitSound.connect(true);
        hitSound.volume = 30;
        agentTransform = agent.getComponent(f.ComponentTransform).mtxLocal;
        agentTransform.mutate({
            translation: agentStartPos,
        });
        root.addChild(agent);
        generateLaser().then(() => {
            lasers = graph.getChildrenByName("Lasers")[0].getChildrenByName("Lasers");
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        });
        LaserLeague.Hud.start();
        if (f.KEYBOARD_CODE.ENTER) {
            hitSound.play(true);
        }
        ;
        viewport.camera.mtxPivot.translateZ(-45);
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    async function generateLaser() {
        for (let yPos = -1; yPos <= 1; yPos += 2) {
            for (let xPos = -1; xPos <= 1; xPos++) {
                let graphLaser = FudgeCore.Project.resources["Graph|2021-10-28T13:21:46.352Z|48972"];
                let laser = await f.Project.createGraphInstance(graphLaser);
                let laserTranslate = new f.Vector3(xPos * 8, yPos * 6, 1);
                laser.getComponent(f.ComponentTransform).mtxLocal.mutate({
                    translation: laserTranslate,
                });
                allLasers.addChild(laser);
            }
        }
    }
    function update(_event) {
        let moveForwardValue = (f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W]) + f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S]));
        agentMoveForward.setInput(moveForwardValue);
        agentTransform.translateY(agentMoveForward.getOutput() * agentMaxMoveSpeed * f.Loop.timeFrameReal / 1000);
        let turnSideValue = (f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A]) + f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D]));
        agentMoveSide.setInput(turnSideValue);
        agentTransform.rotateZ(agentMoveSide.getOutput() * agentMaxTurnSpeed * f.Loop.timeFrameReal / 1000);
        viewport.draw();
        f.AudioManager.default.update();
        lasers.forEach(laser => {
            let laserBeams = laser.getChildrenByName("Laser_one")[0].getChildrenByName("Laserbeam");
            laserBeams.forEach(beam => {
                checkCollision(agent, beam);
            });
        });
    }
    function checkCollision(agent, beam) {
        let distance = f.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
        let x = beam.getComponent(f.ComponentMesh).mtxPivot.scaling.x / 2 + agent.radius;
        let y = beam.getComponent(f.ComponentMesh).mtxPivot.scaling.y + agent.radius;
        if (distance.x <= (x) && distance.x >= -(x) && distance.y <= y && distance.y >= 0) {
            hitSound.play(true);
            LaserLeague.gameState.health -= 0.02;
            agentTransform.mutate({
                translation: agentStartPos,
            });
        }
    }
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(LaserLeague); // Register the namespace to FUDGE for serialization
    class laserComponentScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(laserComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "LaserComponentScript added to ";
        laserRotationSpeed = 120;
        constructor() {
            super();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        rotateLasers = (_event) => {
            this.node.mtxLocal.rotateZ(this.laserRotationSpeed * f.Loop.timeFrameReal / 1000);
        };
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.rotateLasers);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
    }
    LaserLeague.laserComponentScript = laserComponentScript;
})(LaserLeague || (LaserLeague = {}));
//# sourceMappingURL=Script.js.map