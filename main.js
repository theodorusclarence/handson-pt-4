function main() {
  /**
   * @type {HTMLCanvasElement} canvas
   */
  const canvas = document.getElementById('myCanvas');

  /**
   * @type {WebGLRenderingContext} gl
   */
  const gl = canvas.getContext('webgl');
  // Mendefinisikan posisi titik" tersebut
  /**
   * A (-0.5, -0.5)
   * B (0, 0.5)
   * C (0.5, -0.5)
   */

  //* Didefinisikan titik"nya aja
  // prettier-ignore
  var vertices = [
    -0.5, -0.5, +1.0, +0.0, +0.0, // A
    +0.0, +0.5, +0.0, +1.0, +0.0, // B
    +0.5, -0.5, +0.0, +1.0, +1.0, // C
  ];

  // Bikin buffer, terus ngeassign vertices ke buffer
  // kalo udah, di unbind lagi
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const vertexShaderCode = `
  attribute vec2 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;
  uniform float dx;
  uniform float dy;
  uniform float dz;

  void main() {
    mat4 translate = mat4(
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      dx, dy, dz, 1.0
    );
    gl_Position = translate * vec4(a_position, 0.0, 1.0);
    v_color = a_color;
  }`;

  // membuat titik"
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderCode);
  gl.compileShader(vertexShader);

  const fragmentShaderCode = `
  precision mediump float;
  varying vec3 v_color;
  void main() {
    gl_FragColor = vec4(v_color, 1.0);
  }`;

  // membuat fragment warna
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderCode);
  gl.compileShader(fragmentShader);

  // membuat program agar data bisa ditampilkan
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  // Clear existing canvas first
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // name `a_position` sesuai dengan vertexShaderCode
  const aPosition = gl.getAttribLocation(shaderProgram, 'a_position');
  const aColor = gl.getAttribLocation(shaderProgram, 'a_color');

  // parameter 2 menunjukkan vertices ada 2 dimensi (x, y)
  gl.vertexAttribPointer(
    aPosition,
    2,
    gl.FLOAT,
    false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.vertexAttribPointer(
    aColor,
    3,
    gl.FLOAT,
    false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(aPosition);
  gl.enableVertexAttribArray(aColor);

  // gl.viewport(100, 0, canvas.width, canvas.height);

  let dx = 0;
  let dy = 0;
  let dz = 0;
  const udx = gl.getUniformLocation(shaderProgram, 'dx');
  const udy = gl.getUniformLocation(shaderProgram, 'dy');
  const udz = gl.getUniformLocation(shaderProgram, 'dz');

  let freeze = false;
  function onMouseClick(e) {
    freeze = !freeze;
  }
  document.addEventListener('click', onMouseClick, false);

  function onKeyDown(e) {
    if (e.keyCode === 32) {
      freeze = true;
    }
  }
  function onKeyUp(e) {
    if (e.keyCode === 32) {
      freeze = false;
    }
  }
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);

  function render() {
    if (!freeze) {
      dx += 0.001;
      dy += 0.001;
      dz += 0.001;
    }
    gl.uniform1f(udx, dx);
    gl.uniform1f(udy, dy);
    gl.uniform1f(udz, dz);

    // Clear existing canvas first
    gl.clearColor(0.13, 0.13, 0.13, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
