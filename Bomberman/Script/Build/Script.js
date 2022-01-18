"use strict";
var Bomberman;
(function (Bomberman) {
    var f = FudgeCore;
    class Agent extends f.Node {
        constructor() {
            super("NewAgent");
            let agentPosition = new f.Vector3(1, 2, 1);
            const cmpTransform = new f.ComponentTransform;
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshAgent")));
            this.addComponent(new f.ComponentMaterial(new f.Material("mtrAgent", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 0.3, 0, 1)))));
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(1);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.rotateY(90);
            this.addComponent(cmpTransform);
            const body = new f.ComponentRigidbody(0.5, f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
            body.initialization = f.BODY_INIT.TO_MESH;
            this.addComponent(body);
            this.getComponent(f.ComponentTransform).mtxLocal.mutate({ translation: agentPosition, });
            this.addComponent(new Bomberman.AgentComponentScript);
        }
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
            this.agentControlForward = new f.Control("Forward", 5, 0 /* PROPORTIONAL */);
            this.agentControlTurn = new f.Control("Turn", 5, 0 /* PROPORTIONAL */);
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
            this.agentRigibody.applyForce(f.Vector3.SCALE(this.agentTransform.getZ(), this.agentControlTurn.getOutput()));
            this.agentRigibody.applyForce(f.Vector3.SCALE(this.agentTransform.getX(), this.agentControlForward.getOutput()));
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
        constructor(xPos, yPos, destroyable, name) {
            super(name);
            let blockPosition = new f.Vector3(xPos, 1, yPos);
            const cmpTransform = new f.ComponentTransform;
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshBlock")));
            let blockTexture = new f.TextureImage();
            blockTexture.load("../assets/basic-block.jpg");
            let coat = new f.CoatTextured(new f.Color(255, 255, 255, 255), blockTexture);
            let destoryableTexture = new f.TextureImage();
            destoryableTexture.load("../assets/destroyable-block.jpg");
            let coatDestroy = new f.CoatTextured(new f.Color(255, 255, 255, 255), destoryableTexture);
            if (!destroyable) {
                this.addComponent(new f.ComponentMaterial(new f.Material("Texture", f.ShaderTextureFlat, coat)));
            }
            else {
                this.addComponent(new f.ComponentMaterial(new f.Material("Texture", f.ShaderTextureFlat, coatDestroy)));
            }
            this.addComponent(cmpTransform);
            const body = new f.ComponentRigidbody(1, f.BODY_TYPE.KINEMATIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
            body.initialization = f.BODY_INIT.TO_MESH;
            this.addComponent(body);
            this.getComponent(f.ComponentTransform).mtxLocal.mutate({ translation: blockPosition, });
        }
    }
    Bomberman.Block = Block;
})(Bomberman || (Bomberman = {}));
var Bomberman;
(function (Bomberman) {
    var f = FudgeCore;
    class Bomb extends f.Node {
        body;
        constructor(x, y, z, rotated) {
            super("NewBomb");
            let bombPosition = new f.Vector3(x, y, z);
            let bombRotation = new f.Vector3(0, 90, 0);
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
            if (rotated) {
                this.getComponent(f.ComponentTransform).mtxLocal.mutate({ rotation: bombRotation, });
            }
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(0.5);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(1);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(0.5);
            setTimeout(() => {
                this.getComponent(f.ComponentMaterial).material.coat = new f.CoatTextured(new f.Color(255, 255, 255, 255), explosionTexture);
                this.getComponent(f.ComponentMesh).mtxPivot.scaleX(7);
                this.body = new f.ComponentRigidbody(1, f.BODY_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
                this.body.initialization = f.BODY_INIT.TO_MESH;
                this.body.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.handleCollisionEnter);
                this.addComponent(this.body);
                setTimeout(() => {
                    this.removeComponent(this.getComponent(f.ComponentRigidbody));
                    this.getParent().removeChild(this);
                }, 1000);
            }, bombTimer);
        }
        handleCollisionEnter(_event) {
            let blockFly = new f.Vector3(0, 10, 15);
            if (_event.cmpRigidbody.node.name === "NewAgent") {
                //TODO: Add gamestate -1health
                console.log('aua');
            }
            Bomberman.dBlockArray.forEach(element => {
                if (element === _event.cmpRigidbody.node) {
                    element.getComponent(f.ComponentTransform).mtxLocal.mutate({ translation: blockFly, });
                }
            });
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
    var f = FudgeCore;
    var fui = FudgeUserInterface;
    class GameState extends f.Mutable {
        static controller;
        static instance;
        mapSizeX;
        mapSizeY;
        mapSizeName;
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
    let agent;
    let agentNode;
    //let agentScript: any;
    //let allBombs: f.Node[];
    let bomb;
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
    async function init(_event) {
        let dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        let gameStartButton = document.querySelector('.start--game');
        gameStartButton.addEventListener("submit", function (_event) {
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
        scaleMap();
        createAgent();
        //initBomb();
        f.AudioManager.default.listenTo(Bomberman.root);
        f.AudioManager.default.listenWith(Bomberman.root.getComponent(f.ComponentAudioListener));
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function buildViewPort() {
        Bomberman.root = f.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
        let canvas = document.querySelector("canvas");
        viewport = new f.Viewport();
        viewport.initialize("Viewport", Bomberman.root, camera, canvas);
    }
    async function scaleMap() {
        const mapSize = await fetchData();
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
        //create upper Blocks
        createBlocks(actualMapSize);
        Bomberman.dBlockArray = dBlockNode.getChildren();
    }
    ;
    async function fetchData() {
        try {
            const response = await fetch("../mapsize.JSON");
            const responseObj = await response.json();
            return responseObj;
        }
        catch (error) {
            return error;
        }
    }
    async function createBlocks(actualMapSize) {
        let mapWidth = actualMapSize;
        let mapHeight = actualMapSize;
        //TODO: add width and height to loop better.
        for (let i = 0; i < mapWidth; i++) {
            for (let j = 0; j < mapHeight; j++) {
                //loop to create walls.
                if (i == 0 || j == 0 || i == mapWidth - 1 || j == mapHeight - 1) {
                    block = new Bomberman.Block(i, j, false, "Block");
                    blockNode.addChild(block);
                }
                else {
                    if (i > 1 && j > 1 && i != mapWidth - 2 && j != mapHeight - 2) {
                        let result = checkNumber(i, j);
                        if (result == 0 && (j % 2) == 0) {
                            block = new Bomberman.Block(i, j, false, "Block");
                            blockNode.addChild(block);
                        }
                        else {
                            block = new Bomberman.Block(i, j, true, "DBlockx" + (i + j));
                            dBlockNode.addChild(block);
                        }
                    }
                    else {
                        if (i >= 3 && i <= mapWidth - 4 || j >= 3 && j <= mapHeight - 4) {
                            block = new Bomberman.Block(i, j, true, "DBlocky" + (i + j));
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
    function createAgent() {
        agent = new Bomberman.Agent();
        agentNode = Bomberman.root.getChildrenByName('Agent')[0];
        agentNode.addChild(agent);
        appendCamera();
        //agentScript = agent.getComponent(AgentComponentScript);
    }
    function appendCamera() {
        camera.mtxPivot.translateZ(0);
        camera.mtxPivot.translateY(15);
        camera.mtxPivot.translateX(-1);
        camera.mtxPivot.lookAt(f.Vector3.SUM(agentNode.mtxWorld.translation, f.Vector3.Z(0)), f.Vector3.Y(1));
        agent.addComponent(camera);
    }
    //function initBomb(): void {
    //allBombs = root.getChildrenByName("Bomb");
    //}
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
        let agentPos = agent.mtxWorld.translation;
        Bomberman.bombNode = Bomberman.root.getChildrenByName("Bomb")[0];
        for (let i = 1; i <= 2; i++) {
            if (i == 2) {
                bomb = new Bomberman.Bomb(agentPos.x, agentPos.y, agentPos.z, true);
            }
            else {
                bomb = new Bomberman.Bomb(agentPos.x, agentPos.y, agentPos.z, false);
            }
            Bomberman.bombNode.addChild(bomb);
        }
        setTimeout(() => {
            canPlaceBomb = true;
        }, 3000);
    }
})(Bomberman || (Bomberman = {}));
//# sourceMappingURL=Script.js.map