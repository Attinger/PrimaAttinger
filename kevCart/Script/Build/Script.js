"use strict";
var Script;
(function (Script) {
    var f = FudgeCore;
    class Cart extends f.Node {
        constructor() {
            super("NewCart");
            this.addComponent(new f.ComponentTransform);
            this.addComponent(new f.ComponentMesh(new f.MeshCube("MeshCart")));
            this.addComponent(new f.ComponentMaterial(new f.Material("mtrCart", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 0.3, 0, 1)))));
            this.getComponent(f.ComponentMesh).mtxPivot.scaleX(7);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleY(2);
            this.getComponent(f.ComponentMesh).mtxPivot.scaleZ(3);
            this.addComponent(new Script.CartComponentScript);
        }
    }
    Script.Cart = Cart;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CartComponentScript extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = f.Component.registerSubclass(CartComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CartComponentScript added to ";
        cartStartPosition = new f.Vector3(9, 1, 1);
        cartMaxMovementSpeed = 20.0;
        cartMaxTurnSpeed = 90;
        cartControlForward;
        cartControlTurn;
        cartTransform;
        constructor() {
            super();
            this.cartControlForward = new f.Control("Forward", 1, 0 /* PROPORTIONAL */);
            this.cartControlTurn = new f.Control("Turn", 1, 0 /* PROPORTIONAL */);
            this.cartControlForward.setDelay(500);
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        create = () => {
            this.cartTransform = this.node.getComponent(f.ComponentTransform).mtxLocal;
            this.cartTransform.mutate({
                translation: this.cartStartPosition,
            });
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        };
        update = (_event) => {
            let forwardValue = (f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W]));
            let turnValue = (f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D]) + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A]));
            this.cartControlForward.setInput(forwardValue);
            this.cartControlTurn.setInput(turnValue);
            this.cartTransform.rotateY(this.cartControlTurn.getOutput() * this.cartMaxTurnSpeed * f.Loop.timeFrameReal / 1000);
            this.cartTransform.translateX(this.cartControlForward.getOutput() * this.cartMaxMovementSpeed * f.Loop.timeFrameReal / 1000);
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
    Script.CartComponentScript = CartComponentScript;
})(Script || (Script = {}));
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
    let root;
    let camera = new f.ComponentCamera();
    let cart;
    let cartNode;
    let meshRelief;
    let mtxRelief;
    window.addEventListener("load", init);
    async function init(_event) {
        let dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
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
        createCart();
        getRelief();
        f.AudioManager.default.listenTo(root);
        f.AudioManager.default.listenWith(root.getComponent(f.ComponentAudioListener));
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function buildViewPort() {
        root = f.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
        let canvas = document.querySelector("canvas");
        viewport = new f.Viewport();
        viewport.initialize("Viewport", root, camera, canvas);
    }
    function createCart() {
        cart = new Script.Cart();
        cartNode = root.getChildrenByName('Cart')[0];
        appendCamera();
        cartNode.addChild(cart);
    }
    function appendCamera() {
        camera.mtxPivot.translateZ(0);
        camera.mtxPivot.translateY(15);
        camera.mtxPivot.translateX(-35);
        camera.mtxPivot.lookAt(f.Vector3.SUM(cartNode.mtxWorld.translation, f.Vector3.Z(1)), f.Vector3.Y());
        cart.addComponent(camera);
    }
    function getRelief() {
        let cmpMeshRelief = root.getChildrenByName("Terrain")[0].getComponent(f.ComponentMesh);
        meshRelief = cmpMeshRelief.mesh;
        mtxRelief = cmpMeshRelief.mtxWorld;
    }
    function update(_event) {
        // f.Physics.world.simulate();  // if physics is included and use
        checkCartTerrainPosition();
        viewport.draw();
        f.AudioManager.default.update();
    }
    function checkCartTerrainPosition() {
        let terrainInfo = meshRelief.getTerrainInfo(cart.mtxLocal.translation, mtxRelief);
        cart.mtxLocal.translation = terrainInfo.position;
        cart.mtxLocal.showTo(f.Vector3.SUM(terrainInfo.position, cart.mtxLocal.getZ()), terrainInfo.normal);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map