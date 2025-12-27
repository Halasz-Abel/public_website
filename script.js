const video = document.getElementById("video");
const startBtn = document.getElementById("startScan");
const scanner = document.getElementById("scanner");
const result = document.getElementById("result");

startBtn.addEventListener("click", async () => {
    scanner.style.display = "block";

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" } // hátlapi kamera
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
                    const scanned = code.data;
                    console.log("Talált QR:", scanned);
                    result.textContent = "QR beolvasva: " + scanned;

                    // A TE weboldalad URL-je
                    const siteURL = "https://halasz-abel.github.io/public_website/";

                    // Ha a QR kód a weboldal URL-je
                    if (scanned === siteURL) {
                        // Átirányítás Gmail-re
                        window.location.href = "googlegmail://";
                    } else {
                        // Más QR kód esetén sima átirányítás
                        window.location.href = scanned;
                    }

                    // Megállítjuk a videót, hogy ne fusson tovább
                    const tracks = video.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                    return;
                }
            }
            requestAnimationFrame(scan);
        }

        scan();

    } catch (err) {
        alert("Nem sikerült hozzáférni a kamerához: " + err);
    }
});

