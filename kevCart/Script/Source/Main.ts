namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let cart: ƒ.Node;
  let body: ƒ.ComponentRigidbody;
  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;
  let isGrounded: boolean = false;
  let dampTranslation: number;
  let dampRotation: number;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 7000, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 1000, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrTurn.setDelay(50);
  let cartOffroadDrag: ƒ.Control = new ƒ.Control("Drag", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  cartOffroadDrag.setDelay(1000);

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    viewport.calculateTransforms();

    let cmpMeshTerrain: ƒ.ComponentMesh = viewport.getBranch().getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
    meshTerrain = <ƒ.MeshTerrain>cmpMeshTerrain.mesh;
    mtxTerrain = cmpMeshTerrain.mtxWorld;
    cart = viewport.getBranch().getChildrenByName("Cart")[0];
    body = cart.getComponent(ƒ.ComponentRigidbody);
    dampTranslation = body.dampTranslation;
    dampRotation = body.dampRotation;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function cartOffroad():void {
    let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(cart.mtxWorld.translation, mtxTerrain);
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let img = new Image(100,100);
    img.src = './texture/maptex.png';
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0 );
    
    let x: number = Math.floor(terrainInfo.position.x);
    let y: number = Math.floor(terrainInfo.position.z);
    let color:any = context.getImageData(x, y, 1, 1);
    if(color.data[0] < 150 && color.data[1] < 150 && color.data[2] < 150) {
      cartOffroadDrag.setInput(1);
    } else {
      cartOffroadDrag.setInput(0.25);
    }
  }

  function update(_event: Event): void {
    let maxHeight: number = 0.3;
    let minHeight: number = 0.2;
    let forceNodes: ƒ.Node[] = cart.getChildren();
    let force: ƒ.Vector3 = ƒ.Vector3.SCALE(ƒ.Physics.world.getGravity(), -body.mass / forceNodes.length);

    isGrounded = false;
    for (let forceNode of forceNodes) {
      let posForce: ƒ.Vector3 = forceNode.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
      let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(posForce, mtxTerrain);
      let height: number = posForce.y - terrainInfo.position.y;

      if (height < maxHeight) {
        body.applyForceAtPoint(ƒ.Vector3.SCALE(force, (maxHeight - height) / (maxHeight - minHeight)), posForce);
        isGrounded = true;
      }
    }

    if (isGrounded) {
      body.dampTranslation = dampTranslation;
      body.dampRotation = dampRotation;
      let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
      ctrTurn.setInput(turn);
      body.applyTorque(ƒ.Vector3.SCALE(cart.mtxLocal.getY(), ctrTurn.getOutput()));

      let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
      ctrForward.setInput(forward);
      body.applyForce(ƒ.Vector3.SCALE(cart.mtxLocal.getZ(), ctrForward.getOutput() *  cartOffroadDrag.getOutput()));
    }
    else
      body.dampRotation = body.dampTranslation = 0;

    cartOffroad();

    ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}