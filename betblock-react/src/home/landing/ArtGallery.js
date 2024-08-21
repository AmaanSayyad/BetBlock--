import React, {Suspense} from 'react'
import {
  Box,
  Typography,
  CircularProgress
} from '@mui/material/';
import { Canvas, useLoader } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { sRGBEncoding } from 'three/src/constants'
import ParentSize from '@visx/responsive/lib/components/ParentSize'
import Image0 from './gallerySample/sample0.png';
import Image1 from './gallerySample/sample1.png';
import Image2 from './gallerySample/sample2.png';
import Image3 from './gallerySample/sample3.png';
import Image4 from './gallerySample/sample4.png';
import Image5 from './gallerySample/sample5.png';

function NFTBox ({
  imageMap,
  ...props
}) {
  return (
    <mesh {...props}>
      <boxGeometry />
      <meshBasicMaterial attach="material-0" color={0xffffff} opacity={1} map={imageMap} />
      <meshBasicMaterial attach="material-1" color={0xffffff} opacity={1} map={imageMap} />
      <meshBasicMaterial attach="material-2" color={0xa0a0a0} opacity={1} />
      <meshBasicMaterial attach="material-3" color={0xa0a0a0} opacity={1} />
      <meshBasicMaterial attach="material-4" color={0xa0a0a0} opacity={1} />
      <meshBasicMaterial attach="material-5" color={0xa0a0a0} opacity={1} />
    </mesh>
  )
}

function ArtGallery ({
  height,
  width,
  gallery,
  cameraPos = [8.8, 0.5, 0],
  magnitude = 6,
  ...props
}) {
  let filteredG = gallery.filter((r) => r.ratio > 0)

  if (filteredG.length === 0) {
    <Box sx={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}><Typography>No NFTs available for display</Typography></Box>
  }
  const images = useLoader(TextureLoader, filteredG.map((g) => g.image))

  images.forEach((t) => {
    // Necessary to get correct colors with sRGB outputEncoding!
    t.encoding = sRGBEncoding;
  });

  return (
    <div style={{width: `${width}px`, height: `${height}px`}}>
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={cameraPos} />
        { filteredG.map((g, i) => {
          let t = i / filteredG.length * 2 * Math.PI;
          let yScale = 1.5 * (filteredG[i].ratio > 1 ? filteredG[i].ratio : 1);
          let zScale = 1.5 * (filteredG[i].ratio < 1 ? 1./filteredG[i].ratio : 1);
          return (
          <NFTBox
            imageMap={images[i]}
            key={` nft-${i}`}
            position={[Math.cos(t) * magnitude, 0, Math.sin(t) * magnitude]}
            scale={[0.05, yScale, zScale]}
            rotation={[0, -t, 0]} />
          )}
        )}
        <OrbitControls
          enableDamping
          enableZoom={false}
          autoRotate
          rotateSpeed={0.5}
          autoRotateSpeed={1.2}
          minDistance={2}
          maxDistance={12} />
      </Canvas>
    </div>
  )
}

export default function ArtGallerySized ({
  ...props
}) {
  let gallery = [
    {image: Image0, ratio: 1},
    {image: Image1, ratio: 1},
    {image: Image2, ratio: 1},
    {image: Image3, ratio: 1},
    {image: Image4, ratio: 1},
    {image: Image5, ratio: 1}
  ]
  return (
    <Suspense fallback={<CircularProgress />}>
      <ParentSize>
        {({width, height}) =>
          <ArtGallery width={width} height={height} gallery={gallery}/>
        }
      </ParentSize>
    </Suspense>
  )
}

