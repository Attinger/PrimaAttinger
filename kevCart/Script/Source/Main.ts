namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  let root: f.Node;
  let camera: f.ComponentCamera = new f.ComponentCamera();
  let cart: Cart;
  let cartNode: f.Node;
  let meshRelief: f.MeshRelief;
  let mtxRelief: f.Matrix4x4;

  window.addEventListener("load", init);

  async function init(_event: Event): Promise<void> {
    let dialog: HTMLDialogElement = document.querySelector("dialog");
    dialog.querySelector("h1").textContent = document.title;
    dialog.addEventListener("click", function (_event: Event): void {
      // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
      dialog.close();
      start(null);
    });
    //@ts-ignore
    dialog.showModal();
  }

  async function start(_event: CustomEvent): Promise<void> {
    await f.Project.loadResourcesFromHTML();
    buildViewPort();
    createCart();
    getRelief();

    f.AudioManager.default.listenTo(root);
    f.AudioManager.default.listenWith(root.getComponent(f.ComponentAudioListener));

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function buildViewPort(): void {
    root = <f.Graph>f.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")]; 
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new f.Viewport();
    viewport.initialize("Viewport", root, camera, canvas);
  }

  function createCart(): void {
    cart = new Cart();
    cartNode = root.getChildrenByName('Cart')[0];
    appendCamera();
    cartNode.addChild(cart);
  }

  function appendCamera(): void {
    camera.mtxPivot.translateZ(0);
    camera.mtxPivot.translateY(15);
    camera.mtxPivot.translateX(-35);
    camera.mtxPivot.lookAt(f.Vector3.SUM(cartNode.mtxWorld.translation, f.Vector3.Z(1)), f.Vector3.Y());
    cart.addComponent(camera);
  }

  function getRelief(): void {
    let cmpMeshRelief: f.ComponentMesh = root.getChildrenByName("Terrain")[0].getComponent(f.ComponentMesh);
    meshRelief = <f.MeshRelief>cmpMeshRelief.mesh;
    mtxRelief = cmpMeshRelief.mtxWorld;
  }

  function update(_event: Event): void {
    // f.Physics.world.simulate();  // if physics is included and use
    checkCartTerrainPosition();

    viewport.draw();
    f.AudioManager.default.update();
  }

  function checkCartTerrainPosition(): void {
    let terrainInfo: f.TerrainInfo = meshRelief.getTerrainInfo(cart.mtxLocal.translation, mtxRelief);
    cart.mtxLocal.translation = terrainInfo.position;
    cart.mtxLocal.showTo(f.Vector3.SUM(terrainInfo.position, cart.mtxLocal.getZ()), terrainInfo.normal);
  }
}