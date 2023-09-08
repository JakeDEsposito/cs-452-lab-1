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

    const { sin, cos, PI } = Math

    const resolution = 100
    const radius = 0.6
    const circlePoints = []
    const angleStep = PI * 2 / resolution
    for (let i = 0; i < resolution; i++) {
        const currentAngle = i * angleStep
        circlePoints.push(vec2(cos(currentAngle) * radius / aspectRatio, sin(currentAngle) * radius))
    }

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

    const colorBufferId = bindBufferData(vec3(1 / 255, 40 / 255, 107 / 255))

    var myColor = gl.getAttribLocation(myShaderProgram, "myColor");
    gl.vertexAttribPointer(myColor, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(myColor)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, squarePoints.length)

    bindBufferData(circlePoints, pointsBufferId)
    bindBufferData(vec3(1, 1, 1), colorBufferId)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, circlePoints.length)
}