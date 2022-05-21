// 组件
import React from "react";
// 库
import * as THREE from "three";
// 样式
import "./App.css";

class App extends React.Component {
  // constructor(props){
  //   super(props)
  // }

  init() {
    // 渲染容器和渲染器
    const container = document.getElementById("container");
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xffe5d4));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // scene
    const scene: THREE.Scene = new THREE.Scene();

    // 显示坐标轴
    const axes = new THREE.AxesHelper(100);
    scene.add(axes);

    // 平面
    const planeGeometry = new THREE.BoxGeometry(200, 1, 200);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xd9d9d9,
      // wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -30, 0);
    plane.receiveShadow = true;
    scene.add(plane);

    // cube
    const cubeGeometry = new THREE.BoxGeometry(30, 20, 20);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xdaaadb,
      // wireframe: true,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(5, 0, 0);
    cube.castShadow = true;
    scene.add(cube);

    // 基本光源
    // const ambientLight = new THREE.AmbientLight(0xcfffff);
    // ambientLight.intensity = 0.5;
    // scene.add(ambientLight);

    // 点光源
    // const spotLight = new THREE.SpotLight("#ffffff");
    // spotLight.castShadow = true;
    // spotLight.target = cube;
    // spotLight.position.set(-100, 100, -100);
    // scene.add(spotLight);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight("#ffffff");
    directionalLight.position.set(-50, 50, 50);
    directionalLight.castShadow = true;
    // directionalLight.target = cube;
    directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    directionalLight.intensity = 0.5;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    scene.add(directionalLight);

    const shadowCamera = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(shadowCamera);

    // camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(100, 100, 100);
    camera.lookAt(scene.position);

    // requestAnimationFrame(this.init.call(this));

    // renderer
    // renderer.render(scene, camera);
    this.renderScene(renderer, scene, camera);
  }

  renderScene(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) {
    requestAnimationFrame(this.renderScene.bind(this, renderer, scene, camera));
    renderer.render(scene, camera);
  }

  // initTrackballControls(camera: THREE.Camera, renderer: THREE.Renderer) {
  //   var trackballControls = new THREE.TrackballControls(
  //     camera,
  //     renderer.domElement
  //   );
  //   trackballControls.rotateSpeed = 1.0;
  //   trackballControls.zoomSpeed = 1.2;
  //   trackballControls.panSpeed = 0.8;
  //   trackballControls.noZoom = false;
  //   trackballControls.noPan = false;
  //   trackballControls.staticMoving = true;
  //   trackballControls.dynamicDampingFactor = 0.3;
  //   trackballControls.keys = [65, 83, 68];

  //   return trackballControls;
  // }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    const container = document.getElementById("container");
    container.innerHTML = "";
  }

  render() {
    return <div id="container"></div>;
  }
}

export default App;
