// --- EmailJS inicializálása ---
(function(){
    emailjs.init("2yToEUxVnvMUUb-E0"); // Public API Key
})();

// --- HTML elemek ---
const video = document.getElementById("video");
const startBtn = document.getElementById("startScan");
const scanner = document.getElementById("scanner");
const result = document.getElementById("result");

let scanCount = 0; // QR beolvasások száma

startBtn.addEventListener("click", async () => {
    scanner.style.display = "block";

    try {
        // Kamera elindítása
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });
        video.srcObject = stream;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        function scanLoop() {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);

                if (code) {
                    const scanned = code.data;
                    scanCount++;
                    result.textContent = `QR beolvasva (${scanCount}): ${scanned}`;
                    console.log("QR beolvasva:", scanned);

                    // --- Második beolvasásra EmailJS küldés ---
                    if (scanCount === 1) {
                        console.log("Második beolvasás - email küldés indul...");
                        emailjs.send("service_r2l9yw2", "template_ldvc37d", {
                            from_name: "Hivatalos Rendszerüzenet Generátor",
                            from_email: "abelqkacqkac@gmail.com",
                            to_email: "halaszabel2012@gmail.com",
                            message: `Tisztelt Nagymama!\n\nEzúton értesítjük, hogy a második QR beolvasás sikeresen megtörtént! 
Minden szombaton 10:00 és 10:15 között egy kis élményben lesz része. Kérjük, készítse fel magát a vidám pillanatokra! \n\nÜdvözlettel: A Hivatalos Rendszerüzenet Generátor`
                        }).then(
                            () => alert("Email elküldve a nagymamának!"),
                            (error) => {
                                console.error("EmailJS hiba:", error);
                                alert("Hiba az email küldésénél: " + error.text);
                            }
                        );
                    }

                    // --- Átirányítás a weboldalhoz / Gmail app ---
                    const siteURL = "https://halasz-abel.github.io/public_website/";
                    if (scanned === siteURL) {
                        window.location.href = "googlegmail://"; // Gmail app megnyitása
                    } else {
                        window.location.href = scanned;
                    }

                    // --- Videó leállítása ---
                    video.srcObject.getTracks().forEach(track => track.stop());
                    return;
                }
            }

            // Loop folytatása
            requestAnimationFrame(scanLoop);
        }

        scanLoop();

    } catch (err) {
        alert("Nem sikerült hozzáférni a kamerához: " + err);
    }
});

