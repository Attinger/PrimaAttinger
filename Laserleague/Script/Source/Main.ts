namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  let laserRotationSpeed: number = 50;
  let agentMoveSpeed: number = 0;
  let agentMaxMoveSpeed: number = 5;
  let agentAccelerationSpeed: number = 0.1;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let transform: ƒ.Matrix4x4;
  let agentMove: ƒ.Matrix4x4;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let graph: ƒ.Node = viewport.getBranch();
    let laser: ƒ.Node = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser_one")[0];
    let agent: ƒ.Node = graph.getChildrenByName("Agent")[0].getChildrenByName("Agent_one")[0];
    transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;
    agentMove = agent.getComponent(ƒ.ComponentTransform).mtxLocal;

    viewport.camera.mtxPivot.translateZ(-45);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);

  }

  function update(_event: Event): void {
    transform.rotateZ(laserRotationSpeed * ƒ.Loop.timeFrameReal / 1000);
    viewport.draw();
    ƒ.AudioManager.default.update();

    
    //Agent speed erhöhen bei Pfeiltaste nach oben oder W 
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])){
      if(agentMoveSpeed < agentMaxMoveSpeed) {
        agentMoveSpeed += agentAccelerationSpeed;
      }
      agentMove.translateY(agentMoveSpeed * ƒ.Loop.timeFrameReal / 1000);
    }

    //Agent speed reduzieren bei Pfeiltaste nach oben oder W 
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])){
      if(agentMoveSpeed < agentMaxMoveSpeed) {
        agentMoveSpeed += agentAccelerationSpeed;
      }
      agentMove.translateY(-agentMoveSpeed * ƒ.Loop.timeFrameReal / 1000);
    }

    if(!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])){
      agentMoveSpeed = 0;
    }

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])){
      agentMove.rotateZ(-5);
    }

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])){
      agentMove.rotateZ(5);
    }
  }

}