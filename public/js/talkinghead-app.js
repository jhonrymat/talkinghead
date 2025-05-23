import { TalkingHead } from "talkinghead";

const visemeMap = [
      /* 0  */ "sil",            // Silence
      /* 1  */ "aa",             // æ, ə, ʌ
      /* 2  */ "aa",             // ɑ
      /* 3  */ "O",              // ɔ
      /* 4  */ "E",              // ɛ, ʊ
      /* 5  */ "RR",              // ɝ
      /* 6  */ "I",              // j, i, ɪ
      /* 7  */ "U",              // w, u
      /* 8  */ "O",              // o
      /* 9  */ "O",             // aʊ
      /* 10 */ "O",              // ɔɪ
      /* 11 */ "I",              // aɪ
      /* 12 */ "kk",             // h
      /* 13 */ "RR",             // ɹ
      /* 14 */ "nn",             // l
      /* 15 */ "SS",             // s, z
      /* 16 */ "CH",             // ʃ, tʃ, dʒ, ʒ
      /* 17 */ "TH",             // ð
      /* 18 */ "FF",             // f, v
      /* 19 */ "DD",             // d, t, n, θ
      /* 20 */ "kk",             // k, g, ŋ
      /* 21 */ "PP"              // p, b, m
];

const AzureBlendshapeMap = [
      /* 0  */ "eyeBlinkLeft",
      /* 1  */ "eyeLookDownLeft",
      /* 2  */ "eyeLookInLeft",
      /* 3  */ "eyeLookOutLeft",
      /* 4  */ "eyeLookUpLeft",
      /* 5  */ "eyeSquintLeft",
      /* 6  */ "eyeWideLeft",
      /* 7  */ "eyeBlinkRight",
      /* 8  */ "eyeLookDownRight",
      /* 9  */ "eyeLookInRight",
      /* 10 */ "eyeLookOutRight",
      /* 11 */ "eyeLookUpRight",
      /* 12 */ "eyeSquintRight",
      /* 13 */ "eyeWideRight",
      /* 14 */ "jawForward",
      /* 15 */ "jawLeft",
      /* 16 */ "jawRight",
      /* 17 */ "jawOpen",
      /* 18 */ "mouthClose",
      /* 19 */ "mouthFunnel",
      /* 20 */ "mouthPucker",
      /* 21 */ "mouthLeft",
      /* 22 */ "mouthRight",
      /* 23 */ "mouthSmileLeft",
      /* 24 */ "mouthSmileRight",
      /* 25 */ "mouthFrownLeft",
      /* 26 */ "mouthFrownRight",
      /* 27 */ "mouthDimpleLeft",
      /* 28 */ "mouthDimpleRight",
      /* 29 */ "mouthStretchLeft",
      /* 30 */ "mouthStretchRight",
      /* 31 */ "mouthRollLower",
      /* 32 */ "mouthRollUpper",
      /* 33 */ "mouthShrugLower",
      /* 34 */ "mouthShrugUpper",
      /* 35 */ "mouthPressLeft",
      /* 36 */ "mouthPressRight",
      /* 37 */ "mouthLowerDownLeft",
      /* 38 */ "mouthLowerDownRight",
      /* 39 */ "mouthUpperUpLeft",
      /* 40 */ "mouthUpperUpRight",
      /* 41 */ "browDownLeft",
      /* 42 */ "browDownRight",
      /* 43 */ "browInnerUp",
      /* 44 */ "browOuterUpLeft",
      /* 45 */ "browOuterUpRight",
      /* 46 */ "cheekPuff",
      /* 47 */ "cheekSquintLeft",
      /* 48 */ "cheekSquintRight",
      /* 49 */ "noseSneerLeft",
      /* 50 */ "noseSneerRight",
      /* 51 */ "tongueOut",
      /* 52 */ "headRotateZ",
    /* 53 */ // "leftEyeRoll", // Not supported
    /* 54 */ // "rightEyeRoll" // Not supported
];
let head;
let microsoftSynthesizer = null;

function resetLipsyncBuffers() {
    visemesbuffer = {
        visemes: [],
        vtimes: [],
        vdurations: [],
    };
    prevViseme = null;
    wordsbuffer = {
        words: [],
        wtimes: [],
        wdurations: []
    };
    azureBlendShapes = {
        frames: [],
        sbuffer: [],
        orderBuffer: {}
    };

}

let visemesbuffer = null;
let prevViseme = null;
let wordsbuffer = null;
let azureBlendShapes = null;
let lipsyncType = "visemes";
resetLipsyncBuffers();

async function fetchAzureCredentials() {
    try {
        const res = await fetch("/api/token");
        const { token, region } = await res.json();
        sessionStorage.setItem('azureTTSKey', token);  // aún se llama así en tu código
        sessionStorage.setItem('azureRegion', region);

    } catch (err) {
        alert("Error obteniendo token de Azure");
        console.error(err);
    }
}




