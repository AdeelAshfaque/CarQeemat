import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  AdaptiveDpr,
  Clone,
  Environment,
  Lightformer,
  PerformanceMonitor,
  useGLTF,
  useProgress,
} from '@react-three/drei'
import * as THREE from 'three'
import { KTX2Loader } from 'three-stdlib'
import type { GLTFLoader } from 'three-stdlib'

type HeroCarSceneProps = {
  onProgress: (progress: number) => void
  onReady: () => void
  onMissing: () => void
  onUnavailable: () => void
}
const modelPath = `${import.meta.env.BASE_URL}models/car-concept.glb`
const basisPath = `${import.meta.env.BASE_URL}basis/`
const modelScale = 1.08

function getBaseDpr() {
  const compact = window.matchMedia('(max-width: 700px)').matches
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  const cores = navigator.hardwareConcurrency || 8
  const lowEnd = memory <= 4 || cores <= 4
  return Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.55, lowEnd ? 1 : 1.55)
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reducedMotion
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

function ModelLoadFallback() {
  return null
}

function WebGLFallback({ onUnavailable }: { onUnavailable: () => void }) {
  useEffect(() => onUnavailable(), [onUnavailable])
  return null
}

function CarModel({
  onReady,
  reducedMotion,
}: Pick<HeroCarSceneProps, 'onReady'> & {
  reducedMotion: boolean
}) {
  const { gl, camera, pointer, size } = useThree()
  const { scene } = useGLTF(
    modelPath,
    false,
    true,
    useCallback(
      (loader: GLTFLoader) => {
        const ktx2 = new KTX2Loader()
          .setTranscoderPath(basisPath)
          .detectSupport(gl)
        loader.setKTX2Loader(ktx2)
      },
      [gl],
    ),
  )
  const modelRef = useRef<THREE.Group>(null)
  const bounds = useMemo(() => new THREE.Box3().setFromObject(scene), [scene])
  const center = useMemo(() => bounds.getCenter(new THREE.Vector3()), [bounds])
  const offset = useMemo(
    () => [-center.x * modelScale, -bounds.min.y * modelScale, -center.z * modelScale] as [number, number, number],
    [bounds, center],
  )

  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = false
        object.receiveShadow = false
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.envMapIntensity = Math.max(material.envMapIntensity, 1.05)
          }
        })
      }
    })
    onReady()
  }, [onReady, scene])

  useFrame((state, delta) => {
    if (modelRef.current) {
      const pointerX = reducedMotion ? 0 : pointer.x
      const pointerY = reducedMotion ? 0 : pointer.y
      const idleTurn = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.13) * 0.035
      const targetRotation = (reducedMotion ? 0 : pointerX * 0.2 + idleTurn) + 0.24
      modelRef.current.rotation.y = THREE.MathUtils.damp(
        modelRef.current.rotation.y,
        targetRotation,
        2.8,
        delta,
      )
      modelRef.current.rotation.x = THREE.MathUtils.damp(
        modelRef.current.rotation.x,
        -pointerY * 0.025,
        2.2,
        delta,
      )
    }

    const perspectiveCamera = camera as THREE.PerspectiveCamera
    const compact = size.width < 680
    const targetX = compact ? 5.2 : 6.2
    const targetY = compact ? 2.5 : 2.8
    const targetZ = compact ? 9.1 : 8.7
    // R3F's camera is intentionally updated in the frame loop for a smooth scroll response.
    // oxlint-disable react/immutability
    perspectiveCamera.position.x = THREE.MathUtils.damp(perspectiveCamera.position.x, targetX, 1.7, delta)
    perspectiveCamera.position.y = THREE.MathUtils.damp(perspectiveCamera.position.y, targetY, 1.7, delta)
    perspectiveCamera.position.z = THREE.MathUtils.damp(perspectiveCamera.position.z, targetZ, 1.7, delta)
    perspectiveCamera.lookAt(0, 0.76, 0)
    // oxlint-enable react/immutability
  })

  return (
    <group>
      <group position={offset} scale={modelScale}>
        <group ref={modelRef}>
          <Clone object={scene} />
        </group>
      </group>
    </group>
  )
}

function Studio({
  onReady,
  onMissing,
  reducedMotion,
}: Pick<HeroCarSceneProps, 'onReady' | 'onMissing'> & {
  reducedMotion: boolean
}) {
  return (
    <>
      <hemisphereLight args={[0xf3efdf, 0x163326, 1.65]} />
      <directionalLight
        intensity={3.8}
        position={[-4.5, 7, 4.5]}
      />
      <spotLight
        angle={0.55}
        color="#e5d1a9"
        decay={1.5}
        distance={24}
        intensity={64}
        penumbra={0.7}
        position={[4, 6, -4]}
        target-position={[0, 0.65, 0]}
      />
      <pointLight color="#7eaa82" decay={2} distance={13} intensity={8} position={[-5, 1, 2]} />
      <Environment background={false} resolution={128}>
        <Lightformer color="#fff0d1" form="rect" intensity={4.5} position={[-4, 4, 2]} scale={[4.5, 5, 1]} />
        <Lightformer color="#d9c39b" form="rect" intensity={3.5} position={[4, 3, -2]} scale={[3.5, 4, 1]} />
        <Lightformer color="#fff4df" form="rect" intensity={2.2} position={[0, 5, 5]} scale={[6, 1.5, 1]} />
      </Environment>
      <ModelErrorBoundary onError={onMissing}>
        <Suspense fallback={<ModelLoadFallback />}>
          <CarModel
            onReady={onReady}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </ModelErrorBoundary>
    </>
  )
}

export default function HeroCarScene({
  onProgress,
  onReady,
  onMissing,
  onUnavailable,
}: HeroCarSceneProps) {
  const progress = useProgress((state) => state.progress)
  const [baseDpr] = useState(getBaseDpr)
  const [dpr, setDpr] = useState(baseDpr)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    onProgress(Math.round(progress))
  }, [onProgress, progress])

  const reduceQuality = useCallback(() => {
    setDpr((current) => Math.max(0.75, current * 0.82))
  }, [])
  const restoreQuality = useCallback(() => {
    setDpr((current) => Math.min(baseDpr, current * 1.12))
  }, [baseDpr])

  return (
    <div aria-label="Interactive automotive studio scene" className="cq-scene-host">
      <Canvas
        camera={{ fov: 34, near: 0.1, far: 60, position: [6.2, 2.8, 8.7] }}
        className="cq-scene-canvas"
        dpr={dpr}
        fallback={<WebGLFallback onUnavailable={onUnavailable} />}
        gl={{
          alpha: true,
          antialias: baseDpr > 1,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'low-power',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        performance={{ min: 0.55 }}
      >
        <PerformanceMonitor onDecline={reduceQuality} onIncline={restoreQuality} flipflops={2} />
        <AdaptiveDpr pixelated />
        <Studio
          onMissing={onMissing}
          onReady={onReady}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  )
}
