export default async function getMediaStream() {
  return await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
}
