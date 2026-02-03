import { Text, View } from "react-native";
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';

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

function onContextCreate(gl: ExpoWebGLRenderingContext) {
  // See expo documentation here: https://docs.expo.dev/versions/latest/sdk/gl-view/#usage
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(1, 0, 0, 1);

  // Create vertex shader (shape & position)
  const vert: WebGLShader | null = gl.createShader(gl.VERTEX_SHADER);
  if (vert === null) {
    console.log("Error creating vertex shader.");
    return;
  } 
  gl.shaderSource(
    vert,
    `
    void main(void) {
      gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
      gl_PointSize = 150.0;
    }
  `
  );
  gl.compileShader(vert);

  // Create fragment shader (color)
  const frag: WebGLShader | null = gl.createShader(gl.FRAGMENT_SHADER);
  if (frag === null) {
    console.log("Error creating fragment shader.");
    return;
  } 
  gl.shaderSource(
    frag,
    `
    void main(void) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
  `
  );
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