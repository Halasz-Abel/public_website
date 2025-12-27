const video = document.getElementById("video");
const startBtn = document.getElementById("startScan");
const scanner = document.getElementById("scanner");
const result = document.getElementById("result");

startBtn.addEventListener("click", async () => {
    scanner.style.display = "block";

    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
    });

    video.srcObject = stream;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    function scan() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
                result.textContent = "Talált QR: " + code.data;

                // Átirányítás QR kód alapján
                window.location.href = code.data;
                return;
            }
        }
        requestAnimationFrame(scan);
    }

    scan();
});


