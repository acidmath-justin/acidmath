"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Upload, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Keypoint = { x: number; y: number; score?: number; name?: string };
type PoseDetector = { estimatePoses: (input: any) => Promise<{ keypoints: Keypoint[] }[]> };

const MIN_SCORE = 0.3;

function findKp(keypoints: Keypoint[], name: string) {
  const kp = keypoints.find((k) => k.name === name);
  return kp && (kp.score ?? 1) > MIN_SCORE ? kp : null;
}

/**
 * Draws the garment image over the torso using shoulder/hip keypoints.
 * This is a lightweight alignment heuristic (translate + rotate + scale a
 * flat image) — good enough for an MVP try-on. A production build would
 * swap in per-garment transparent cutouts and warp sleeves against elbow /
 * wrist keypoints too. See README > "Upgrading the Mirror".
 */
function drawGarmentOverlay(
  ctx: CanvasRenderingContext2D,
  keypoints: Keypoint[],
  garmentImg: HTMLImageElement
) {
  const lShoulder = findKp(keypoints, "left_shoulder");
  const rShoulder = findKp(keypoints, "right_shoulder");
  if (!lShoulder || !rShoulder) return false;

  const lHip = findKp(keypoints, "left_hip");
  const rHip = findKp(keypoints, "right_hip");

  const shoulderMid = { x: (lShoulder.x + rShoulder.x) / 2, y: (lShoulder.y + rShoulder.y) / 2 };
  const shoulderWidth = Math.hypot(rShoulder.x - lShoulder.x, rShoulder.y - lShoulder.y);

  let torsoHeight = shoulderWidth * 1.6;
  if (lHip && rHip) {
    const hipMid = { x: (lHip.x + rHip.x) / 2, y: (lHip.y + rHip.y) / 2 };
    torsoHeight = Math.hypot(hipMid.x - shoulderMid.x, hipMid.y - shoulderMid.y);
  }

  const angle = Math.atan2(rShoulder.y - lShoulder.y, rShoulder.x - lShoulder.x);
  const garmentWidth = shoulderWidth * 1.9;
  const garmentHeight = torsoHeight * 1.85;

  ctx.save();
  ctx.translate(shoulderMid.x, shoulderMid.y + torsoHeight * 0.15);
  ctx.rotate(angle);
  ctx.globalAlpha = 0.94;
  ctx.drawImage(garmentImg, -garmentWidth / 2, -garmentHeight * 0.32, garmentWidth, garmentHeight);
  ctx.restore();
  return true;
}

