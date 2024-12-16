import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js';


let scene, camera, renderer, logo, light;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(300, 300);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 4;

    // Lighting
   light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 2);
    scene.add(light);


   const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
   scene.add(ambientLight);



    // Load the 3D model (replace 'path/to/your/logo.glb' with your actual path)
    const loader = new GLTFLoader();
    loader.load('logo.glb', function (gltf) {
        logo = gltf.scene;
        scene.add(logo);
        logo.rotation.x = 0;
        logo.rotation.y = -Math.PI / 2 ;

         // Optional: Scale the logo
        logo.scale.set(0.15,0.15,0.15)


    }, undefined, function (error) {
        console.error(error);
    });



  window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(300,300);
}



function animate() {
  requestAnimationFrame(animate);
 if (logo) {
        logo.rotation.y += 0.01; // Adjust rotation speed

    }


   renderer.render(scene, camera);


}



// Function to load and display a model in a placeholder
function loadModel(modelPath, placeholderId) {
  const loader = new GLTFLoader();
  loader.load(
    modelPath,
    function (gltf) {
      const model = gltf.scene;
      const placeholder = document.getElementById(placeholderId);
      if (placeholder) {
        const placeholderWidth = placeholder.offsetWidth;
        const placeholderHeight = placeholder.offsetHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, placeholderWidth / placeholderHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(placeholderWidth, placeholderHeight);
        placeholder.appendChild(renderer.domElement);

        // Adjust camera position based on model size
       const boundingBox = new THREE.Box3().setFromObject(model);
        const center = boundingBox.getCenter(new THREE.Vector3());
         const size = boundingBox.getSize(new THREE.Vector3());
         const maxSize = Math.max(size.x, size.y, size.z);
        const cameraDistance = maxSize * 1.5;
        camera.position.z = cameraDistance;
        camera.lookAt(center);


        // Lighting
       const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
         directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
        scene.add(ambientLight);


        scene.add(model);

        function animateModel() {
          requestAnimationFrame(animateModel);
          model.rotation.y += 0.01;
          renderer.render(scene, camera);
        }
        animateModel();
      }
    },
    undefined,
    function (error) {
      console.error(`Error loading model at ${modelPath}`, error);
    }
  );
}


window.addEventListener('load', () => {
  init();

  loadModel('dataAnalysis.glb', 'dataAnalysis-model');
  loadModel('consulting.glb', 'consulting-model');
  loadModel('automation.glb', 'automation-model');
  loadModel('digitalLibrary.glb', 'digitalLibrary-model');
});