namespace LaserLeague {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let agent: Agent;
  let allLasers: f.Node;
  let lasers: f.Node[];
  let root: f.Node;
  let agentTransform: f.Matrix4x4;
  let agentMoveForward: f.Control = new f.Control("Forward", 1, f.CONTROL_TYPE.PROPORTIONAL);
  let agentMoveSide: f.Control = new f.Control("Turn", 1, f.CONTROL_TYPE.PROPORTIONAL);
  let agentMaxMoveSpeed: number = 5;
  let agentMaxTurnSpeed: number = 200;
  let agentStartPos: f.Vector3 = new f.Vector3(9,1,1);
  let hitSound: f.ComponentAudio;
  let gotHit: f.Audio;
  agentMoveForward.setDelay(500);

   function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let graph: f.Node = viewport.getBranch();
    agent = new Agent();
    root = graph.getChildrenByName("Agent")[0];
    allLasers = graph.getChildrenByName("Lasers")[0];

    gotHit = new f.Audio("./Sound/hit.mp3");
    hitSound = new f.ComponentAudio(gotHit, false, false);
    hitSound.volume = 30;



    agentTransform = agent.getComponent(f.ComponentTransform).mtxLocal;
    agentTransform.mutate({
      translation: agentStartPos,
    });
    root.addChild(agent);

    generateLaser().then(() => {
      lasers = graph.getChildrenByName("Lasers")[0].getChildrenByName("Lasers");
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    });

    Hud.start();

    viewport.camera.mtxPivot.translateZ(-45);
  
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

  }

  async function generateLaser() {
    for (let yPos = -1; yPos <= 1; yPos+=2) {
      for (let xPos = -1; xPos <= 1; xPos++) {
        let graphLaser: f.Graph = <f.Graph>FudgeCore.Project.resources["Graph|2021-10-28T13:21:46.352Z|48972"];
        let laser: f.GraphInstance = await f.Project.createGraphInstance(graphLaser);
        let laserTranslate: f.Vector3 = new f.Vector3(xPos*8,yPos*6,1);
        laser.getComponent(f.ComponentTransform).mtxLocal.mutate(
          {
            translation: laserTranslate,
          });
        allLasers.addChild(laser);
      }
    }
  }

  function update(_event: Event): void {

    let moveForwardValue: number = (
      f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W]) + f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S])
    );

    agentMoveForward.setInput(moveForwardValue);

    agentTransform.translateY(agentMoveForward.getOutput() * agentMaxMoveSpeed * f.Loop.timeFrameReal / 1000); 

    let turnSideValue: number = (
      f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A]) + f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D])
    );

    agentMoveSide.setInput(turnSideValue);
    agentTransform.rotateZ(agentMoveSide.getOutput() * agentMaxTurnSpeed * f.Loop.timeFrameReal / 1000); 

    viewport.draw();
    f.AudioManager.default.update();

    lasers.forEach(laser => {
      let laserBeams: f.Node[] = laser.getChildrenByName("Laser_one")[0].getChildrenByName("Laserbeam");
      laserBeams.forEach(beam => {
        checkCollision(agent,beam);
      });
    });

  }
  function checkCollision(agent: f.Node, beam:f.Node){
    let distance: f.Vector3 = f.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse,true); 
    let x = beam.getComponent(f.ComponentMesh).mtxPivot.scaling.x/2 + agent.radius;
    let y = beam.getComponent(f.ComponentMesh).mtxPivot.scaling.y + agent.radius;
    if(distance.x <= (x) && distance.x >= -(x)  && distance.y <= y && distance.y >= 0) {
      hitSound.play(true);
      gameState.health -= 0.02;
      agentTransform.mutate({
        translation: agentStartPos,
      });
    }
  }
}