document.addEventListener('DOMContentLoaded', async () => {
    console.log("Loading Talking Head...");

    await fetchAzureCredentials(); // ✅ Primero obtiene la key desde el servidor
    const nodeAvatar = document.getElementById('avatar');
    const nodeSpeak = document.getElementById('speak');
    const nodeLoading = document.getElementById('loading');
    const regionValue = sessionStorage.getItem('azureRegion');
    const keyValue = sessionStorage.getItem('azureTTSKey');


    // Initialize TalkingHead
    head = new TalkingHead(nodeAvatar, {
        ttsEndpoint: "/gtts/",
        cameraView: "upper",
        lipsyncLang: "en"
    });

    // Show "Loading..." by default
    nodeLoading.textContent = "Loading...";

    // Load the avatar
    try {
        await head.showAvatar(
            {
                url: 'https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png',
                body: 'F',
            },
            (ev) => {
                if (ev.lengthComputable) {
                    const percent = Math.round((ev.loaded / ev.total) * 100);
                    nodeLoading.textContent = `Loading ${percent}%`;
                } else {
                    nodeLoading.textContent = `Loading... ${Math.round(ev.loaded / 1024)} KB`;
                }
            }
        );
        // Hide the loading element once fully loaded
        nodeLoading.style.display = 'none';
    } catch (error) {
        console.error("Error loading avatar:", error);
        nodeLoading.textContent = "Failed to load avatar.";
    }

    // Handle speech button click
    nodeSpeak.addEventListener('click', () => {
        const text = document.getElementById('text').value.trim();
        lipsyncType = "visemes";
        if (text) {
            const ssml = textToSSML(text);
            azureSpeak(ssml);
        }
    });

    // Pause/resume animation on visibility change
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            head.start();
        } else {
            head.stop();
        }
    });

    // Convert input text to SSML
    function textToSSML(text) {
        return `
          <speak version="1.0" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="es-ES">
            <voice name="es-ES-AlvaroNeural">
              <mstts:viseme type="FacialExpression" />
              ${text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')}
            </voice>
          </speak>`;
    }

    // Perform Azure TTS
    function azureSpeak(ssml) {
        if (!microsoftSynthesizer) {
            // Retrieve config from input fields
            const regionValue = sessionStorage.getItem('azureRegion');
            const keyValue = sessionStorage.getItem('azureTTSKey');
            console.log("Token recibido:", keyValue);
            console.log("Región:", regionValue);


            if (!regionValue || !keyValue) {
                console.error("Azure TTS region/key missing!");
                alert("Please enter your Azure TTS key and region in the settings panel.");
                return;
            }

            const config = window.SpeechSDK.SpeechConfig.fromAuthorizationToken(keyValue, regionValue);
            config.speechSynthesisOutputFormat =
                window.SpeechSDK.SpeechSynthesisOutputFormat.Raw48Khz16BitMonoPcm;
            microsoftSynthesizer = new window.SpeechSDK.SpeechSynthesizer(config, null);

            // Handle the synthesis results
            microsoftSynthesizer.synthesizing = (s, e) => {

                switch (lipsyncType) {
                    case "blendshapes":
                        head.streamAudio({
                            audio: e.result.audioData,
                            anims: azureBlendShapes?.sbuffer.splice(0, azureBlendShapes?.sbuffer.length)
                        });
                        break;
                    case "visemes":
                        head.streamAudio({
                            audio: e.result.audioData,
                            visemes: visemesbuffer.visemes.splice(0, visemesbuffer.visemes.length),
                            vtimes: visemesbuffer.vtimes.splice(0, visemesbuffer.vtimes.length),
                            vdurations: visemesbuffer.vdurations.splice(0, visemesbuffer.vdurations.length),
                        });
                        break;
                    case "words":
                        head.streamAudio({
                            audio: e.result.audioData,
                            words: wordsbuffer.words.splice(0, wordsbuffer.words.length),
                            wtimes: wordsbuffer.wtimes.splice(0, wordsbuffer.wtimes.length),
                            wdurations: wordsbuffer.wdurations.splice(0, wordsbuffer.wdurations.length)
                        });
                        break;
                    default:
                        console.error(`Unknown animation mode: ${lipsyncType}`);
                }
            };

            // Viseme handling
            microsoftSynthesizer.visemeReceived = (s, e) => {
                if (lipsyncType === "visemes") {
                    const vtime = e.audioOffset / 10000;
                    const viseme = visemeMap[e.visemeId];
                    if (!head.isStreaming) return;
                    if (prevViseme) {
                        let vduration = vtime - prevViseme.vtime;
                        if (vduration < 40) vduration = 40;
                        visemesbuffer.visemes.push(prevViseme.viseme);
                        visemesbuffer.vtimes.push(prevViseme.vtime);
                        visemesbuffer.vdurations.push(vduration);
                    }
                    prevViseme = { viseme, vtime };

                } else if (lipsyncType === "blendshapes") {
                    let animation = null;
                    if (e?.animation && e.animation.trim() !== "") {
                        try {
                            animation = JSON.parse(e.animation);
                        } catch (error) {
                            console.error("Error parsing animation blendshapes:", error);
                            return;
                        }
                    }
                    if (!animation) return;
                    const vs = {};
                    AzureBlendshapeMap.forEach((mtName, i) => {
                        vs[mtName] = animation.BlendShapes.map(frame => frame[i]);
                    });

                    azureBlendShapes.sbuffer.push({
                        name: "blendshapes",
                        delay: animation.FrameIndex * 1000 / 60,
                        dt: Array.from({ length: animation.BlendShapes.length }, () => 1000 / 60),
                        vs: vs,
                    });
                }
            };

            // Process word boundaries and punctuations
            microsoftSynthesizer.wordBoundary = function (s, e) {
                const word = e.text;
                const time = e.audioOffset / 10000;
                const duration = e.duration / 10000;

                if (e.boundaryType === "PunctuationBoundary" && wordsbuffer.words.length) {
                    wordsbuffer.words[wordsbuffer.words.length - 1] += word;
                    wordsbuffer.wdurations[wordsbuffer.wdurations.length - 1] += duration;
                } else if (e.boundaryType === "WordBoundary" || e.boundaryType === "PunctuationBoundary") {
                    wordsbuffer.words.push(word);
                    wordsbuffer.wtimes.push(time);
                    wordsbuffer.wdurations.push(duration);
                }
            };
        }

        // Start stream speaking
        head.streamStart(
            { sampleRate: 48000, mood: "happy", gain: 0.5, lipsyncType: lipsyncType },
            () => {
                console.log("Audio playback started.");
                const subtitlesElement = document.getElementById("subtitles");
                subtitlesElement.textContent = "";
                subtitlesElement.style.display = "none";
            },
            () => {
                console.log("Audio playback ended.");
                const subtitlesElement = document.getElementById("subtitles");
                const displayDuration = Math.max(2000, subtitlesElement.textContent.length * 50);
                setTimeout(() => {
                    subtitlesElement.textContent = "";
                    subtitlesElement.style.display = "none";
                }, displayDuration);
            },
            (subtitleText) => {
                console.log("subtitleText: ", subtitleText);
                const subtitlesElement = document.getElementById("subtitles");
                subtitlesElement.textContent += subtitleText;
                subtitlesElement.style.display = subtitlesElement.textContent ? "block" : "none";
            }
        );

        // Perform TTS
        microsoftSynthesizer.speakSsmlAsync(
            ssml,
            (result) => {
                if (result.reason === window.SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                    if (lipsyncType === "visemes" && prevViseme) {
                        // Final viseme duration guess
                        const finalDuration = 100;
                        // Add to visemesbuffer
                        visemesbuffer.visemes.push(prevViseme.viseme);
                        visemesbuffer.vtimes.push(prevViseme.vtime);
                        visemesbuffer.vdurations.push(finalDuration);
                        // Now clear the last viseme
                        prevViseme = null;
                    }
                    let speak = {};
                    // stream any remaining visemes, blendshapes, or words
                    if (lipsyncType === "visemes" && visemesbuffer.visemes.length) {
                        speak.visemes = visemesbuffer.visemes.splice(0, visemesbuffer.visemes.length);
                        speak.vtimes = visemesbuffer.vtimes.splice(0, visemesbuffer.vtimes.length);
                        speak.vdurations = visemesbuffer.vdurations.splice(0, visemesbuffer.vdurations.length);
                    }
                    if (lipsyncType === "blendshapes") {
                        speak.anims = azureBlendShapes?.sbuffer.splice(0, azureBlendShapes?.sbuffer.length);
                    }

                    // stream words always for subtitles
                    speak.words = wordsbuffer.words.splice(0, wordsbuffer.words.length);
                    speak.wtimes = wordsbuffer.wtimes.splice(0, wordsbuffer.wtimes.length);
                    speak.wdurations = wordsbuffer.wdurations.splice(0, wordsbuffer.wdurations.length);

                    if (speak.visemes || speak.words || speak.anims) {
                        // If we have any visemes, words, or blendshapes left, stream them
                        speak.audio = null;
                        head.streamAudio(speak);
                    }

                    head.streamNotifyEnd();
                    resetLipsyncBuffers();
                    console.log("Speech synthesis completed.");
                }
            },
            (error) => {
                console.error("Azure speech synthesis error:", error);
                resetLipsyncBuffers();
            }
        );
    }

});