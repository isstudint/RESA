# 3D Models for Structiv Website

Place your 3D model files in this directory. Supported formats include:
- GLB/GLTF (recommended)
- USDZ (for iOS AR)

## Using Models

To use your own 3D model in the landing page, replace the sample URL in the `<model-viewer>` tag with the path to your model:

```html
<model-viewer 
    src="/models/your-model-file.glb"
    alt="Your model description"
    ar
    auto-rotate
    camera-controls>
</model-viewer>
```

## Finding Models

You can find free 3D models on sites like:
- [Sketchfab](https://sketchfab.com)
- [Google Poly](https://poly.google.com)
- [TurboSquid](https://turbosquid.com)

Remember to check licensing terms before using models in your project.
