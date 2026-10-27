import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Simple particle globe
function ParticleGlobe() {
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  // Mouse reactive rotation
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.1
      // React to mouse
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, mouse.current.y * 0.2, 0.05)
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, mouse.current.x * 0.2, 0.05)
    }
  })

  // Create point cloud
  const particles = new THREE.BufferGeometry()
  const count = 3000
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    pos[i * 3] = Math.sin(phi) * Math.cos(theta) * 2
    pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * 2
    pos[i * 3 + 2] = Math.cos(phi) * 2
  }
  particles.setAttribute('position', new THREE.BufferAttribute(pos, 3))

  return (
    <points ref={pointsRef} geometry={particles}>
      <pointsMaterial size={0.02} color="#00e5ff" transparent opacity={0.6} />
    </points>
  )
}

export function InteractiveGlobe() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <ParticleGlobe />
      </Canvas>
    </div>
  )
}
