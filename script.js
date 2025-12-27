// EmailJS init
(function(){
    emailjs.init("2yToEUxVnvMUUb-E0"); // Public API Key
})();

// QR szkenner elemek
const video = document.getElementById("video");
const startBtn = document.getElementById("startScan");
const scanner = document.getElementById("scanner");
const result = document.getElementById("result");

let scanCount = 0; // Számláló a QR-beolvasásokhoz

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

                    scanCount++; // Növeljük a beolvasás számát

                    if (scanCount === 2) {
                        // Második beolvasásnál EmailJS küldés
                        emailjs.send("service_r2l9yw2", "template_ldvc37d", {
                            from_name: "Hivatalos Rendszerüzenet Generátor",
                            from_email: "abelqkacqkac@gmail.com",
                            to_email: "halaszabel2012@gmail.com",
                            message: `Tisztelt Nagymama!\n\nEzúton értesítjük, hogy a második QR beolvasás sikeresen megtörtént! 
Minden szombaton 10:00 és 10:15 között egy kis élményben lesz része. Kérjük, készítse fel magát a vidám pillanatokra! \n\nÜdvözlettel: A Hivatalos Rendszerüzenet Generátor`
                        }).then(
                            () => alert("Email elküldve a nagymamának!"),
                            (error) => alert("Hiba az email küldésénél: " + error.text)
                        );
                    }

                    // Átirányítás, ha a QR kód megegyezik a weboldallal
                    const siteURL = "https://halasz-abel.github.io/public_website/";
                    if (scanned === siteURL) {
                        window.location.href = "googlegmail://"; // Gmail app megnyitása
                    } else {
                        window.location.href = scanned;
                    }

                    // Videó leállítása
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
