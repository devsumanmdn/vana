let x = 0;
let barHeight = 0;
let barWidth = 0;
let ctx: CanvasRenderingContext2D = null;

function renderFrame({
  dataArray,
  analyser,
  WIDTH,
  HEIGHT,
  bufferLength,
}: {
  dataArray: Uint8Array;
  analyser: AnalyserNode;
  WIDTH: number;
  HEIGHT: number;
  bufferLength: number;
}) {
  requestAnimationFrame(() =>
    renderFrame({
      dataArray,
      analyser,
      WIDTH,
      HEIGHT,
      bufferLength,
    })
  );

  x = 0;

  analyser.getByteFrequencyData(dataArray);
  if (ctx.clearRect) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  for (let i = 0; i < bufferLength; i += 1) {
    barHeight = (dataArray[i] / 256) * (window.maxBarHeight || 100);

    const r = barHeight + 25 * (i / bufferLength);
    const g = 200 * (i / bufferLength);
    const b = 100;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, HEIGHT - barHeight, barWidth - 1, barHeight);

    x += barWidth;
  }
}

const initiateAnalyser = (audio: HTMLMediaElement): void => {
  const canvas = document.getElementById(
    "player-visualization"
  ) as HTMLCanvasElement;
  const context = new AudioContext();
  const src = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();

  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;

  const dataArray = new Uint8Array(bufferLength);

  const resizeCanvas = () => {
    if (canvas) {
      /* eslint-disable no-param-reassign */
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      /* eslint-enable no-param-reassign */
      ctx = canvas.getContext("2d");
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      barWidth = (WIDTH / bufferLength) * 1;
      if (analyser) {
        renderFrame({ dataArray, analyser, WIDTH, HEIGHT, bufferLength });
      }
    }
  };

  window.addEventListener("resize", resizeCanvas, false);
  resizeCanvas();
};

export default initiateAnalyser;
