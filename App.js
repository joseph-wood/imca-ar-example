import React from 'react';
import { AR } from 'expo';
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';

import { View as GraphicsView } from 'expo-graphics';

export default class App extends React.Component {
  componentDidMount() {
    THREE.suppressExpoWarnings(true)
    ThreeAR.suppressWarnings()
  }
  
  render() {
    return (
      <GraphicsView
        style={{ flex: 1 }}
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
        isArEnabled
        isArRunningStateEnabled
        isArCameraStateEnabled
        arTrackingConfiguration={AR.TrackingConfiguration.World}
      />
    );
  }

  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    AR.setPlaneDetection('horizontal');

    this.renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height,
    });

    this.scene = new THREE.Scene();
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    this.camera = new ThreeAR.Camera(width, height, 0.01, 1000);
    
    const geometry = new THREE.PlaneGeometry( 1, 1, 1 );
    const texture = await ExpoTHREE.loadAsync('https://dl.airtable.com/9soeZR0DQHOO9vcj2ULK_large_bb.jpg')
    const material = new THREE.MeshBasicMaterial( { map: texture } );

    this.cube = new THREE.Mesh(geometry, material);

    this.cube.position.z = -0.4
    this.cube.receiveShadow = true;

    this.scene.add(this.cube);
    
    this.scene.add(new THREE.AmbientLight(0x000000));

    this.points = new ThreeAR.Points();
    this.scene.add(this.points)
  };

  onResize = ({ x, y, scale, width, height }) => {
    if (!this.renderer) {
      return;
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  onRender = () => {
    this.points.update()
    this.renderer.render(this.scene, this.camera);
  };
}