export function PoseOverlayAR({ garmentImageUrl }: { garmentImageUrl: string }) {
  const [tab, setTab] = useState<"photo" | "webcam">("photo");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "no-pose" | "error">("idle");
  const [webcamActive, setWebcamActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const garmentImgRef = useRef<HTMLImageElement | null>(null);
  const detectorRef = useRef<PoseDetector | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>();
  const lastKeypointsRef = useRef<Keypoint[] | null>(null);
  const frameCountRef = useRef(0);

  // Preload the garment image once (also refreshed if the product changes).
  // Only assign to the ref once fully loaded, so draw calls elsewhere can
  // safely treat a non-null ref as "safe to drawImage()".
  useEffect(() => {
    garmentImgRef.current = null;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      garmentImgRef.current = img;
    };
    img.src = garmentImageUrl;
  }, [garmentImageUrl]);

  async function ensureDetector() {
    if (detectorRef.current) return detectorRef.current;
    setStatus("loading");
    const tf = await import("@tensorflow/tfjs");
    await import("@tensorflow/tfjs-backend-webgl");
    const poseDetection = await import("@tensorflow-models/pose-detection");
    await tf.setBackend("webgl");
    await tf.ready();
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    });
    detectorRef.current = detector as unknown as PoseDetector;
    return detectorRef.current;
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    stopWebcam();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const photo = new Image();
    photo.onload = async () => {
      const maxDim = 900;
      const scale = Math.min(1, maxDim / Math.max(photo.width, photo.height));
      canvas.width = photo.width * scale;
      canvas.height = photo.height * scale;
      ctx.drawImage(photo, 0, 0, canvas.width, canvas.height);

      try {
        const detector = await ensureDetector();
        const poses = await detector.estimatePoses(canvas);
        const kps = poses[0]?.keypoints;
        if (kps && garmentImgRef.current) {
          const drew = drawGarmentOverlay(ctx, kps, garmentImgRef.current);
          setStatus(drew ? "ready" : "no-pose");
        } else {
          setStatus("no-pose");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };
    photo.src = URL.createObjectURL(file);
  }

  async function startWebcam() {
    stopWebcam();
    setStatus("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();

      const canvas = canvasRef.current!;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      await ensureDetector();
      setWebcamActive(true);
      setStatus("ready");
      loop();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  function loop() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const detector = detectorRef.current;
    if (!video || !canvas || !detector) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.scale(-1, 1); // mirror, like a real mirror
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    frameCountRef.current += 1;
    const shouldDetect = frameCountRef.current % 3 === 0;

    const render = (kps: Keypoint[] | null) => {
      if (kps && garmentImgRef.current) {
        // Mirror keypoints to match the mirrored video draw above
        const mirrored = kps.map((k) => ({ ...k, x: canvas.width - k.x }));
        drawGarmentOverlay(ctx, mirrored, garmentImgRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    if (shouldDetect) {
      detector
        .estimatePoses(video)
        .then((poses) => {
          lastKeypointsRef.current = poses[0]?.keypoints ?? null;
          render(lastKeypointsRef.current);
        })
        .catch(() => render(lastKeypointsRef.current));
    } else {
      render(lastKeypointsRef.current);
    }
  }

  function stopWebcam() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setWebcamActive(false);
  }

  useEffect(() => stopWebcam, []);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            stopWebcam();
            setTab("photo");
            setStatus("idle");
          }}
          className={`font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full border ${tab === "photo" ? "border-magenta text-magenta" : "border-paper/20 text-paper/50"}`}
        >
          Upload Photo
        </button>
        <button
          onClick={() => {
            setTab("webcam");
            setStatus("idle");
          }}
          className={`font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full border ${tab === "webcam" ? "border-acidgreen text-acidgreen" : "border-paper/20 text-paper/50"}`}
        >
          Live Webcam
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-void-2 border border-paper/10 aspect-[4/5] grid place-items-center">
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={canvasRef} className="max-w-full max-h-full" />

        {status === "idle" && tab === "photo" && (
          <label className="absolute inset-0 grid place-items-center cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <span className="flex flex-col items-center gap-3 font-mono text-xs uppercase tracking-widest text-paper/50">
              <Upload size={28} className="text-magenta" />
              Upload a full-length photo
            </span>
          </label>
        )}

        {status === "idle" && tab === "webcam" && (
          <button
            onClick={startWebcam}
            className="absolute inset-0 grid place-items-center"
          >
            <span className="flex flex-col items-center gap-3 font-mono text-xs uppercase tracking-widest text-paper/50">
              <Camera size={28} className="text-acidgreen" />
              Start camera
            </span>
          </button>
        )}

        {status === "loading" && (
          <p className="absolute font-mono text-xs uppercase tracking-widest text-acidgreen animate-pulseGlow">
            Loading pose model…
          </p>
        )}

        {status === "no-pose" && (
          <p className="absolute bottom-4 left-4 right-4 text-center font-mono text-[10px] uppercase tracking-widest text-amber bg-void/80 px-3 py-2 rounded">
            Couldn&apos;t find shoulders — try a photo with your upper body fully visible.
          </p>
        )}

        {status === "error" && (
          <p className="absolute bottom-4 left-4 right-4 text-center font-mono text-[10px] uppercase tracking-widest text-magenta bg-void/80 px-3 py-2 rounded">
            Camera or model failed to load. Check permissions and try again.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="font-mono text-[10px] text-paper/30 leading-relaxed max-w-xs">
          Processed entirely in your browser — no photo or video ever leaves your device.
        </p>
        {webcamActive && (
          <Button size="sm" variant="secondary" onClick={stopWebcam}>
            <Square size={12} className="inline mr-2" />
            Stop
          </Button>
        )}
      </div>
    </div>
  );
}
