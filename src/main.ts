import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
// import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';

const warning = document.getElementById('warning');

const loader = document.getElementById('loader') as HTMLDivElement;

const websiteInterface = document.getElementById('hero-section') as HTMLElement;

const viewCarBtn = document.getElementById(
  'view-3d-controls-btn'
) as HTMLButtonElement;

const redCarBtn = document.querySelector(
  '.car-color-red-li-item'
) as HTMLElement;
const blueCarBtn = document.querySelector(
  '.car-color-blue-li-item'
) as HTMLElement;
const yellowCarBtn = document.querySelector(
  '.car-color-yellow-li-item'
) as HTMLElement;
const blackCarBtn = document.querySelector(
  '.car-color-black-li-item'
) as HTMLElement;

if (window.innerWidth < 1200) {
  warning?.classList.remove('hide');
  loader.remove();
} else {
  const canvas = document.querySelector('canvas') as HTMLCanvasElement;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.z = 5;

  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  renderer.setSize(window.innerWidth, window.innerHeight);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
  });

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = false;
  controls.enableDamping = true;

  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 50);
  directionalLight.position.set(0, 20, 10);
  // spotLight.angle = Math.PI;
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // const directionalLightHelper = new THREE.DirectionalLightHelper(
  //   directionalLight,
  //   5,
  //   0x0000000
  // );
  // scene.add(directionalLightHelper);

  // const grid = new THREE.GridHelper();
  // scene.add(grid);

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 5),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  scene.add(plane);
  plane.rotation.x = Math.PI + Math.PI / 2;
  plane.position.y = -1.1;
  plane.receiveShadow = true;

  let carModel: THREE.Object3D;

  new GLTFLoader().load('models/scene.glb', (gltf) => {
    carModel = gltf.scene.children[0].children[0];

    carModel.traverse((node: any) => {
      if (node.isMesh) {
        node.castShadow = true;
        // node.material.envMap = texture;
      }
    });

    (
      (carModel.children[13] as THREE.Mesh)
        .material as THREE.MeshPhysicalMaterial
    ).color = new THREE.Color(0xfe4443);

    carModel.scale.set(2.5, 2.5, 2.5);

    carModel.rotation.z = Math.PI / 2;
    carModel.rotation.x = Math.PI + Math.PI / 2;
    carModel.position.x = -2;
    carModel.position.y = -2.3;

    redCarBtn.addEventListener('click', () => {
      (
        (carModel.children[13] as THREE.Mesh)
          .material as THREE.MeshPhysicalMaterial
      ).color = new THREE.Color(0xfe4443);
    });

    blueCarBtn.addEventListener('click', () => {
      (
        (carModel.children[13] as THREE.Mesh)
          .material as THREE.MeshPhysicalMaterial
      ).color = new THREE.Color(0x000fff);
    });

    yellowCarBtn.addEventListener('click', () => {
      (
        (carModel.children[13] as THREE.Mesh)
          .material as THREE.MeshPhysicalMaterial
      ).color = new THREE.Color(0xffff00);
    });

    blackCarBtn.addEventListener('click', () => {
      (
        (carModel.children[13] as THREE.Mesh)
          .material as THREE.MeshPhysicalMaterial
      ).color = new THREE.Color(0x000000);
    });

    scene.add(carModel);

    console.log(carModel);

    loader.remove();
  });

  viewCarBtn?.addEventListener('click', () => {
    websiteInterface.classList.toggle('move');
    websiteInterface.classList.contains('move')
      ? (viewCarBtn.textContent = 'Back')
      : (viewCarBtn.textContent = 'View3D');
    controls.enabled ? (controls.enabled = false) : (controls.enabled = true);
    controls.enabled
      ? gsap.to(camera.position, {
          x: 5,
          y: 1,
          z: 5,
        })
      : gsap.to(camera.position, {
          x: 0,
          y: 0,
          z: 5,
        });
  });

  function animate() {
    requestAnimationFrame(animate);

    if (controls.enabled) {
      controls.update();
    }

    renderer.render(scene, camera);

    camera.lookAt(0, 0, 0);
  }

  animate();
}
