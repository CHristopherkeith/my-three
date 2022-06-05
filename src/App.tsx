// 组件
import React from "react";
// 库
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 模型
import bingdwendwenModel from "./models/bingdwendwen.glb";
import landModel from "./models/land.glb";
import treeModel from "./models/tree.gltf";
// 贴图
import treeTexture from "./images/tree.png";
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
    camera.position.set(-20, 40, 150);
    camera.lookAt(scene.position);

    // 模型
    const loader = new GLTFLoader();

    // 地面
    loader.load(landModel, function (mesh) {
      mesh.scene.traverse(function (child: THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (child.isMesh) {
          // meshes.push(child);
          material.metalness = 0.1;
          material.roughness = 0.8;
          // 地面
          if (child.name === "Mesh_2") {
            material.metalness = 0.5;
            child.receiveShadow = true;
          }
          // 围巾
          if (child.name === "Mesh_17") {
            material.metalness = 0.2;
            material.roughness = 0.8;
          }
          // 帽子
          if (child.name === "Mesh_17") {
          }
        }
      });

      mesh.scene.rotation.y = Math.PI / 4;
      mesh.scene.position.set(15, -15, 0);
      mesh.scene.scale.set(2, 2, 2);

      scene.add(mesh.scene);
    });

    // 冰墩墩
    loader.load(bingdwendwenModel, function (mesh) {
      mesh.scene.traverse(function (child: THREE.Mesh) {
        // console.log(child, '[2222]')
        const material = child.material as THREE.MeshStandardMaterial;
        if (child.isMesh) {
          // meshes.push(child)

          if (child.name === "皮肤") {
            material.metalness = 0.3;
            material.roughness = 0.8;
          }

          if (child.name === "外壳") {
            material.transparent = true;
            material.opacity = 0.4;
            material.metalness = 0.4;
            material.roughness = 0;
            (material as any).refractionRatio = 1.6;
            child.castShadow = true;
            // material.envMap = new THREE.TextureLoader().load(skyTexture);
            material.envMapIntensity = 1;
          }

          if (child.name === "围脖") {
            material.transparent = true;
            material.opacity = 0.6;
            material.metalness = 0.4;
            material.roughness = 0.6;
          }
        }
      });

      mesh.scene.rotation.y = -Math.PI / 12;
      mesh.scene.position.set(0, 0, 0);
      mesh.scene.scale.set(100, 100, 100);
      scene.add(mesh.scene);
    });

    // 树
    const treeMaterial = new THREE.MeshPhysicalMaterial({
      map: new THREE.TextureLoader().load(treeTexture),
      transparent: true,
      side: THREE.DoubleSide,
      metalness: 0.2,
      roughness: 0.8,
      depthTest: true,
      depthWrite: false,
      // skinning: false,
      fog: false,
      reflectivity: 0.1,
      // refractionRatio: 0,
    });

    const treeCustomDepthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
      map: new THREE.TextureLoader().load(treeTexture),
      alphaTest: 0.5,
    });

    loader.load(treeModel, function (mesh) {
      mesh.scene.traverse(function (child: THREE.Mesh) {
        if (child.isMesh) {
          // meshes.push(child);
          child.material = treeMaterial;
          (child as any).custromMaterial = treeCustomDepthMaterial;
        }
      });

      mesh.scene.position.set(-40, 0, 25);
      mesh.scene.scale.set(20, 20, 20);
      scene.add(mesh.scene);

      let tree2 = mesh.scene.clone();
      tree2.position.set(-55, -0, -15);
      tree2.scale.set(23,23,23);
      scene.add(tree2);

      // let tree3 = mesh.scene.clone();
      // tree3.position.set(-18, -8, -16);
      // tree3.scale.set(22, 22, 22);
      // scene.add(tree3);
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
