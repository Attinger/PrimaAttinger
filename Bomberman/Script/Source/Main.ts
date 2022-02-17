namespace Bomberman {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  export let root: f.Node;
  let userSelected: number;
  let camera: f.ComponentCamera = new f.ComponentCamera();
  export let agent: Agent;
  let agentNode: f.Node;
  let npcOne: Npc;
  let npcTwo: Npc;
  let npcThree: Npc;
  let npcNode: f.Node;
  export let bomb: Bomb;
  export let bombNode: f.Node;
  export let theBomb: f.Node;
  export let flame: Flames;
  let canPlaceBomb: boolean = true;
  let mapParent: f.Node;
  let mapBase: f.Node;
  let baseFloor: f.Node;
  let block: Block;
  let blockNode: f.Node;
  let dBlockNode: f.Node;
  export let dBlockArray: f.Node[];
  let mapBaseTrnsf: f.Matrix4x4;
  let scaleFactor: f.Vector3;

  window.addEventListener("load", init);

  function init(_event: Event): void {
    let dialog: HTMLDialogElement = document.querySelector("dialog");
    let gameStartButton: any = document.querySelector('.start--game');
    gameStartButton.addEventListener("submit", function (_event: any): void {
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

  async function start(_event: CustomEvent): Promise<void> {
    await f.Project.loadResourcesFromHTML();
    buildViewPort();
    await scaleMap();
    //initBomb();

    let cmpListener = new f.ComponentAudioListener();

    //root.addComponent(new f.ComponentAudio(new f.Audio("../sound/theme-song.mp3"), true, true));

    f.AudioManager.default.listenWith(cmpListener);
    f.AudioManager.default.listenTo(root);
    f.AudioManager.default.volume = 0.5;
    f.Debug.log("Audio:", f.AudioManager.default);

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    viewport.physicsDebugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function buildViewPort(): void {
    root = <f.Graph>f.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new f.Viewport();
    viewport.initialize("Viewport", root, camera, canvas);
  }

   async function scaleMap() {
    let mapSize = await fetchData();
    const actualMapSize = mapSize[userSelected].size;

    mapParent = root.getChildrenByName("Floor")[0];
    mapBase = mapParent.getChildrenByName("World")[0];
    baseFloor = mapBase.getChildrenByName("Base")[0];

    const cmpTransform: f.ComponentTransform = new f.ComponentTransform;
    mapBaseTrnsf = mapBase.getComponent(f.ComponentTransform).mtxLocal;

    scaleFactor = new f.Vector3(actualMapSize, 1, actualMapSize);
    let translateFactor: f.Vector3 = new f.Vector3((actualMapSize/2 - 0.5), 0, (actualMapSize/2 - 0.5));
    mapBaseTrnsf.mutate({scaling: scaleFactor, translation: translateFactor});

    const rigiBody: f.ComponentRigidbody = new f.ComponentRigidbody(1, f.BODY_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.COLLISION_GROUP.DEFAULT, cmpTransform.mtxLocal);
    rigiBody.initialization = f.BODY_INIT.TO_MESH;
    baseFloor.addComponent(cmpTransform);
    baseFloor.addComponent(rigiBody);

    blockNode = mapParent.getChildrenByName("uBlock")[0];
    dBlockNode = mapParent.getChildrenByName("dBlock")[0];
    //create upper Blocks and Agent
    createBlocks(actualMapSize);
    createChars(actualMapSize);
    dBlockArray = dBlockNode.getChildren();
  };

  async function fetchData() {
    try {
      const response = await fetch("../mapsize.json");
      const responseObj = await response.json();
      return responseObj;
    } catch(error) {
      return error;
    }
  }

  function createBlocks(actualMapSize: number) {
    let mapWidth = actualMapSize;
    let mapHeight = actualMapSize;
    //TODO: add width and height to loop better.
    for(let i = 0; i < mapWidth; i++) {
      for(let j = 0 ; j < mapHeight; j++) {
        //loop to create walls.
        if(i==0 || j==0 || i==mapWidth-1 || j==mapHeight-1) {
          block = new Block(i, j, false, "Wall");
          blockNode.addChild(block);
        }else {
          if(i > 1 && j > 1 && i!=mapWidth-2 && j!=mapHeight-2) {
            let result = checkNumber(i, j);
            if(result == 0 && (j % 2) == 0) {
              block = new Block(i, j, false, "Wall");
              blockNode.addChild(block);
            } else {
              block = new Block(i, j, true, "DBlock");
              dBlockNode.addChild(block);
            }
          }
          else {
            if(i >= 3 && i <= mapWidth-4 || j >= 3 && j <= mapHeight-4 ) {
              block = new Block(i, j, true, "DBlock");
              dBlockNode.addChild(block);
            }
          }
        }
      }
    }
  }


  function checkNumber(i: number, j:number) {
    let result = i + j;
    return result % 2;
  }

  function createChars(mapSize: number): void {
    let mapWidth = mapSize - 2;
    let mapHeight = mapSize -2;

    agent = new Agent();
    npcOne = new Npc(1, 1, mapHeight);
    npcTwo = new Npc(mapWidth, 1, mapHeight);
    npcThree = new Npc(mapWidth, 1, 1);

    agentNode = root.getChildrenByName('Agent')[0];
    npcNode = root.getChildrenByName('NPCs')[0];
    agentNode.addChild(agent);
    npcNode.addChild(npcOne);
    npcNode.addChild(npcTwo);
    npcNode.addChild(npcThree);
    appendCamera();
  }

  function appendCamera(): void {
    camera.mtxPivot.translateZ(0);
    camera.mtxPivot.translateY(15);
    camera.mtxPivot.translateX(-1);
    camera.mtxPivot.lookAt(f.Vector3.SUM(agentNode.mtxWorld.translation, f.Vector3.Z(0)), f.Vector3.Y(1));
    agent.addComponent(camera);
  }

  function update(_event: Event): void {
    viewport.draw();
    f.AudioManager.default.update();

    f.Physics.world.simulate();  // if physics is included and use
    if(f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE]) && canPlaceBomb) {
      createBomb();
    }

  }

  function createBomb() {
    canPlaceBomb = false;
    let agentPos = agent.mtxWorld.translation;
    agent.addComponent(new f.ComponentAudio(new f.Audio("../sound/hit.mp3"), false, true));
    bombNode = root.getChildrenByName("Bomb")[0];
    bomb = new Bomb(agentPos.x, agentPos.y, agentPos.z);
    bombNode.addChild(bomb);
    theBomb = bombNode.getChildrenByName("NewBomb")[0];
    setTimeout(()=>{
      canPlaceBomb = true;
    }, 3000);
  }
}
