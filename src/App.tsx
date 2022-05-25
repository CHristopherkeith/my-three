// 组件
import React from "react";
// 库
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 模型
import bingdwendwenModel from "./models/bingdwendwen.glb";
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
    // renderer.setClearColor(new THREE.Color(0xffe5d4));
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
    // scene.add(plane);

    // cube
    const cubeGeometry = new THREE.BoxGeometry(30, 20, 20);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xdaaadb,
      // wireframe: true,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(5, 0, 0);
    cube.castShadow = true;
    // scene.add(cube);

    // 基本光源
    // const ambientLight = new THREE.AmbientLight(0xcfffff);
    // ambientLight.intensity = 0.5;
    // scene.add(ambientLight);

    // 点光源
    // const spotLight = new THREE.SpotLight("#ffffff");
    // spotLight.castShadow = true;
    // // spotLight.target = cube;
    // spotLight.position.set(-100, 100, -100);
    // scene.add(spotLight);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
    directionalLight.position.set(-50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.target = cube;
    directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    directionalLight.intensity = 1;
    directionalLight.shadow.mapSize.width = 512 * 12;
    directionalLight.shadow.mapSize.height = 512 * 12;
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
    camera.position.set(100, 100, 100);
    camera.lookAt(scene.position);

    // 模型
    const loader = new GLTFLoader();
    loader.load(bingdwendwenModel, function (mesh) {
      console.log(mesh, "[2333]");

      // result.scene.scale.set(6, 6, 6);
      // result.scene.translateY(-3);
      // result.scene.rotateY(-0.3 * Math.PI);

      // setup the mixer
      // const mixer = new THREE.AnimationMixer(result.scene);
      // let animationClip = result.animations[0];
      // const clipAction = mixer.clipAction(animationClip).play();
      // animationClip = clipAction.getClip();

      // add the animation controls
      // enableControls();

      mesh.scene.traverse(function (child: THREE.Mesh) {
        console.log(child, '[2222]')
        const material = child.material as THREE.MeshStandardMaterial
        if (child.isMesh) {
          // meshes.push(child)

          if (child.name === '皮肤') {
            material.metalness = .3;
            material.roughness = .8;
          }

          if (child.name === '外壳') {
            material.transparent = true;
            material.opacity = .4;
            material.metalness = .4;
            material.roughness = 0;
            (material as any).refractionRatio = 1.6;
            child.castShadow = true;
            // material.envMap = new THREE.TextureLoader().load(skyTexture);
            material.envMapIntensity = 1;
          }

          if (child.name === '围脖') {
            material.transparent = true;
            material.opacity = .6;
            material.metalness = .4;
            material.roughness = .6;
          }
        }
      });

      mesh.scene.rotation.y = Math.PI / 24;
      mesh.scene.position.set(0, 0, 0);
      mesh.scene.scale.set(150, 150, 150);
      scene.add(mesh.scene);
    });

    const trackballControls = this.initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    this.renderScene({ renderer, scene, camera, trackballControls, clock });
  }

  renderScene(
    // renderer: THREE.WebGLRenderer,
    // scene: THREE.Scene,
    // camera: THREE.Camera
    renderObj: {
      renderer: THREE.WebGLRenderer;
      scene: THREE.Scene;
      camera: THREE.Camera;
      trackballControls: TrackballControls;
      clock: THREE.Clock;
    }
  ) {
    // console.log(111)
    const { renderer, scene, camera, trackballControls, clock } = renderObj;
    trackballControls.update();
    requestAnimationFrame(this.renderScene.bind(this, renderObj));
    renderer.render(scene, camera);
  }

  initTrackballControls(camera: THREE.Camera, renderer: THREE.Renderer) {
    const trackballControls = new TrackballControls(
      camera,
      renderer.domElement
    );
    trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 1.2;
    trackballControls.panSpeed = 0.8;
    trackballControls.noZoom = false;
    trackballControls.noPan = false;
    trackballControls.staticMoving = true;
    trackballControls.dynamicDampingFactor = 0.3;
    trackballControls.keys = ["65", "83", "68"];

    return trackballControls;
  }

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
