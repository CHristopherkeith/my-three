// 组件
import React from "react";
// 库
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 模型
import bingdwendwenModel from "./models/bingdwendwen.glb";
import xuerongrongModel from './models/xuerongrong.glb';
import landModel from "./models/land.glb";
import treeModel from "./models/tree.gltf";
import flagModel from "./models/flag.glb";
// 贴图
import treeTexture from "./images/tree.png";
import flagTexture from "./images/flag.png";
import snowTexture from "./images/snowflake2.png";
import skyTexture from './images/sky.jpg';
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
    scene.background = new THREE.TextureLoader().load(skyTexture);
    // scene.fog = new THREE.Fog(0xffffff, 10, 100);

    // 显示坐标轴
    const axes = new THREE.AxesHelper(100);
    // scene.add(axes);
    scene.position.y = -20;
    scene.scale.set(1.7,1.7,1.7)

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
    const ambientLight = new THREE.AmbientLight(0xcfffff);
    ambientLight.intensity = 1;
    scene.add(ambientLight);

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
    directionalLight.shadow.camera.far = 400;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 150;
    directionalLight.shadow.camera.bottom = -50;

    directionalLight.intensity = 1;
    directionalLight.shadow.mapSize.width = 512 * 12;
    directionalLight.shadow.mapSize.height = 512 * 12;
    scene.add(directionalLight);

    const shadowCamera = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(shadowCamera);

    // camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(-20, 85, 150);
    // camera.zoom = 2
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
      mesh.scene.position.set(35, -15, 0);
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
            material.envMap = new THREE.TextureLoader().load(skyTexture);
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
      mesh.scene.position.set(-10, 0, 15);
      mesh.scene.scale.set(100, 100, 100);
      scene.add(mesh.scene);
    });

    // 雪容融
    loader.load(xuerongrongModel, function (mesh) {
      mesh.scene.traverse(function (child: THREE.Mesh) {
        if (child.isMesh) {
          child.castShadow = true;
          // meshes.push(child)
        }
      });

      mesh.scene.rotation.y = Math.PI / 8;
      mesh.scene.position.set(-60, 10, 10);
      mesh.scene.scale.set(40, 40, 40);

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

      mesh.scene.position.set(55, 0, 35);
      mesh.scene.scale.set(60, 60, 60);
      scene.add(mesh.scene);

      let tree2 = mesh.scene.clone();
      tree2.position.set(-65, -0, -25);
      tree2.scale.set(70, 70, 70);
      scene.add(tree2);

      // let tree3 = mesh.scene.clone();
      // tree3.position.set(-18, -8, -16);
      // tree3.scale.set(22, 22, 22);
      // scene.add(tree3);
    });

    // 旗帜
    let mixerObj = { value: undefined };
    loader.load(flagModel, (mesh) => {
      mesh.scene.traverse((child: THREE.Mesh) => {
        if (child.isMesh) {
          // meshes.push(child);
          child.castShadow = true;
          const material = child.material as THREE.MeshStandardMaterial;

          // 旗帜
          if (child.name === "mesh_0001") {
            material.metalness = 0.1;
            material.roughness = 0.1;
            material.map = new THREE.TextureLoader().load(flagTexture);
          }

          // 旗杆
          if (child.name === "柱体") {
            material.metalness = 0.6;
            material.roughness = 0;
            // material.refractionRatio = 1;
            material.color = new THREE.Color(0xeeeeee);
          }
        }
      });

      mesh.scene.rotation.y = Math.PI / 24;
      mesh.scene.position.set(15, 10, 30);
      mesh.scene.scale.set(13, 13, 13);

      // // 动画
      const meshAnimation = mesh.animations[0];
      mixerObj.value = new THREE.AnimationMixer(mesh.scene);

      let clipAction = mixerObj.value.clipAction(meshAnimation).play();

      scene.add(mesh.scene);
    });

    // 五环
    const fiveCyclesGroup = new THREE.Group();
    const fiveCycles = [
      // blue
      { key: "cycle_0", color: 0x0885c2, position: { x: -250, y: 0, z: 0 } },
      // black
      { key: "cycle_1", color: 0x000000, position: { x: -10, y: 0, z: 5 } },
      // red
      { key: "cycle_2", color: 0xed334e, position: { x: 230, y: 0, z: 0 } },
      // yellow
      {
        key: "cycle_3",
        color: 0xfbb132,
        position: { x: -125, y: -100, z: -5 },
      },
      // green
      { key: "cycle_4", color: 0x1c8b3c, position: { x: 115, y: -100, z: 10 } },
    ];

    fiveCycles.map((item) => {
      let cycleMesh = new THREE.Mesh(
        new THREE.TorusGeometry(100, 10, 10, 50),
        new THREE.MeshLambertMaterial({
          color: new THREE.Color(item.color),
          side: THREE.DoubleSide,
        })
      );

      cycleMesh.castShadow = true;
      cycleMesh.position.set(item.position.x, item.position.y, item.position.z);
      // meshes.push(cycleMesh);
      fiveCyclesGroup.add(cycleMesh);
    });

    fiveCyclesGroup.scale.set(0.1, 0.1, 0.1);
    fiveCyclesGroup.position.set(0, 50, 0);
    scene.add(fiveCyclesGroup);

    // 雪花
    const texture = new THREE.TextureLoader().load(snowTexture);
    const geometry = new THREE.BufferGeometry();
    const pointsMaterial = new THREE.PointsMaterial({
      size: 3.5,
      transparent: true,
      opacity: 0.8,
      map: texture,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthTest: false,
    });

    let range = 100;
    let vertices: THREE.Vector3[] = [];
    // let vertices: number[] = [];
    for (let i = 0; i < 1500; i++) {
      let vertice = new THREE.Vector3(
        Math.random() * range - range / 2,
        Math.random() * range * 1.5,
        Math.random() * range - range / 2
      );
      // const vertice = [
      //   Math.random() * range - range / 2,
      //   Math.random() * range * 1.5,
      //   Math.random() * range - range / 2,
      // ];
      // 纵向移动速度
      (vertice as any).velocityY = 0.1 + Math.random() / 3;
      // // // 横向移动速度
      (vertice as any).velocityX = (Math.random() - 0.5) / 3;

      vertices.push(vertice);
    }
    // console.log(vertices, '[vertices]')
    // let positionArr = vertices.reduce((acc, item) => {
    //   acc = acc.concat(...item);
    //   return acc;
    // }, []);
    // geometry.setAttribute(
    //   "position",
    //   new THREE.Float32BufferAttribute(positionArr, 3)
    // );
    geometry.setFromPoints(vertices);

    geometry.center();
    let points = new THREE.Points(geometry, pointsMaterial);
    points.position.y = -15;
    points.scale.set(1.8, 1.8, 1.8);
    scene.add(points);
    console.log(points, "[points]");
    console.log(points.geometry.attributes.position.array, "[points.geometry]");
    console.log(vertices, "[vertices]");

    // let pVertices = points.geometry.vertices;

    const trackballControls = this.initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    this.renderScene({
      renderer,
      scene,
      camera,
      trackballControls,
      clock,
      mixer: mixerObj,
      vertices,
      points,
    });
  }

  renderScene(
    renderObj: {
      renderer: THREE.WebGLRenderer;
      scene: THREE.Scene;
      camera: THREE.Camera;
      trackballControls: TrackballControls;
      mixer: { value: THREE.AnimationMixer };
      clock: THREE.Clock;
      vertices: any[];
      points: THREE.Points;
    }
  ) {
    // console.log(111)
    const {
      renderer,
      scene,
      camera,
      trackballControls,
      clock,
      mixer,
      vertices,
      points,
    } = renderObj;
    trackballControls.update();
    requestAnimationFrame(this.renderScene.bind(this, renderObj));
    renderer.render(scene, camera);
    // 雪花
    vertices.forEach(function (v) {
      v.y = v.y - v.velocityY;
      v.x = v.x - v.velocityX;
      if (v.y <= 0) v.y = 60;
      if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
      // v[1] = v[1] - v.velocityY;
      // v[0] = v[0] - v.velocityX;
      // if (v[1] <= 0) v[1] = 60;
      // if (v[0] <= -20 || v[0] >= 20) v.velocityX = v.velocityX * -1;
    });
    points.geometry.setFromPoints(vertices);

    // let positionArr = vertices.reduce((acc, item) => {
    //   acc = acc.concat(...item);
    //   return acc;
    // }, []);
    // points.geometry.setAttribute(
    //   "position",
    //   new THREE.Float32BufferAttribute(positionArr, 3)
    // );
    

    mixer.value && mixer.value.update(clock.getDelta());
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
