// Variables
document.addEventListener("DOMContentLoaded", function (event) {
  let api_key = "pdgPfpMIBejBL2VCIMm1u95FafUZoCMm";
  const comenzar = document.querySelector(".comenzar");
  const grabar = document.querySelector(".grabar");
  const finalizar = document.querySelector(".finalizar");
  const numberOne = document.querySelector(".number-one");
  const numberTwo = document.querySelector(".number-two");
  const numberThree = document.querySelector(".number-three");
  const accessText = document.querySelector(".access");
  const mainCreateText = document.querySelector(".main-create-text");
  const upload = document.querySelector(".subirGifo");
  const timer = document.querySelector(".timer");
  const video = document.querySelector("video");
  const record = document.querySelector(".grabar");
  const restart = document.querySelector(".repetir-captura");
  const uploadMessage = document.getElementById("upload-message");
  const preview = document.getElementById("preview");
  let favoritesArray = [];
  let myGifosArray = [];

  let recorder;

  let recording = false;

  //Remove button on click

  if (localStorage.getItem("theme") === "dark") {
    let camara = document.querySelector(".camara");
    let camaraNocturna = document.querySelector(".camaraNocturna");
    if (camara != null || camaraNocturna != null) {
      camara.classList.add("hidden");
      camaraNocturna.classList.remove("hidden");
    }
  } else if (localStorage.getItem("theme") === "light") {
    let camara = document.querySelector(".camara");
    let camaraNocturna = document.querySelector(".camaraNocturna");

    if (camara != null || camaraNocturna != null) {
      camara.classList.remove("hidden");
      camaraNocturna.classList.add("hidden");
    }
  }

  const mode = document.getElementById("change-mode");
  mode.addEventListener("click", () => {
    location.reload();
  });

  comenzar.addEventListener("click", () => {
    getStreamAndRecord();
    comenzar.setAttribute("id", "hide");
    grabar.classList.remove("hidden");
    numberOne.classList.remove("selected-number");
    numberTwo.classList.add("selected-number");
    accessText.classList.remove("hidden");
    mainCreateText.setAttribute("id", "hide");
    console.log("TRIGGERED");
  });

  function getStreamAndRecord() {
    if (!navigator.getUserMedia) {
      navigator.getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true,
      })
      .then(function (stream) {
        video.removeAttribute("id");
        accessText.setAttribute("id", "hide");

        video.srcObject = stream;
        video.play();

        record.addEventListener("click", () => {
          recording = !recording;

          if (recording === true) {
            this.disabled = true;
            recorder = RecordRTC(stream, {
              type: "gif",
              frameRate: 1,
              quality: 10,
              width: 360,
              hidden: 240,
              onGifRecordingStarted: function () {
                console.log("started");
              },
            });

            recorder.startRecording();
            getDuration();
            record.innerHTML = "FINALIZAR";
            recorder.camera = stream;
          } else {
            this.disabled = true;
            recorder.stopRecording(stopRecordingCallback);
            recording = false;
          }
        });
      })
      .catch((error) => {
        alert("Conecte una camara Por Favor.");
      });
  }

  function stopRecordingCallback() {
    recorder.camera.stop();

    let form = new FormData();
    form.append("file", recorder.getBlob(), "test.gif");

    upload.addEventListener("click", () => {
      uploadMessage.classList.remove("hidden");
      upload.style.display = "none";
      uploadGif(form);
    });

    objectURL = URL.createObjectURL(recorder.getBlob());
    preview.src = objectURL;

    preview.classList.remove("hidden");
    video.classList.add("hidden");
    record.classList.add("hidden");
    upload.classList.remove("hidden");    
    timer.setAttribute("id", "hide");    
    numberTwo.classList.remove("selected-number");
    numberThree.classList.add("selected-number");
    document.querySelector(".container-preview").classList.remove("hidden");
    recorder.destroy();
    recorder = null;
    restart.classList.remove("hidden");

  }

  restart.addEventListener("click", () => {
    location.reload();
    getStreamAndRecord();
  });

  function getDuration() {
    let seconds = 0;
    let minutes = 0;
    let timer = setInterval(() => {
      if (recording) {
        if (seconds < 60) {
          if (seconds <= 9) {
            seconds = "0" + seconds;
          }
          document.querySelector(
            ".timer"
          ).innerHTML = `00:00:0${minutes}:${seconds}`;
          seconds++;
        } else {
          minutes++;
          seconds = 0;
        }
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }

  async function uploadGif(gif) {
    let api_key = "pdgPfpMIBejBL2VCIMm1u95FafUZoCMm";

    fetch("https://upload.giphy.com/v1/gifs" + "?api_key=" + api_key, {
      method: "POST", // or 'PUT'
      body: gif,
    })
      .then((res) => {
        console.log(res.status);
        if (res.status != 200) {
          uploadMessage.innerHTML = `<h3>Hubo un error subiendo tu Guifo</h3>`;
        } else {
          console.log("GIFO SUBIDO");
          document.querySelector("#uploadingIcon").classList.add("hidden");
          document.querySelector("#uploadingGifo").classList.add("hidden");
          document.querySelector("#imageUploaded").classList.remove("hidden");
          document.querySelector("#exito").classList.remove("hidden");
          document
            .querySelector(".container-preview")
            .classList.remove("hidden");

        }
        return res.json();
      })
      .then((data) => {
        const gifId = data.data.id;
        getGifDetails(gifId);
        downloadMyGifo(gifId);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function getGifDetails(id) {
      let api_key = "pdgPfpMIBejBL2VCIMm1u95FafUZoCMm";    
      let arrayTemporal = JSON.parse(localStorage.getItem("myGifoUrl"));
      let index = arrayTemporal.findIndex(e => e.id == id);
      if(index == -1 ) {

        let data = await fetch("https://api.giphy.com/v1/gifs/" + id + "?api_key=" + api_key);
        let response = await data.json();        
          console.log(response)
          const gifId = response.data.id;
          const gifUrl = response.data.images.original.url;
          const gifUser = response.data.username;
              
          let newObjGif = {
            id: gifId,
            url: gifUrl,
            user: gifUser,
          };
  
          arrayTemporal.push(newObjGif);
          //LocalStorage to data
          localStorage.setItem("myGifoUrl", JSON.stringify(arrayTemporal));         
      }    
  }


  /* ++++++++++++++++++++++++++    Download Gif    ++++++++++++++++++++++++++ */

  const downloadGif = async (url) => {
    let temporalUrl = JSON.parse(localStorage.getItem("myGifoUrl"));

    let myGifoUrlCreated = temporalUrl[temporalUrl.length - 1].url;
    const blob = (await fetch(myGifoUrlCreated)).blob();
    const urlGif = URL.createObjectURL(await blob);
    const anker = document.createElement("a");
    anker.href = urlGif;
    anker.download = "giphyDownload.gif";
    document.body.appendChild(anker);
    anker.click();
    document.body.removeChild(anker);
  };

  const downloadMyGifo = () => {

    let template = `
      <div class="gif-buttons-icons-myGifos">                                          
      <div class="button download" id="downloadButton"></div>
      <div class="button icon-link" id="shareButton"></div>      
      <img class="video-preview" id="preview"/>   
      </div>
      `;
    document.querySelector(".gifoMask").innerHTML += template;
    document
      .querySelector("#downloadButton")
      .addEventListener("click", downloadGif);
    document.querySelector("#shareButton").addEventListener("click", () => {
      let myGifosLS = JSON.parse(localStorage.getItem("myGifoUrl"));
      let myGifos = myGifosLS[myGifosLS.length - 1].url;
      let urlCopy = document.createElement("input");
      urlCopy.value = myGifos;
      console.log(urlCopy.value);
      document.body.appendChild(urlCopy);
      urlCopy.select();
      document.execCommand("copy");
      document.body.removeChild(urlCopy);
    });
  };
});
