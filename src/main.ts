import * as THREE from 'three';
import { Group, Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as ObjectsInRoom from './objectsInRoom';

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, grid_helper, axesHelper, controls

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(50, 50, 80);
camera.updateProjectionMatrix();
/*
    @param1 = 75 is FOV,
    @param2 is aspect ratio = width / height
    @param3 = 0.1 is near clipping plane, anything close than this will not be rendered
    @param4 = 3000 is far clipping plane, anything farther than this will not be rendered
*/

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);

grid_helper = new THREE.GridHelper(200, 50);
scene.add(grid_helper);

axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

const ambient_light = new THREE.AmbientLight(0xffffff, 1);
const direct_light = new THREE.DirectionalLight(0xffffff, 0.86);
scene.add(ambient_light, direct_light);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate); // tells the browser we are ready, pass in a function
  renderer.render(scene, camera);
}

//=======
function computeGroupCenter(group: Group) {
  let center = new THREE.Vector3();
  let children = group.children;
  let count = children.length;
  for (let i = 0; i < count; i++) {
    center.add(children[i].position);
  }
  center.divideScalar(count);
  return center;
}

let objectMaker = new ObjectsInRoom.ObjectsInRoom();

let closetRows = new THREE.Group();
let railGroup = new THREE.Group();
let closetOnRailModule = new THREE.Group();

for (let i = 0; i < 6; i++) {
  let closetRow = objectMaker.makeClosetRow(11);
  closetRow.translateZ(i * 15);
  closetRows.add(closetRow)
}
closetRows.translateZ(computeGroupCenter(closetRows).z * -1);

for (let i = 0; i < 3; i++) {
  let rail = objectMaker.makeRail();
  rail.translateX(i * 35);
  railGroup.add(rail);
}
railGroup.translateX(computeGroupCenter(railGroup).x * -1);

closetOnRailModule.add(closetRows, railGroup);


let railGroupBox = new THREE.Box3().setFromObject(railGroup); // get bounding box of a group
const railGroupBoxHelper = new THREE.BoxHelper(railGroup, 0xffff00); // visual helper
const closetRowsBoxHelper = new THREE.BoxHelper(closetRows, 0x00ffff);
const closetOnRailModuleBoxHelper = new THREE.BoxHelper(closetOnRailModule, 0xff00ff);

scene.add(closetRows, railGroup, railGroupBoxHelper, closetRowsBoxHelper, closetOnRailModuleBoxHelper);



animate();