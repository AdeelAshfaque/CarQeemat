# Vehicle model asset

The interactive studio loads the supplied model from:

```text
public/models/car-concept.glb
```

This GLB is the [Khronos glTF Sample Assets Car Concept](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept).
The model directory identifies the asset as CC BY 4.0 and credits Darmstadt
Graphics Group GmbH and Eric Chadwick. Its license excludes Khronos trademarks
and logos; the supplied asset includes those marks, so review them before
production use.

Suggested credit when using that model:

> Car Concept by Darmstadt Graphics Group GmbH, converted by Eric Chadwick,
> from Khronos glTF Sample Assets. Licensed under CC BY 4.0.

The scene displays this credit when the model loads. For production, prefer a
vehicle model whose geometry, textures, and branding are explicitly licensed
for commercial web use. The supplied model uses KTX2 textures and the scene
loads its local Basis transcoder files from `public/basis/`.

The Basis transcoder files are copied from the Three.js package; see
`node_modules/three/LICENSE` for its license notice.
