"use strict";
exports.__esModule = true;
var x = 0;
var barHeight = 0;
var barWidth = 0;
var ctx = null;
function renderFrame(_a) {
    var dataArray = _a.dataArray, analyser = _a.analyser, WIDTH = _a.WIDTH, HEIGHT = _a.HEIGHT, bufferLength = _a.bufferLength;
    requestAnimationFrame(function () {
        return renderFrame({
            dataArray: dataArray,
            analyser: analyser,
            WIDTH: WIDTH,
            HEIGHT: HEIGHT,
            bufferLength: bufferLength
        });
    });
    x = 0;
    analyser.getByteFrequencyData(dataArray);
    if (ctx.clearRect) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    for (var i = 0; i < bufferLength; i += 1) {
        barHeight = (dataArray[i] / 256) * (window.maxBarHeight || 100);
        var r = barHeight + 25 * (i / bufferLength);
        var g = 200 * (i / bufferLength);
        var b = 100;
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth - 1, barHeight);
        x += barWidth;
    }
}
var initiateAnalyser = function (audio) {
    var canvas = document.getElementById("player-visualization");
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var resizeCanvas = function () {
        if (canvas) {
            /* eslint-disable no-param-reassign */
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
            /* eslint-enable no-param-reassign */
            ctx = canvas.getContext("2d");
            var WIDTH = canvas.width;
            var HEIGHT = canvas.height;
            barWidth = (WIDTH / bufferLength) * 1;
            if (analyser) {
                renderFrame({ dataArray: dataArray, analyser: analyser, WIDTH: WIDTH, HEIGHT: HEIGHT, bufferLength: bufferLength });
            }
        }
    };
    window.addEventListener("resize", resizeCanvas, false);
    resizeCanvas();
};
exports["default"] = initiateAnalyser;
//# sourceMappingURL=visualizer.js.map