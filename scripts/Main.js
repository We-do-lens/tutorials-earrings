

// How to load in modules
const Scene = require('Scene');
const Patches = require('Patches');
const R = require('Reactive');
const FaceTracking = require('FaceTracking');
// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');

// Enables async/await in JS
(async function() {

    //we need a facemesh called faceMesh0
    const [facemesh] = await Promise.all([
        Scene.root.findFirst('faceMesh0')
    ]);

    let [vertices] = await Promise.all([
        FaceTracking.face(0).point(0,0).x.pinLastValue()
    ]);

    let Y1 =  await Patches.outputs.getScalar('Y1');
    let Y2 =  await Patches.outputs.getScalar('Y2');

    const face = FaceTracking.face(0);
    const faceTransform = face.cameraTransform;

    //shhhhhhh magic hahaha, converts the 3D coord to 2D
    let LP = face.point(0,Y1);
    let RP = face.point(1,Y2);

    //Width and Height
    let disX = face.point(0,Y1).sub(face.point(1,Y2)).abs().x;
    let disY = face.point(0.5,0).sub(face.point(0.5,1)).abs().y;

    Diagnostics.watch("distanceX",disX);

    Diagnostics.watch("distanceY",disY);

    Patches.inputs.setScalar('distanceX',disX);

    Patches.inputs.setScalar('distanceY',disY);

    Patches.inputs.setPoint('LPoint',R.point(LP.x,LP.y,LP.z));
    
    Patches.inputs.setPoint('RPoint',R.point(RP.x,RP.y,RP.z));

})();
