/**
 * Draws squares, and only squares. Every particle in the reel is one cell of a
 * pixel-art frame, so an untextured point sprite is exactly the primitive — and
 * one draw call moves a few thousand of them on a phone.
 *
 * Records are `STRIDE` floats: x, y, size (CSS px), then r, g, b, a (0–1).
 */
export const STRIDE = 7;

export type PointLayer = {
  resize: (width: number, height: number) => void;
  draw: (data: Float32Array, count: number) => void;
  destroy: () => void;
};

const VERTEX = `
attribute vec2 a_pos;
attribute float a_size;
attribute vec4 a_color;
uniform vec2 u_view;
uniform float u_dpr;
uniform float u_max;
varying vec4 v_color;

void main() {
  // Whole device pixels, with the square's edge on a pixel boundary: a point
  // centred between pixels smears into a blurred two-tone edge.
  float size = min(floor(a_size * u_dpr + 0.5), u_max);
  vec2 p = floor(a_pos * u_dpr - size * 0.5 + 0.5) + size * 0.5;
  vec2 clip = p / (u_view * u_dpr) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = size;
  v_color = a_color;
}`;

const FRAGMENT = `
precision mediump float;
varying vec4 v_color;

void main() {
  gl_FragColor = vec4(v_color.rgb * v_color.a, v_color.a);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function createGL(canvas: HTMLCanvasElement): PointLayer | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  if (!vs || !fs || !program || !buffer) return null;

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  const aPos = gl.getAttribLocation(program, 'a_pos');
  const aSize = gl.getAttribLocation(program, 'a_size');
  const aColor = gl.getAttribLocation(program, 'a_color');
  const uView = gl.getUniformLocation(program, 'u_view');
  const uDpr = gl.getUniformLocation(program, 'u_dpr');
  const uMax = gl.getUniformLocation(program, 'u_max');
  const maxSize = (gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) as Float32Array)[1] || 64;

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const bytes = STRIDE * 4;
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, bytes, 0);
  gl.enableVertexAttribArray(aSize);
  gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, bytes, 8);
  gl.enableVertexAttribArray(aColor);
  gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, bytes, 12);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let width = 1;
  let height = 1;
  let dpr = 1;
  // The field never changes size mid-reel, so the buffer is allocated once and
  // rewritten in place each frame rather than reallocated.
  let capacity = 0;

  return {
    resize(w, h) {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = w;
      height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    draw(data, count) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (!count) return;
      if (data.length > capacity) {
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
        capacity = data.length;
      } else {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
      }
      gl.uniform2f(uView, width, height);
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uMax, maxSize);
      gl.drawArrays(gl.POINTS, 0, count);
    },
    destroy() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

/** For the rare browser without WebGL: the same squares, one fillRect each. */
function create2D(canvas: HTMLCanvasElement): PointLayer {
  const ctx = canvas.getContext('2d');
  let width = 1;
  let height = 1;

  return {
    resize(w, h) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = w;
      height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    draw(data, count) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < count; i++) {
        const o = i * STRIDE;
        const s = data[o + 2];
        const a = data[o + 6];
        if (s < 0.5 || a < 0.02) continue;
        ctx.fillStyle = `rgb(${(data[o + 3] * 255) | 0} ${(data[o + 4] * 255) | 0} ${(data[o + 5] * 255) | 0} / ${a})`;
        ctx.fillRect(data[o] - s / 2, data[o + 1] - s / 2, s, s);
      }
    },
    destroy() {},
  };
}

export function createPointLayer(canvas: HTMLCanvasElement): PointLayer {
  return createGL(canvas) ?? create2D(canvas);
}
