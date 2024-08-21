import React, {useRef, useMemo, useEffect} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import * as THREE from 'three';

const BlockNetwork = () => {
  const groupRef = useRef()
  const particlesRef = useRef()
  const linesGeometryRef = useRef()

  const maxParticleCount = 1000
  const particleCount = 600
  const r = 10
  const rHalf = r / 2
  const maxConnections = 20
  const minDistance = 2.5
  let vertexpos = 0
  let colorpos = 0
  let numConnected = 0

  const segments = maxParticleCount * maxParticleCount
  const positions = useMemo(() => new Float32Array(segments * 3), [segments])
  const colors = useMemo(() => new Float32Array(segments * 3), [segments])

  const particlePositions = useMemo(() => new Float32Array(maxParticleCount * 3), [])
  const particleColors = useMemo(() => new Float32Array(maxParticleCount * 3), [])

  const particlesData = useMemo(() => [], [])

  const v = useMemo(() => new THREE.Vector3(), [])

  const calculateColor = (x, y, z) => {
    // calculate the color that the point should take
    const spherical = new THREE.Spherical();
    spherical.setFromCartesianCoords(x, y, z);

    // Map the spherical coordinates to RGB values
    const hue = (spherical.phi + Math.PI) / (2 * Math.PI);
    
    // Define the three colors
    const color1 = new THREE.Color('#c59df2');
    const color2 = new THREE.Color('#ef7c71');

    // Blend the colors based on the spherical coordinate
    const blendedColor = new THREE.Color();
    blendedColor.lerpColors(color1, color2, hue ** 2);

    return blendedColor;
  }

  useEffect(() => {
    for (let i = 0; i < maxParticleCount; i++) {
      const x = Math.random() * r - r / 2
      const y = Math.random() * r - r / 2
      const z = Math.random() * r - r / 2

      particlePositions[i * 3] = x
      particlePositions[i * 3 + 1] = y
      particlePositions[i * 3 + 2] = z

      let color = calculateColor(x, y, z)

      particleColors[i * 3] = color.r
      particleColors[i * 3 + 1] = color.g
      particleColors[i * 3 + 2] = color.g

      const v = new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2)
      particlesData.push({ velocity: v.normalize().divideScalar(200), numConnections: 0 })
    }

    particlesRef.current.setDrawRange(0, particleCount)
  })

  useFrame((_, delta) => {
    vertexpos = 0
    colorpos = 0
    numConnected = 0

    for (let i = 0; i < particleCount; i++) particlesData[i].numConnections = 0

    for (let i = 0; i < particleCount; i++) {
      const particleData = particlesData[i]

      v.set(particlePositions[i * 3], particlePositions[i * 3 + 1], particlePositions[i * 3 + 2])
        .add(particleData.velocity)
        .setLength(10)
      particlePositions[i * 3] = v.x
      particlePositions[i * 3 + 1] = v.y
      particlePositions[i * 3 + 2] = v.z

      let color = calculateColor(v.x, v.y, v.z)

      particleColors[i * 3] = color.r
      particleColors[i * 3 + 1] = color.g
      particleColors[i * 3 + 2] = color.b

      if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf) particleData.velocity.y = -particleData.velocity.y

      if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf) particleData.velocity.x = -particleData.velocity.x

      if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf) particleData.velocity.z = -particleData.velocity.z

      if (particleData.numConnections >= maxConnections) continue

      for (let j = i + 1; j < particleCount; j++) {
        const particleDataB = particlesData[j]
        if (particleDataB.numConnections >= maxConnections) continue

        const dx = particlePositions[i * 3] - particlePositions[j * 3]
        const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1]
        const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < minDistance) {
          particleData.numConnections++
          particleDataB.numConnections++

          positions[vertexpos++] = particlePositions[i * 3]
          positions[vertexpos++] = particlePositions[i * 3 + 1]
          positions[vertexpos++] = particlePositions[i * 3 + 2]

          positions[vertexpos++] = particlePositions[j * 3]
          positions[vertexpos++] = particlePositions[j * 3 + 1]
          positions[vertexpos++] = particlePositions[j * 3 + 2]

          const color2 = calculateColor(particlePositions[j * 3], particlePositions[j * 3 + 1], particlePositions[j * 3 + 2]);

          colors[colorpos++] = color.r;
          colors[colorpos++] = color.g;
          colors[colorpos++] = color.b

          colors[colorpos++] = color2.r
          colors[colorpos++] = color2.g
          colors[colorpos++] = color2.b

          numConnected++
        }
      }
    }

    linesGeometryRef.current.setDrawRange(0, numConnected * 2)
    linesGeometryRef.current.attributes.position.needsUpdate = true
    linesGeometryRef.current.attributes.color.needsUpdate = true

    particlesRef.current.attributes.position.needsUpdate = true
    particlesRef.current.attributes.color.needsUpdate = true

    groupRef.current.rotation.y += delta / 10
  })

  return (
    <group ref={groupRef} dispose={null}>
      <points>
        <bufferGeometry ref={particlesRef}>
          <bufferAttribute attach="attributes-position" count={particleCount} array={particlePositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={particleCount} array={particleColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color='white' size={3} blending={THREE.AdditiveBlending} transparent={true} sizeAttenuation={false} />
      </points>
      <lineSegments>
        <bufferGeometry ref={linesGeometryRef}>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color='#aaa' vertexColors={true} blending={THREE.AdditiveBlending} transparent={false} fog={false} />
      </lineSegments>
    </group>
  )
};

const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 17.5] }} gl={{outputEncoding: THREE.sRGBEncoding}} flat legacy={false}>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enableZoom={false} />
      <BlockNetwork />
    </Canvas>
  );
};

export default App;
