namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let transform: ƒ.Matrix4x4;
  let agentMove: ƒ.Matrix4x4

  function start(_event: CustomEvent): void {
    alert('Move around with your arrow keys on your keyboard');
    viewport = _event.detail;

    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);

   
    let graph: ƒ.Node = viewport.getBranch();
    let laser: ƒ.Node = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser_one")[0];
    let agent: ƒ.Node = graph.getChildrenByName("Agent")[0].getChildrenByName("Agent_one")[0];
    transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;
    agentMove = agent.getComponent(ƒ.ComponentTransform).mtxLocal;

    ƒ.Loop.start();

  }

  function update(_event: Event): void {
    transform.rotateZ(5);
    viewport.draw();
    ƒ.AudioManager.default.update();

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP])){
      agentMove.translateY(0.1);
    }
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT])){
      agentMove.rotateZ(-5);
    }
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT])){
      agentMove.rotateZ(5);
    }
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN])){
      agentMove.translateY(-0.1);
    }
  }

}