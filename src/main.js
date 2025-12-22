document.addEventListener('DOMContentLoaded', () => {

    const CONFIG = {
        serverName: "GWARFARE",
        statusText: "Killing People to Death...",
        fakeProgressDuration: 45000,
        fakeProgressStop: 99,
        updateRate: 50,
        progressSteps: {
            "Retrieving server info": 15,
            "Workshop Complete": 40,
            "Client info sent": 70,
            "Starting Lua": 90,
            "Lua Started": 100
        }
    };

    const progressBar = document.getElementById('progress-bar');
    const serverNameElement = document.getElementById('server-name');
    const statusTextElement = document.getElementById('status-text');

    if (!progressBar || !serverNameElement || !statusTextElement) {
        console.error("Loading screen element(s) not found. Aborting script.");
        return;
    }

    serverNameElement.innerText = CONFIG.serverName;
    statusTextElement.innerText = CONFIG.statusText;

    let realProgress = 0;
    let fakeProgress = 0;
    let fakeProgressInterval = null;

    function startFakeProgress() {
        if (fakeProgressInterval) return;
        const increment = (100 / (CONFIG.fakeProgressDuration / CONFIG.updateRate));
        fakeProgressInterval = setInterval(() => {
            if (fakeProgress < CONFIG.fakeProgressStop) {
                fakeProgress += increment;
                updateProgressBar();
            }
        }, CONFIG.updateRate);
    }

    function updateProgressBar() {
        const displayProgress = Math.max(realProgress, fakeProgress);
        const finalPercent = Math.min(displayProgress, 100);
        progressBar.style.transform = `scaleX(${finalPercent / 100})`;
    }

    function stopFakeProgress() {
        if (fakeProgressInterval) {
            clearInterval(fakeProgressInterval);
        }
    }

    window.GameDetails = () => {
        startFakeProgress();
    };

    window.SetStatusChanged = (status) => {
        for (const [key, value] of Object.entries(CONFIG.progressSteps)) {
            if (status.includes(key)) {
                if (value > realProgress) {
                    realProgress = value;
                }
            }
        }
        
        if (realProgress === 100) {
            stopFakeProgress();
        }

        updateProgressBar();
    };

    startFakeProgress();
});