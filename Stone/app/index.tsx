import { Platform, Text, View } from "react-native";
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { Asset } from 'expo-asset';
import { readAsStringAsync } from 'expo-file-system/legacy';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GLView style={{width: 300, height: 300}} onContextCreate={onContextCreate} />
    </View>
  );
}

async function onContextCreate(gl: ExpoWebGLRenderingContext) {
  const [vertData, fragData] = await readShaderData();

  // See expo documentation here: https://docs.expo.dev/versions/latest/sdk/gl-view/#usage
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.4, 0, 0.4, 1);

  // Create vertex shader (shape & position)
  const vert: WebGLShader | null = gl.createShader(gl.VERTEX_SHADER);
  if (vert === null) {
    console.log("Error creating vertex shader.");
    return;
  } 
  gl.shaderSource(vert, vertData);
  gl.compileShader(vert);

  // Create fragment shader (color)
  const frag: WebGLShader | null = gl.createShader(gl.FRAGMENT_SHADER);
  if (frag === null) {
    console.log("Error creating fragment shader.");
    return;
  } 
  gl.shaderSource(frag, fragData);
  gl.compileShader(frag);

  // Link together into a program
  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.useProgram(program);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);

  gl.flush();
  gl.endFrameEXP();
}

async function readShaderData() {
  const [vertFile, fragFile] = await Asset.loadAsync([
    require("../assets/shaders/main.vert"),
    require("../assets/shaders/main.frag"),
  ]);

  if (!vertFile.localUri) {
    throw new URIError("Unable to find vertex shader.");
  }

  if (!fragFile.localUri) {
    throw new URIError("Unable to find fragment shader.");
  }

  if (Platform.OS === 'web') {
    const vertSrc = await (await fetch(vertFile.localUri)).text();
    const fragSrc = await (await fetch(fragFile.localUri)).text();
    return [vertSrc, fragSrc]
  } else {
    const vertSrc = await readAsStringAsync(vertFile.localUri);
    const fragSrc = await readAsStringAsync(fragFile.localUri);
    return [vertSrc, fragSrc];
  }
}