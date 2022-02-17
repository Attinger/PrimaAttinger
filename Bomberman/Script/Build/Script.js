"use strict";
var Bomberman;
(function (Bomberman) {
    var f = FudgeCore;
    class Agent extends f.Node {
        constructor() {
            super("NewAgent");
            let agentPosition = new f.Vector3(1, 1, 1);
            const cmpTransform = new f.ComponentTransform;
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshAgent")));
            this.addComponent(new f.ComponentMaterial(new f.Material("mtrAgent", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 0.3, 0, 1)))));
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(1);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.rotateY(90);
            this.addComponent(cmpTransform);
            const body = new f.ComponentRigidbody(0.1, f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
            body.initialization = f.BODY_INIT.TO_MESH;
            this.addComponent(body);
            Bomberman.root.addEventListener("bombExploded", this.explosion);
            this.getComponent(f.ComponentTransform).mtxLocal.mutate({ translation: agentPosition, });
            this.addComponent(new Bomberman.AgentComponentScript);
            Bomberman.GameState.get().agentHealth = 2;
        }
        explosion = (_event) => {
            const flamePos = new f.Vector3(_event.data.x, _event.data.y, _event.data.z);
            if (flamePos.equals(this.mtxWorld.translation, 0.5)) {
                Bomberman.GameState.get().agentHealth -= 1;
                if (Bomberman.GameState.get().agentHealth == 0) {
                    Bomberman.GameState.get().gameOver();
                }
            }
        };
    }
    Bomberman.Agent = Agent;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(Bomberman); // Register the namespace to FUDGE for serialization
    class AgentComponentScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(AgentComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "AgentComponentScript added to ";
        agentMaxMovementSpeed = 1.5;
        agentMaxTurnSpeed = 200;
        agentControlForward;
        agentControlTurn;
        agentTransform;
        agentRigibody;
        bombTimeOut = 1500;
        constructor() {
            super();
            this.agentControlForward = new f.Control("Forward", 2, 0 /* PROPORTIONAL */);
            this.agentControlTurn = new f.Control("Turn", 2, 0 /* PROPORTIONAL */);
            this.agentControlForward.setDelay(10);
            this.agentControlTurn.setDelay(10);
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        create = () => {
            this.agentTransform = this.node.getComponent(f.ComponentTransform).mtxLocal;
            this.agentRigibody = this.node.getComponent(f.ComponentRigidbody);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        };
        update = (_event) => {
            let turnValue = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT], [f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT]);
            let forwardValue = f.Keyboard.mapToTrit([f.KEYBOARD_CODE.W, f.KEYBOARD_CODE.ARROW_UP], [f.KEYBOARD_CODE.S, f.KEYBOARD_CODE.ARROW_DOWN]);
            this.agentControlForward.setInput(forwardValue);
            this.agentControlTurn.setInput(turnValue);
            this.agentRigibody.setVelocity(new f.Vector3(this.agentControlForward.getOutput(), 0, this.agentControlTurn.getOutput()));
            this.agentRigibody.setRotation(new f.Vector3(0, 90, 0));
        };
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    f.Debug.log(this.message, this.node);
                    this.create();
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
    }
    Bomberman.AgentComponentScript = AgentComponentScript;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var f = FudgeCore;
    class Block extends f.Node {
        blockPosition;
        constructor(xPos, yPos, destroyable, name) {
            super(name);
            this.blockPosition = new f.Vector3(xPos, 1, yPos);
            const cmpTransform = new f.ComponentTransform;
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshBlock")));
            if (!destroyable) {
                this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0.1, 0, 3, 2)))));
                const body = new f.ComponentRigidbody(1, f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
                body.initialization = f.BODY_INIT.TO_MESH;
                this.addComponent(body);
            }
            else {
                const body = new f.ComponentRigidbody(1, f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
                body.initialization = f.BODY_INIT.TO_MESH;
                this.addComponent(body);
                this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)))));
                Bomberman.root.addEventListener("bombExploded", this.explosion);
            }
            this.addComponent(cmpTransform);
            this.getComponent(f.ComponentTransform).mtxLocal.mutate({ translation: this.blockPosition, });
        }
        explosion = (_event) => {
            const flamePos = new f.Vector3(_event.data.x, _event.data.y, _event.data.z);
            if (this.getComponent(f.ComponentRigidbody) != undefined) {
                if (flamePos.equals(this.mtxWorld.translation, 0.1)) {
                    this.removeComponent(this.getComponent(f.ComponentRigidbody));
                    this.getParent().removeChild(this);
                }
            }
        };
    }
    Bomberman.Block = Block;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var f = FudgeCore;
    class Bomb extends f.Node {
        constructor(x, y, z) {
            super("NewBomb");
            let bombPosition = new f.Vector3(Math.round(x), y, Math.round(z));
            let bombTimer = 1000;
            const cmpTransform = new f.ComponentTransform;
            let bombTexture = new f.TextureImage();
            bombTexture.load("../assets/bomb.png");
            let bombCoat = new f.CoatTextured(new f.Color(255, 255, 255, 255), bombTexture);
            let explosionTexture = new f.TextureImage();
            explosionTexture.load("../assets/explosion.png");
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshBombX")));
            this.addComponent(new f.ComponentMaterial(new f.Material("Texture", f.ShaderTextureFlat, bombCoat)));
            this.addComponent(cmpTransform);
            this.getComponent(f.ComponentTransform).mtxLocal.mutate({ translation: bombPosition, });
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(0.01);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(0.5);
            setTimeout(() => {
                this.removeComponent(this.getComponent(f.ComponentMaterial));
                Bomberman.agent.addComponent(new f.ComponentAudio(new f.Audio("../sound/explosion-sound.wav"), false, true));
                for (let i = 1; i <= 1; i++) {
                    this.addChild(new Bomberman.Flames(i, 0, 0, this.mtxWorld.translation));
                    this.addChild(new Bomberman.Flames(-i, 0, 0, this.mtxWorld.translation));
                    this.addChild(new Bomberman.Flames(0, 0, i, this.mtxWorld.translation));
                    this.addChild(new Bomberman.Flames(0, 0, -i, this.mtxWorld.translation));
                    this.addChild(new Bomberman.Flames(0, 0, 0, this.mtxWorld.translation));
                }
            }, bombTimer);
        }
    }
    Bomberman.Bomb = Bomb;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Bomberman); // Register the namespace to FUDGE for serialization
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
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
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
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Bomberman.CustomComponentScript = CustomComponentScript;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    class DataEvent extends Event {
        data;
        constructor(type, eventInitDict, data) {
            super(type, eventInitDict);
            this.data = data;
        }
        getData() {
            return this.data;
        }
    }
    Bomberman.DataEvent = DataEvent;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var f = FudgeCore;
    class Flames extends f.Node {
        constructor(x, y, z, worldpos) {
            super("Flame");
            //console.log(scale);
            let flamePosition = new f.Vector3(x, y, z);
            let flameTimer = 1000;
            const cmpTransform = new f.ComponentTransform;
            let explosionTexture = new f.TextureImage();
            explosionTexture.load("../assets/explosion.png");
            let explosionCoat = new f.CoatTextured(new f.Color(255, 255, 255, 255), explosionTexture);
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshFlameX")));
            this.addComponent(new f.ComponentMaterial(new f.Material("Texture", f.ShaderTextureFlat, explosionCoat)));
            this.addComponent(cmpTransform);
            this.cmpTransform.mtxLocal.mutate({ translation: flamePosition });
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(0.9);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(0.01);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(0.9);
            let bombExplosion = new Bomberman.DataEvent("bombExploded", { "bubbles": true, "cancelable": false }, new f.Vector3(worldpos.x + flamePosition.x, worldpos.y + flamePosition.y, worldpos.z + flamePosition.z));
            Bomberman.root.dispatchEvent(bombExplosion);
            setTimeout(() => {
                this.getParent().removeChild(this);
            }, flameTimer);
        }
    }
    Bomberman.Flames = Flames;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var f = FudgeCore;
    var fui = FudgeUserInterface;
    class GameState extends f.Mutable {
        static controller;
        static instance;
        agentHealth;
        constructor() {
            super();
            let domHud = document.querySelector("#ui");
            GameState.instance = this;
            GameState.controller = new fui.Controller(this, domHud);
            console.log("Hud-Controller", GameState.controller);
        }
        static get() {
            return GameState.instance || new GameState();
        }
        gameOver() {
            this.pauseLoop();
            document.querySelector('.endscreen--loose').classList.remove('hidden');
        }
        pauseLoop() {
            f.Loop.stop();
        }
        reduceMutator(_mutator) { }
    }
    Bomberman.GameState = GameState;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    let viewport;
    let userSelected;
    let camera = new f.ComponentCamera();
    let agentNode;
    let npcOne;
    let npcTwo;
    let npcThree;
    let npcNode;
    let canPlaceBomb = true;
    let mapParent;
    let mapBase;
    let baseFloor;
    let block;
    let blockNode;
    let dBlockNode;
    let mapBaseTrnsf;
    let scaleFactor;
    window.addEventListener("load", init);
    function init(_event) {
        let dialog = document.querySelector("dialog");
        let gameStartButton = document.querySelector('.start--game');
        gameStartButton.addEventListener("submit", function (_event) {
            document.querySelector('.ui').classList.remove('hidden');
            _event.preventDefault();
            userSelected = _event.target[0].options.selectedIndex;
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            start(null);
        });
        //@ts-ignore
        dialog.showModal();
    }
    async function start(_event) {
        await f.Project.loadResourcesFromHTML();
        buildViewPort();
        await scaleMap();
        //initBomb();
        let cmpListener = new f.ComponentAudioListener();
        //root.addComponent(new f.ComponentAudio(new f.Audio("../sound/theme-song.mp3"), true, true));
        f.AudioManager.default.listenWith(cmpListener);
        f.AudioManager.default.listenTo(Bomberman.root);
        f.AudioManager.default.volume = 0.5;
        f.Debug.log("Audio:", f.AudioManager.default);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        viewport.physicsDebugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function buildViewPort() {
        Bomberman.root = f.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
        let canvas = document.querySelector("canvas");
        viewport = new f.Viewport();
        viewport.initialize("Viewport", Bomberman.root, camera, canvas);
    }
    async function scaleMap() {
        let mapSize = await fetchData();
        const actualMapSize = mapSize[userSelected].size;
        mapParent = Bomberman.root.getChildrenByName("Floor")[0];
        mapBase = mapParent.getChildrenByName("World")[0];
        baseFloor = mapBase.getChildrenByName("Base")[0];
        const cmpTransform = new f.ComponentTransform;
        mapBaseTrnsf = mapBase.getComponent(f.ComponentTransform).mtxLocal;
        scaleFactor = new f.Vector3(actualMapSize, 1, actualMapSize);
        let translateFactor = new f.Vector3((actualMapSize / 2 - 0.5), 0, (actualMapSize / 2 - 0.5));
        mapBaseTrnsf.mutate({ scaling: scaleFactor, translation: translateFactor });
        const rigiBody = new f.ComponentRigidbody(1, f.BODY_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
        rigiBody.initialization = f.BODY_INIT.TO_MESH;
        baseFloor.addComponent(cmpTransform);
        baseFloor.addComponent(rigiBody);
        blockNode = mapParent.getChildrenByName("uBlock")[0];
        dBlockNode = mapParent.getChildrenByName("dBlock")[0];
        //create upper Blocks and Agent
        createBlocks(actualMapSize);
        createChars(actualMapSize);
        Bomberman.dBlockArray = dBlockNode.getChildren();
    }
    ;
    async function fetchData() {
        try {
            const response = await fetch("../mapsize.json");
            const responseObj = await response.json();
            return responseObj;
        }
        catch (error) {
            return error;
        }
    }
    function createBlocks(actualMapSize) {
        let mapWidth = actualMapSize;
        let mapHeight = actualMapSize;
        //TODO: add width and height to loop better.
        for (let i = 0; i < mapWidth; i++) {
            for (let j = 0; j < mapHeight; j++) {
                //loop to create walls.
                if (i == 0 || j == 0 || i == mapWidth - 1 || j == mapHeight - 1) {
                    block = new Bomberman.Block(i, j, false, "Wall");
                    blockNode.addChild(block);
                }
                else {
                    if (i > 1 && j > 1 && i != mapWidth - 2 && j != mapHeight - 2) {
                        let result = checkNumber(i, j);
                        if (result == 0 && (j % 2) == 0) {
                            block = new Bomberman.Block(i, j, false, "Wall");
                            blockNode.addChild(block);
                        }
                        else {
                            block = new Bomberman.Block(i, j, true, "DBlock");
                            dBlockNode.addChild(block);
                        }
                    }
                    else {
                        if (i >= 3 && i <= mapWidth - 4 || j >= 3 && j <= mapHeight - 4) {
                            block = new Bomberman.Block(i, j, true, "DBlock");
                            dBlockNode.addChild(block);
                        }
                    }
                }
            }
        }
    }
    function checkNumber(i, j) {
        let result = i + j;
        return result % 2;
    }
    function createChars(mapSize) {
        let mapWidth = mapSize - 2;
        let mapHeight = mapSize - 2;
        Bomberman.agent = new Bomberman.Agent();
        npcOne = new Bomberman.Npc(1, 1, mapHeight);
        npcTwo = new Bomberman.Npc(mapWidth, 1, mapHeight);
        npcThree = new Bomberman.Npc(mapWidth, 1, 1);
        agentNode = Bomberman.root.getChildrenByName('Agent')[0];
        npcNode = Bomberman.root.getChildrenByName('NPCs')[0];
        agentNode.addChild(Bomberman.agent);
        npcNode.addChild(npcOne);
        npcNode.addChild(npcTwo);
        npcNode.addChild(npcThree);
        appendCamera();
    }
    function appendCamera() {
        camera.mtxPivot.translateZ(0);
        camera.mtxPivot.translateY(15);
        camera.mtxPivot.translateX(-1);
        camera.mtxPivot.lookAt(f.Vector3.SUM(agentNode.mtxWorld.translation, f.Vector3.Z(0)), f.Vector3.Y(1));
        Bomberman.agent.addComponent(camera);
    }
    function update(_event) {
        viewport.draw();
        f.AudioManager.default.update();
        f.Physics.world.simulate(); // if physics is included and use
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE]) && canPlaceBomb) {
            createBomb();
        }
    }
    function createBomb() {
        canPlaceBomb = false;
        let agentPos = Bomberman.agent.mtxWorld.translation;
        Bomberman.agent.addComponent(new f.ComponentAudio(new f.Audio("../sound/hit.mp3"), false, true));
        Bomberman.bombNode = Bomberman.root.getChildrenByName("Bomb")[0];
        Bomberman.bomb = new Bomberman.Bomb(agentPos.x, agentPos.y, agentPos.z);
        Bomberman.bombNode.addChild(Bomberman.bomb);
        Bomberman.theBomb = Bomberman.bombNode.getChildrenByName("NewBomb")[0];
        setTimeout(() => {
            canPlaceBomb = true;
        }, 3000);
    }
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var f = FudgeCore;
    class Npc extends f.Node {
        body;
        //private direction: f.Vector3;
        canPlaceBomb;
        npcDirection;
        npcRotation;
        constructor(x, y, z) {
            super("NewNpc");
            this.canPlaceBomb = true;
            let npcPosition = new f.Vector3(x, y, z);
            const cmpTransform = new f.ComponentTransform;
            this.npcDirection = new f.Vector3(1, 0, 0);
            this.npcRotation = new f.Vector3(0, 0, 0);
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshNpc")));
            this.addComponent(new f.ComponentMaterial(new f.Material("mtrNpc", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 0.3, 0, 1)))));
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(1);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(0.5);
            this.addComponent(cmpTransform);
            this.getComponent(f.ComponentTransform).mtxLocal.mutate({ translation: npcPosition, });
            this.body = new f.ComponentRigidbody(1, f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
            this.body.initialization = f.BODY_INIT.TO_MESH;
            this.body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.handleCollisionEnter);
            this.addComponent(this.body);
            this.addComponent(new Bomberman.StateMachine);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        changeDirection() {
            if (this.npcDirection.x > 0) {
                this.npcDirection = new f.Vector3(0, 0, 2);
            }
            else if (this.npcDirection.z > 0) {
                this.npcDirection = new f.Vector3(-2, 0, 0);
            }
            else if (this.npcDirection.x < 0) {
                this.npcDirection = new f.Vector3(0, 0, -2);
            }
            else if (this.npcDirection.z < 0) {
                this.npcDirection = new f.Vector3(2, 0, 0);
            }
            this.npcDirection = new f.Vector3(this.npcDirection.x, this.npcDirection.y, this.npcDirection.z);
        }
        move() {
            this.body.setVelocity(this.npcDirection);
        }
        placeBomb() {
            if (this.canPlaceBomb) {
                const npcPos = this.getComponent(f.ComponentTransform).mtxLocal.translation;
                const x = new Bomberman.Bomb(npcPos.x, npcPos.y, npcPos.z);
                const y = Bomberman.root.getChildrenByName("Bomb")[0];
                y.addChild(x);
                this.canPlaceBomb = false;
                this.timeOut();
            }
            //this.timeOut();
        }
        async timeOut() {
            setTimeout(() => {
                this.canPlaceBomb = true;
            }, 1000);
        }
        update = (_event) => {
            this.body.setRotation(this.npcRotation);
        };
        handleCollisionEnter(_event) {
            console.log(_event.cmpRigidbody.node.name);
            //this.collisions.forEach( (element: any) => {
            //console.log(element);
            // this.direction = ƒ.Vector3.DIFFERENCE(element.node.getComponent(f.Component).mtxWorld.translation, this.node.getComponent(f.ComponentTransform).mtxWorld.translation);
            // if(element.node.name === 'Wall') {
            // this.direction = -this.direction;
            //}
            // console.log(this.direction)
            //});
        }
    }
    Bomberman.Npc = Npc;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var f = FudgeCore;
    var ƒAid = FudgeAid;
    f.Project.registerScriptNamespace(Bomberman); // Register the namespace to FUDGE for serialization
    let JOB;
    (function (JOB) {
        JOB[JOB["START"] = 0] = "START";
        JOB[JOB["NEXT"] = 1] = "NEXT";
        JOB[JOB["PLACEBOMB"] = 2] = "PLACEBOMB";
        JOB[JOB["TURN"] = 3] = "TURN";
    })(JOB || (JOB = {}));
    class StateMachine extends ƒAid.ComponentStateMachine {
        static iSubclass = f.Component.registerSubclass(StateMachine);
        static instructions = StateMachine.get();
        bombTimer;
        constructor() {
            super();
            this.instructions = StateMachine.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            //setup.setAction(JOB.START, <f.General>this.actStart);
            setup.setAction(JOB.START, this.actStart);
            setup.setAction(JOB.NEXT, this.actNextMove);
            setup.setAction(JOB.PLACEBOMB, this.actPlacebomb);
            setup.setAction(JOB.TURN, this.actTurn);
            return setup;
        }
        static actStart(_machine) {
            const node = _machine.node;
            node.move();
            _machine.transit(JOB.NEXT);
        }
        static actNextMove(_machine) {
            _machine.node.body.collisions.forEach(element => {
                switch (element.node.name) {
                    case "DBlock":
                        //console.log('DBBLOCK');
                        _machine.transit(JOB.PLACEBOMB);
                        break;
                    case "Wall":
                        _machine.transit(JOB.TURN);
                        break;
                    case "NewNpc":
                        _machine.transit(JOB.PLACEBOMB);
                        break;
                    case "NewAgent":
                        _machine.transit(JOB.PLACEBOMB);
                        break;
                    default:
                        _machine.transit(JOB.START);
                        break;
                }
            });
        }
        static actPlacebomb(_machine) {
            const nodePos = _machine.node.body.getPosition();
            _machine.node.body.setPosition(new f.Vector3(Math.round(nodePos.x), nodePos.y, Math.round(nodePos.z)));
            //console.log(nodePos.y);
            const node = _machine.node;
            node.placeBomb();
            _machine.transit(JOB.TURN);
        }
        static actTurn(_machine) {
            const nodePos = _machine.node.body.getPosition();
            _machine.node.body.setPosition(new f.Vector3(Math.round(nodePos.x), nodePos.y, Math.round(nodePos.z)));
            const node = _machine.node;
            node.changeDirection();
            _machine.transit(JOB.START);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    this.node.body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.handleCollisionEnter);
                    this.bombTimer = true;
                    this.transit(JOB.START);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    break;
            }
        };
        update = (_event) => {
            //this.node.body.applyForce(this.rotation);
            this.act();
        };
        handleCollisionEnter(_event) {
            //console.log(_event.cmpRigidbody.node.name);
        }
    }
    Bomberman.StateMachine = StateMachine;
})(Bomberman || (Bomberman = {}));
//# sourceMappingURL=Script.js.map