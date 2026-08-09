import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import type { InspectableArenaElement } from '../../domain/entities/InspectableArenaElement';
import type { ArenaScenePort } from '../../application/ports/ArenaScenePort';

export class ThreeArenaSceneAdapter implements ArenaScenePort {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10000);
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true });
  private readonly controls: OrbitControls;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();

  private arenaRoot: THREE.Group | null = null;
  private selectionListener: (element: InspectableArenaElement | null) => void = () => undefined;
  private loadedListener: () => void = () => undefined;
  private animationFrameId = 0;
  private inspectorEnabled = false;
  private readonly assetBasePath = import.meta.env.BASE_URL;
  private arenaSize = new THREE.Vector3(1, 1, 1);
  private selectionHelpers: THREE.LineSegments[] = [];

  public constructor(private readonly viewport: HTMLElement) {
    this.scene.background = new THREE.Color(0x222222);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.zoomToCursor = true;
    this.controls.screenSpacePanning = true;
    this.controls.rotateSpeed = 0.8;
    this.controls.zoomSpeed = 1.1;
    this.controls.panSpeed = 0.9;
    this.controls.maxPolarAngle = Math.PI * 0.48;
    this.camera.position.set(10, 15, 20);
  }

  public initialize(): void {
    this.viewport.appendChild(this.renderer.domElement);
    this.setupLights();
    this.bindEvents();
    this.resize();
    this.animate();
  }

  public async loadArena(): Promise<void> {
    const materials = await this.loadMaterials();
    const arena = await this.loadObject(materials);

    this.arenaRoot = arena;
    this.positionArena(arena);
    this.scene.add(arena);
    this.fitCameraToArena(arena);
    this.loadedListener();
  }

  public setInspectorEnabled(enabled: boolean): void {
    this.inspectorEnabled = enabled;
    this.controls.enabled = !enabled;

    if (!enabled) {
      this.clearSelectionHighlight();
    }
  }

  public onArenaElementSelected(listener: (element: InspectableArenaElement | null) => void): void {
    this.selectionListener = listener;
  }

  public onArenaLoaded(listener: () => void): void {
    this.loadedListener = listener;
  }

  public dispose(): void {
    window.removeEventListener('resize', this.handleResize);
    this.renderer.domElement.removeEventListener('click', this.handleClick);
    this.renderer.domElement.removeEventListener('dblclick', this.handleDoubleClick);
    cancelAnimationFrame(this.animationFrameId);
    this.controls.dispose();
    this.clearSelectionHighlight();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 40, 20);

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.handleResize);
    this.renderer.domElement.addEventListener('click', this.handleClick);
    this.renderer.domElement.addEventListener('dblclick', this.handleDoubleClick);
  }

  private readonly handleResize = (): void => {
    this.resize();
  };

  private readonly handleClick = (event: MouseEvent): void => {
    if (!this.inspectorEnabled || !this.arenaRoot) {
      return;
    }

    const intersections = this.intersectArena(event);
    if (intersections.length === 0) {
      this.clearSelectionHighlight();
      this.selectionListener(null);
      return;
    }

    const selectedObject = this.findInspectableObject(intersections[0].object);
    this.highlightSelection(selectedObject);
    this.selectionListener(this.describeObject(selectedObject, {
      x: event.clientX,
      y: event.clientY,
    }));
  };

  private readonly handleDoubleClick = (event: MouseEvent): void => {
    if (this.inspectorEnabled || !this.arenaRoot) {
      return;
    }

    const intersections = this.intersectArena(event);
    if (intersections.length === 0) {
      return;
    }

    this.focusOnPoint(intersections[0].point);
  };

  private resize(): void {
    const width = this.viewport.clientWidth;
    const height = this.viewport.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => {
      this.animate();
    });
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private loadMaterials(): Promise<MTLLoader.MaterialCreator> {
    return new Promise((resolve, reject) => {
      const loader = new MTLLoader();
      loader.setPath(this.assetBasePath);
      loader.load('arena.mtl', (materials: MTLLoader.MaterialCreator) => {
        materials.preload();
        resolve(materials);
      }, undefined, reject);
    });
  }

  private loadObject(materials: MTLLoader.MaterialCreator): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      const loader = new OBJLoader();
      loader.setMaterials(materials);
      loader.setPath(this.assetBasePath);
      loader.load('arena.obj', (arena: THREE.Group) => {
        resolve(arena);
      }, undefined, reject);
    });
  }

  private positionArena(arena: THREE.Group): void {
    const box = new THREE.Box3().setFromObject(arena);
    const center = box.getCenter(new THREE.Vector3());

    arena.position.x -= center.x;
    arena.position.z -= center.z;
    arena.position.y -= box.min.y;
  }

  private fitCameraToArena(arena: THREE.Group): void {
    const box = new THREE.Box3().setFromObject(arena);
    const size = box.getSize(new THREE.Vector3());
    this.arenaSize.copy(size);
    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)));
    const fitWidthDistance = fitHeightDistance / this.camera.aspect;
    const distance = 1.2 * Math.max(fitHeightDistance, fitWidthDistance);

    this.controls.target.set(0, size.y * 0.35, 0);
    this.camera.position.set(distance * 0.6, size.y * 0.6, distance);
    this.controls.minDistance = Math.max(2, maxSize * 0.03);
    this.controls.maxDistance = Math.max(50, maxSize * 3);
    this.camera.near = Math.max(0.1, maxSize / 1000);
    this.camera.far = Math.max(10000, maxSize * 10);
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }

  private intersectArena(event: MouseEvent): THREE.Intersection<THREE.Object3D>[] {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.arenaRoot ? this.raycaster.intersectObject(this.arenaRoot, true) : [];
  }

  private focusOnPoint(point: THREE.Vector3): void {
    const offset = this.camera.position.clone().sub(this.controls.target);
    const maxHeight = Math.max(this.arenaSize.y * 1.2, 8);
    const nextOffset = offset.clone();
    nextOffset.y = THREE.MathUtils.clamp(nextOffset.y, this.arenaSize.y * 0.15, maxHeight);

    this.controls.target.copy(point);
    this.camera.position.copy(point).add(nextOffset);
    this.controls.update();
  }

  private highlightSelection(object: THREE.Object3D): void {
    this.clearSelectionHighlight();

    object.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (!('geometry' in mesh) || !(mesh.geometry instanceof THREE.BufferGeometry)) {
        return;
      }

      const edges = new THREE.EdgesGeometry(mesh.geometry, 20);
      const material = new THREE.LineBasicMaterial({
        color: 0xffb100,
        transparent: true,
        opacity: 0.95,
        depthTest: false,
      });
      const lines = new THREE.LineSegments(edges, material);
      lines.matrixAutoUpdate = false;
      lines.applyMatrix4(mesh.matrixWorld);
      this.selectionHelpers.push(lines);
      this.scene.add(lines);
    });
  }

  private clearSelectionHighlight(): void {
    if (this.selectionHelpers.length === 0) {
      return;
    }

    for (const helper of this.selectionHelpers) {
      this.scene.remove(helper);
      helper.geometry.dispose();
      if (Array.isArray(helper.material)) {
        for (const material of helper.material) {
          material.dispose();
        }
      } else {
        helper.material.dispose();
      }
    }

    this.selectionHelpers = [];
  }

  private findInspectableObject(object: THREE.Object3D): THREE.Object3D {
    let current: THREE.Object3D = object;

    while (current.parent && current.parent !== this.arenaRoot) {
      current = current.parent;
    }

    return current;
  }

  private describeObject(
    object: THREE.Object3D,
    screenPosition?: { x: number; y: number },
  ): InspectableArenaElement {
    const materialNames: string[] = [];

    object.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (!('material' in mesh) || !mesh.material) {
        return;
      }

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        if (material.name && !materialNames.includes(material.name)) {
          materialNames.push(material.name);
        }
      }
    });

    return {
      name: object.name || '(sin nombre)',
      materialNames,
      screenPosition,
    };
  }
}
