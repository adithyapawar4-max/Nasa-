import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const TEXTURES = {
  day: '/textures/earth_day_4096.jpg',
  normal: '/textures/earth_normal_2048.jpg',
  specular: '/textures/earth_specular_2048.jpg',
  clouds: '/textures/earth_clouds_1024.png',
  moon: '/textures/moon_1024.jpg',
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function StarField() {
  const positions = useMemo(() => {
    const count = 1800
    const array = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 18 + Math.random() * 35
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7
      array[i * 3 + 2] = -Math.abs(radius * Math.cos(phi)) - 4
    }
    return array
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  return (
    <points geometry={geometry}>
      <pointsMaterial size={0.16} sizeAttenuation color="#cfe6ff" transparent opacity={0.85} depthWrite={false} />
    </points>
  )
}

function OrbitRing() {
  const geometry = useMemo(() => new THREE.RingGeometry(2.4, 2.42, 160), [])
  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color="#3f8fc4" transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function Moon({ reducedMotion, texture }: { reducedMotion: boolean; texture: THREE.Texture }) {
  const orbitRef = useRef<THREE.Group>(null)
  useEffect(() => {
    if (orbitRef.current) orbitRef.current.rotation.y = 0.1
  }, [])
  useFrame((_, delta) => {
    if (!reducedMotion && orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.02
    }
  })
  return (
    <group rotation={[0.5, 0, 0.1]}>
      <OrbitRing />
      <group ref={orbitRef}>
        <mesh position={[2.4, 0, 0]}>
          <sphereGeometry args={[0.3, 48, 48]} />
          <meshStandardMaterial map={texture} roughness={1} metalness={0} emissive="#1b2534" emissiveIntensity={0.45} />
        </mesh>
      </group>
    </group>
  )
}

function EarthSystem({ reducedMotion }: { reducedMotion: boolean }) {
  const earthRef = useRef<THREE.Group>(null)
  const cloudRef = useRef<THREE.Mesh>(null)
  const rotationRef = useRef(0)
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 })
  const tiltRef = useRef(0)
  const { viewport, gl } = useThree()

  const [day, normal, specular, clouds, moon] = useLoader(THREE.TextureLoader, [
    TEXTURES.day,
    TEXTURES.normal,
    TEXTURES.specular,
    TEXTURES.clouds,
    TEXTURES.moon,
  ])

  const compact = viewport.width < 6
  const scale = compact ? 0.48 : Math.min(0.9, viewport.width / 9.5)
  const x = compact ? 0 : viewport.width * 0.18
  const y = compact ? viewport.height * 0.18 : viewport.height * 0.04

  useEffect(() => {
    gl.domElement.style.touchAction = 'pan-y'
  }, [gl])

  // Drag interaction across the page background (never over interactive UI).
  useEffect(() => {
    const isInteractive = (target: EventTarget | null) => {
      const el = target as HTMLElement | null
      return Boolean(el?.closest?.('a, button, select, input, textarea, label, table, [role="button"]'))
    }

    const onDown = (event: PointerEvent) => {
      if (isInteractive(event.target)) return
      dragRef.current.active = true
      dragRef.current.lastX = event.clientX
      dragRef.current.lastY = event.clientY
      document.body.style.cursor = 'grabbing'
    }
    const onMove = (event: PointerEvent) => {
      if (!dragRef.current.active) return
      const dx = event.clientX - dragRef.current.lastX
      const dy = event.clientY - dragRef.current.lastY
      dragRef.current.lastX = event.clientX
      dragRef.current.lastY = event.clientY
      rotationRef.current += dx * 0.005
      tiltRef.current = THREE.MathUtils.clamp(tiltRef.current + dy * 0.002, -0.35, 0.35)
    }
    const stop = () => {
      if (!dragRef.current.active) return
      dragRef.current.active = false
      document.body.style.cursor = ''
    }

    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      document.body.style.cursor = ''
    }
  }, [])

  useFrame((_, delta) => {
    if (!reducedMotion && !dragRef.current.active) {
      rotationRef.current += delta * 0.055
    }
    if (earthRef.current) {
      earthRef.current.rotation.y = rotationRef.current
      earthRef.current.rotation.x = THREE.MathUtils.lerp(earthRef.current.rotation.x, tiltRef.current, 0.08)
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y = rotationRef.current * 0.18
    }
  })

  return (
    <group position={[x, y, 0]} scale={scale}>
      <group ref={earthRef}>
        <mesh>
          <sphereGeometry args={[1.35, 96, 96]} />
          <meshPhongMaterial
            map={day}
            normalMap={normal}
            normalScale={new THREE.Vector2(0.55, 0.55)}
            specularMap={specular}
            specular={new THREE.Color('#2a4a63')}
            shininess={16}
          />
        </mesh>

        <mesh ref={cloudRef} scale={1.012}>
          <sphereGeometry args={[1.35, 96, 96]} />
          <meshPhongMaterial
            map={clouds}
            transparent
            opacity={0.45}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh scale={1.055}>
          <sphereGeometry args={[1.35, 64, 64]} />
          <meshBasicMaterial
            color="#3f9bff"
            transparent
            opacity={0.16}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      <Moon reducedMotion={reducedMotion} texture={moon} />
    </group>
  )
}

export function SpaceGlobeBackground() {
  const reducedMotion = useReducedMotion()

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#040812]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#0A1730_0%,#050A14_55%,#02040A_100%)]" />
      <div className="absolute inset-0 opacity-30 [background:radial-gradient(900px_500px_at_80%_20%,rgba(0,102,204,0.28),transparent_60%),radial-gradient(700px_400px_at_15%_80%,rgba(74,78,106,0.18),transparent_65%)]" />

      <Canvas
        camera={{ position: [0, 0, 7], fov: 42, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        frameloop="always"
      >
        <ambientLight intensity={0.16} />
        <directionalLight position={[5, 3, 5]} intensity={2.4} color="#fff6e8" />
        <directionalLight position={[-4, -2, -3]} intensity={0.18} color="#4f8fff" />
        <Suspense fallback={null}>
          <EarthSystem reducedMotion={reducedMotion} />
        </Suspense>
        <StarField />
      </Canvas>

      {/* Left-to-right scrim keeps the dashboard readable over the globe. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,8,18,0.94)_0%,rgba(4,8,18,0.78)_38%,rgba(4,8,18,0.28)_70%,rgba(4,8,18,0.55)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(2,4,10,0.55)_100%)]" />
    </div>
  )
}

export { TEXTURES as GLOBE_TEXTURES }