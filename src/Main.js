let gl;

const vertexSource = `
	attribute vec2 position;

	uniform mat3 model;
	uniform mat3 world;

	void main() {
		gl_Position = vec4((world * model * vec3(position, 1.0)).xy, 0.0, 1.0);
		// gl_Position = vec4(position, 0.0, 1.0);
	}
`;

const fragmentSource = `
	precision highp float;

	void main() {
		gl_FragColor = vec4(0.3, 0.3, 0.3, 1.0);
	}
`;

export default class Main {
	constructor() {
		this.init();

		window.main = this;
	}

	init() {
		this.canvas = document.querySelector('#main_view');
		gl = this.canvas.getContext('webgl');

		this.program = this.makeProgram(vertexSource, fragmentSource);
		gl.useProgram(this.program);

		['position'].forEach(
			name => this.setAttribLocation(this.program, name)
		);

		['model', 'world'].forEach(
			name => this.setUniformLocation(this.program, name)
		);

		gl.enableVertexAttribArray(this.program.position);

		this.buffer = this.makeBuffer();
		this.updateSize(this.canvas.width, this.canvas.height, this.buffer);

		this.setIndexBuffer();
		this.setWorldTransform();

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

		// const buf = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);

		gl.vertexAttribPointer(this.program.position, 2, gl.FLOAT, false, 4 * 2, 0);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
	}

	resize() {
		// this.buffer = this.makeBuffer(this.canvas.width, this.canvas.height, this.buffer);
	}

	makeProgram(vertexSource, fragmentSource) {
		const vs = this.makeShader(gl.VERTEX_SHADER, vertexSource)
			, fs = this.makeShader(gl.FRAGMENT_SHADER, fragmentSource)

			, program = gl.createProgram();

		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);

		return program;
	}

	makeShader(type, source) {
		const shader = gl.createShader(type);

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		return shader;
	}

	makeBuffer() {
		const w = this.canvas.width
			, h = this.canvas.height;

		const buffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(
			gl.ARRAY_BUFFER, 
			new Float32Array([0, 0, w, 0, w, h, 0, h]), 
			gl.STATIC_DRAW
		);

		return buffer;
	}

	updateSize(w, h, buffer) {
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

		[,,[w],,[w, h],,,[w]].forEach(
			(a, i) => gl.bufferSubData(gl.ARRAY_BUFFER, i, new Float32Array(a)));
	}

	setAttribLocation(program, name) {
		program[name] = gl.getAttribLocation(program, name);
	}

	setUniformLocation(program, name) {
		program[name] = gl.getUniformLocation(program, name);
	}

	setIndexBuffer() {
		const buffer = gl.createBuffer();

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER, 
			new Uint16Array([0, 1, 2, 0, 2, 3]), 
			gl.STATIC_DRAW
		);
	}

	setWorldTransform() {
		const w = this.canvas.width
			, h = this.canvas.height;

		const world = new Float32Array([
			2 / w, 0, 0,
			0, -2 / h, 0,
			-1, 1, 1,
		]);

		gl.uniformMatrix3fv(this.program.model, false, new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
		gl.uniformMatrix3fv(this.program.world, false, world);
	}

}// class
