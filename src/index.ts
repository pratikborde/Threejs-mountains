import * as three from 'three'
import simplexNoise from 'simplex-noise'

const width = window.innerWidth
const height = window.innerHeight
const rendererBg = new three.Color('#b1d1c5')
const clothColor = '#ffaaa5'

let renderer: three.WebGLRenderer
let scene: three.Scene
let camera: three.PerspectiveCamera
let mesh: three.Mesh
let geometry: three.Geometry
let noise: simplexNoise

init()

function init() {
  document.body.style.margin = '0'
  createScene()
  createCamera()
  createCloth()
  addPointlight('#fdffab')
  addAmbientLight()
  animate()

  window.addEventListener('resize', onResize)
}

function onResize() {
  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

function createScene() {
  scene = new three.Scene()
  renderer = new three.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(rendererBg)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = three.PCFSoftShadowMap
  noise = new simplexNoise()

  document.body.appendChild(renderer.domElement)
}

function createCamera() {
  camera = new three.PerspectiveCamera(20, width / height, 1, 1000)
  camera.position.set(0, 0, 13)
}

function createCloth() {
  const seg = 160
  geometry = new three.PlaneGeometry(18, 18, seg, seg)
  const material = new three.MeshPhysicalMaterial({
    color: clothColor,
    metalness: 0.6,
    emissive: '#000',
    side: three.DoubleSide,
    wireframe: false
  })
  mesh = new three.Mesh(geometry, material)
  mesh.receiveShadow = true
  mesh.castShadow = true
  mesh.position.set(0, 0, 0)
  mesh.rotation.x = -Math.PI / 2.4
  mesh.rotation.z = Math.PI / 2
  scene.add(mesh)
}

function addPointlight(color: string | number | three.Color | undefined) {
  const light = new three.PointLight(color, 2, 1000, 20)
  light.position.set(0, 8, -13)
  scene.add(light)
}

function addAmbientLight() {
  const light = new three.AmbientLight('#fff', 0.5)
  scene.add(light)
}

function animate() {
  requestAnimationFrame(animate)
  const offset = Date.now() * 0.0008
  adjustVertices(offset)
  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
}

function adjustVertices(offset: number) {
  for (let i = 0; i < geometry.vertices.length; i++) {
    const vertex = geometry.vertices[i]
    const x = vertex.x / 4
    const y = vertex.y / 4
    vertex.z = noise.noise2D(x + offset, y)
  }
  geometry.verticesNeedUpdate = true
  geometry.computeVertexNormals()
}
