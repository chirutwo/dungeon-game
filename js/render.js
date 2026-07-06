// External functions

function createShader(gl, type, source) { // from webglfundamentals.org
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) { // also from webglfundamentals.org
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function addRectangle(gl, x, y, width, height) {
  let x1 = x;
  let x2 = x + width;
  let y1 = y;
  let y2 = y + height;

  let positions = [
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
}

function randInt(start, end) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

// The "main" part

function main() {
  const canvas = document.getElementById("canvas");
  let aspectRatio;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    aspectRatio = canvas.width / canvas.height;
    return aspectRatio;
  }

  aspectRatio = resize();

  const errortext = document.getElementById("errortext");

  var gl = canvas.getContext("webgl");
  if (!gl) {
    errortext.innerText = "Oopsie, looks like your browser doesn't support WebGL!";
    return;
  }

  // Vertex shader (shades the vertices)
  let vertexShaderString = 
`attribute vec2 a_position; 
attribute vec2 a_texCoord;

uniform vec2 u_resolution;

varying vec2 v_texCoord;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  v_texCoord = a_texCoord;
}`;

  // Fragment shader (shades the fragments?)
  let fragmentShaderString = 
`precision mediump float;

uniform vec4 u_color;
uniform sampler2D u_image;

varying vec2 v_texCoord;

void main() {
  vec4 color = texture2D(u_image, v_texCoord).rgba;
  vec4 invertColor = vec4(1.0 - color.rgb, color.a);
  gl_FragColor = vec4(color.rgb, color.a);
  //gl_FragColor = u_color;
}`;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderString);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderString);

  var program = createProgram(gl, vertexShader, fragmentShader);

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var colorUniformLocation = gl.getUniformLocation(program, "u_color");
  var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var texCoordBuffer = gl.createBuffer();

  var image = new Image();
  image.src = "images/atlas.png"
  image.onload = function() {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_BORDER);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_BORDER);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }

  gl.useProgram(program);
  
  gl.enableVertexAttribArray(positionAttributeLocation);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  var size = 2;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  gl.enableVertexAttribArray(texCoordLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

  var size = 2;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(texCoordLocation, size, type, normalize, stride, offset);

  function draw() {
    aspectRatio = resize();
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(120 / 255, 167 / 255, 255 / 255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    function changeBufferData(block) {
      let offset = 0.005;
      let atlasWidth = 4;
      let atlasHeight = 4;

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        ((block % atlasWidth) + offset) / atlasWidth,       (Math.floor(block / atlasWidth) + offset) / atlasHeight,
        ((block % atlasWidth) + 1.0 - offset) / atlasWidth, (Math.floor(block / atlasWidth) + offset) / atlasHeight,
        ((block % atlasWidth) + offset) / atlasWidth,       (Math.floor(block / atlasWidth) + 1.0 - offset) / atlasHeight,
        ((block % atlasWidth) + offset) / atlasWidth,       (Math.floor(block / atlasWidth) + 1.0 - offset) / atlasHeight,
        ((block % atlasWidth) + 1.0 - offset) / atlasWidth, (Math.floor(block / atlasWidth) + offset) / atlasHeight,
        ((block % atlasWidth) + 1.0 - offset) / atlasWidth, (Math.floor(block / atlasWidth) + 1.0 - offset) / atlasHeight,
      ]), gl.STATIC_DRAW);
    }

    changeBufferData(0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    for (let i = 0; i < 12 * aspectRatio; i++) {
      for (let ii = 0; ii < 12; ii++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

        //changeBufferData((i/* + Math.floor(playerX / (canvas.height / 10))*/) % 8);
  
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        /*if (Math.random() < 0.5) {
          image.src = "images/dirt.png";
        } else {
          image.src = "images/nether_wart_block.png";
        }*/

        addRectangle(gl, ((i - 1) * (canvas.height / 10)) - (playerX * ((canvas.height / 10) / 16)), ((ii - 1) * (canvas.height / 10)) + (playerY * ((canvas.height / 10) / 16)), canvas.height / 10, canvas.height / 10);
        //red = ii * 63;
        //green = Math.random() * 255;
        //blue = Math.random() * 255;
        //alpha = 255;
        //gl.uniform4f(colorUniformLocation, red / 255, green / 255, blue / 255, alpha / 255);
  
        let mode = gl.TRIANGLES;
        let offset = 0;
        let count = 6;

        gl.drawArrays(mode, offset, count);
      }
    }

    window.requestAnimationFrame(draw);
  }

  //window.addEventListener("resize", draw);
  window.requestAnimationFrame(draw);
  //setInterval(draw, 1000 / 30);
}

main();

