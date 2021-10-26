namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let agent: f.Node;
  let laser: f.Node;
  let laserRotationSpeed: number = 125;
  let agentTransform: f.Matrix4x4;
  let agentMoveForward: f.Control = new f.Control("Forward", 1, f.CONTROL_TYPE.PROPORTIONAL);
  let agentMoveSide: f.Control = new f.Control("Turn", 1, f.CONTROL_TYPE.PROPORTIONAL);
  let agentMaxMoveSpeed: number = 5;
  let agentMaxTurnSpeed: number = 200;
  let agentStartPos: f.Vector3 = new f.Vector3(3,3,0.5);
  agentMoveForward.setDelay(500);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let graph: f.Node = viewport.getBranch();
    laser =  graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser_one")[0];
    let allAgents: f.Node[] = graph.getChildrenByName("Agent");


    agent = allAgents[0].getChildrenByName("Agent_one")[0];
    agentTransform = agent.getComponent(f.ComponentTransform).mtxLocal;
    //let laserTransform = laser.getComponent(f.ComponentTransform).mtxLocal;


    viewport.camera.mtxPivot.translateZ(-45);

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

  }

  function update(_event: Event): void {
    //laserTransform.rotateZ(laserRotationSpeed * f.Loop.timeFrameReal / 1000);

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
    
    let laserbeams: f.Node[] = laser.getChildrenByName("Laserbeam");
    laserbeams.forEach(beam => {
      beam.getComponent(f.ComponentTransform).mtxLocal.rotateZ(laserRotationSpeed * f.Loop.timeFrameReal / 1000);
      checkCollision(agent, beam);
    });

    viewport.draw();
    f.AudioManager.default.update();

  }
  function checkCollision(agent: f.Node, beam:f.Node){
    let distance: f.Vector3 = f.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse,true); 
    let x = beam.getComponent(f.ComponentMesh).mtxPivot.scaling.x/2 + agent.radius;
    let y = beam.getComponent(f.ComponentMesh).mtxPivot.scaling.y + agent.radius;
    if(distance.x <= (x) && distance.x >= -(x) && distance.y <= y && distance.y >= 0) {
      agentTransform.translate(f.Vector3.TRANSFORMATION(agentStartPos, agent.mtxWorldInverse, true));
    }
  }
}