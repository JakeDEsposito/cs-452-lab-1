function draw() {
    var canvas = document.getElementById("gl-canvas");
    /** @type {WebGLRenderingContext} */
    var gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL is not available"); }

    // Set up the viewport
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);   // x, y, width, height

    const aspectRatio = canvas.clientWidth / canvas.clientHeight

    // Set up the background color
    gl.clearColor(206 / 255, 16 / 255, 41 / 255, 1.0);

    // Force the WebGL context to clear the color buffer
    gl.clear(gl.COLOR_BUFFER_BIT);

    /**
     * Creates the vertices for a circle.
     * @param {number} resolution Number of vertices that the circle will be made of.
     * @param {number} radius Radius of the circle.
     * @param {number} x The horizontal position.
     * @param {number} y The vertical position.
     * @returns
     */
    function circleVertices(resolution, radius, x, y) {
        const { sin, cos, PI } = Math

        const angleStep = PI * 2 / resolution

        const vertices = []

        for (let i = 0; i < resolution; i++) {
            const theta = i * angleStep

            vertices.push(vec2((cos(theta) * radius + x) / aspectRatio, sin(theta) * radius + y))
        }

        return vertices
    }

    /**
     * Creates and populates a WebGL buffer with data.
     * @param {any[]} data Data that will be put into the buffer.
     * @param {WebGLBuffer | null} bufferId What buffer to put the data into.
     * @returns {WebGLBuffer} Id of the buffer that the data was put into.
     */
    function bindBufferData(data, bufferId) {
        var bufferId = bufferId || gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
        gl.bufferData(gl.ARRAY_BUFFER, flatten(data), gl.STATIC_DRAW)
        return bufferId
    }

    const squarePoints = [vec2(-1, 0.6), vec2(-1, -0.6), vec2(1, -0.6), vec2(1, 0.6)]

    // Create shader program, needs vertex and fragment shader code
    // in GLSL to be written in HTML file
    var myShaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(myShaderProgram);

    const pointsBufferId = bindBufferData(squarePoints)

    // Create a pointer that iterates over the
    // array of points in the shader code
    var myPosition = gl.getAttribLocation(myShaderProgram, "myPosition");
    gl.vertexAttribPointer(myPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(myPosition);

    const colorBufferId = bindBufferData(Array(squarePoints.length).fill(vec3(1 / 255, 40 / 255, 107 / 255)))

    var myColor = gl.getAttribLocation(myShaderProgram, "myColor");
    gl.vertexAttribPointer(myColor, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(myColor)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, squarePoints.length)

    // draw circle
    const circle = circleVertices(100, 0.4, 0, 0)
    bindBufferData(circle, pointsBufferId)
    bindBufferData(Array(circle.length).fill(vec3(1.0, 1.0, 1.0)), colorBufferId)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, circle.length)

    // draw hexigon
    const hexigon = circleVertices(6, 0.4, 0, 0)
    bindBufferData(hexigon, pointsBufferId)
    bindBufferData(Array(hexigon.length).fill(vec3(24 / 255, 237 / 255, 200 / 255)), colorBufferId)

    gl.drawArrays(gl.LINE_LOOP, 0, hexigon.length)
}