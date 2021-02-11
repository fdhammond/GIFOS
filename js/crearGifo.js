// Variables
document.addEventListener("DOMContentLoaded", function (event) { 
let api_key = "pdgPfpMIBejBL2VCIMm1u95FafUZoCMm";
const comenzar = document.querySelector('.comenzar');
const grabar = document.querySelector('.grabar')
const numberOne = document.querySelector('.number-one');
const numberTwo = document.querySelector('.number-two');
const numberThree = document.querySelector('.number-three');
const accessText = document.querySelector('.access');
const mainCreateText = document.querySelector('.main-create-text')
const upload = document.querySelector('.subirGifo');
const timer = document.querySelector('.timer');
const video = document.querySelector('video'); 
const record = document.querySelector('.grabar');
const restart = document.querySelector('.repetir-captura');
const uploadMessage = document.getElementById('upload-message');
const preview = document.getElementById('preview');
let favoritesArray = [];
let myGifosArray = [];
let falsy = true;


let recorder;

let recording = false;


//Remove button on click

  if(localStorage.getItem('theme') === "dark") {
    let camara = document.querySelector('.camara');
    let camaraNocturna = document.querySelector('.camaraNocturna');
    if(camara != null || camaraNocturna != null) {
      camara.classList.add('hidden');
      camaraNocturna.classList.remove('hidden');
    }
  
  } else if (localStorage.getItem('theme') === "light") {
    let camara = document.querySelector('.camara');
    let camaraNocturna = document.querySelector('.camaraNocturna');
    
    if(camara != null || camaraNocturna != null) {
      camara.classList.remove('hidden');
      camaraNocturna.classList.add('hidden');
    }
  }


const mode = document.getElementById("change-mode");
mode.addEventListener('click', () => {
  location.reload();
})

  comenzar.addEventListener('click', () => {
      getStreamAndRecord();
      comenzar.setAttribute('id', 'hide');   
      grabar.removeAttribute('id', 'hide');
      numberOne.classList.remove('selected-number')
      numberTwo.classList.add('selected-number');
      accessText.removeAttribute('id');
      mainCreateText.setAttribute('id', 'hide');
      console.log('TRIGGERED')
  });




function getStreamAndRecord () {
  
  if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  }

   
   navigator.mediaDevices.getUserMedia({
     audio: false,
     video: true
   })
   .then(function(stream) {

    video.removeAttribute('id');
    accessText.setAttribute('id', 'hide'); 
     
     video.srcObject = stream;
     video.play()
      
     record.addEventListener('click', () => {
       recording = !recording
     
     if (recording === true) {
       this.disabled = true;
       recorder = RecordRTC(stream, {
         type: 'gif',
         frameRate: 1,
         quality: 10,
         width: 360,
         hidden: 240,
         onGifRecordingStarted: function() {
           console.log('started')
         },
       });
       
       recorder.startRecording();
       getDuration();
     
       
       
       record.innerHTML = 'FINALIZAR'
       

       
       recorder.camera = stream; 

   } else {
       this.disabled = true;
       recorder.stopRecording(stopRecordingCallback);
       recording = false;   
     }
   });
 })
 .catch(error => {
  alert('Conecte una camara Por Favor.')     
});
}

function stopRecordingCallback() {

  recorder.camera.stop();

  let form = new FormData();
  form.append("file", recorder.getBlob(), 'test.gif');
  
  upload.addEventListener('click', () => {
    uploadMessage.classList.remove('hidden');
    upload.style.display = "none";
    uploadGif(form)
  })

  objectURL = URL.createObjectURL(recorder.getBlob());
  preview.src = objectURL;

  preview.classList.remove('hidden')
  video.classList.add('hidden')
  record.setAttribute('id', 'hide'); 
  upload.removeAttribute('id', 'hide'); 
  timer.setAttribute('id', 'hide');
  restart.removeAttribute('id', 'hide');
  numberTwo.classList.remove('selected-number');
  numberThree.classList.add('selected-number');
  document.querySelector('.container-preview').classList.remove('hidden');
  recorder.destroy();
  recorder = null;
 
}

restart.addEventListener('click', () => {
  location.reload();
  getStreamAndRecord();

})


function getDuration() {  

  let seconds = 0;
  let minutes = 0;
  let timer = setInterval(() => {
    if (recording) {
      if (seconds < 60) {
        if (seconds <= 9) {
          seconds = '0' + seconds;
        }
        document.querySelector('.timer').innerHTML=`00:00:0${minutes}:${seconds}`;
        seconds++;
      } else {
        minutes++;
        seconds = 0;
      }
    }
    else {
      clearInterval(timer)
    }
  }, 1000);
} 

function uploadGif(gif) {
  let api_key = "pdgPfpMIBejBL2VCIMm1u95FafUZoCMm";

  fetch('https://upload.giphy.com/v1/gifs' + '?api_key=' + api_key, {
    method: 'POST', // or 'PUT'
    body: gif,
  }).then(res => {
    console.log(res.status)
    if (res.status != 200 ) {
      uploadMessage.innerHTML = `<h3>Hubo un error subiendo tu Guifo</h3>`
    } else {    
      let myGifos = JSON.parse(localStorage.getItem('myGifoUrl'));
      console.log('GIFO SUBIDO')
      document.querySelector('#uploadingIcon').classList.add('hidden');
      document.querySelector('#uploadingGifo').classList.add('hidden');
      document.querySelector('#imageUploaded').classList.remove('hidden');
      document.querySelector('#exito').classList.remove('hidden');
      document.querySelector('.container-preview').classList.remove('hidden');      
      downloadMyGifo();      
    }
    return res.json();  
  }).then(data => {  
    const gifId = data.data.id
    getGifDetails(gifId);
  })
  .catch(error => {
    console.error('Error:', error)
  });
}



function getGifDetails (id) {
  let api_key = "pdgPfpMIBejBL2VCIMm1u95FafUZoCMm";
  fetch('https://api.giphy.com/v1/gifs/' + id + '?api_key=' + api_key) 
      .then((response) => {
         return response.json()
      }).then(data => {
        /*
          Crear array en LS llamado mis GIFOS, hacer push al container en MIS GIFOS.
*/  
    const gifUrl = data.data.images.original.url;
    const gifUser = data.data.username;
    let arrayTemporal = JSON.parse(localStorage.getItem('myGifoUrl'));
    let index = arrayTemporal.findIndex(e => e.id == id);
   
    if (index == -1) {
  
      let newObjGif = {
          url : gifUrl,
          user: gifUser
        };
        
        favoritesArray = [];
        favoritesArray.push(newObjGif);
               
        arrayTemporal.push(newObjGif);
        //LocalStorage to data
        localStorage.setItem('myGifoUrl', JSON.stringify(arrayTemporal));   
        noFavoritesSection.classList.add('hidden');
        favoritesSection.classList.remove('hidden');
        addMyGifosTemplate(newObjGif);
  } 

let myGifosObject = {
  url : gifUrl,
  user: gifUser
}

myGifosArray.push(myGifosObject);

console.log(myGifosArray)
localStorage.setItem('myGifoUrl', JSON.stringify(myGifosArray));


document.getElementById('finish').addEventListener('click', () => {
  location.reload();
})
          
      })
      .catch((error) => {
          return error
      })
}

let addMyGifosTemplate = (gif) => {
  let template = `
  <div class="general-container">
      <img class="gif-image" onclick="maximizeGif('${gif.gif}')" src="${gif.images.media.url}">
  
      <div class="gif-buttons">
          <div class="gif-buttons-icons">
              <div class="button remove" onclick="removeGif('${gif.url}', event)" id="removeGif"></div>
              <div class="button download" onclick="downloadGif('${gif.url}')"></div>
              <div class="button maximize" onclick="maximizeGif('${gif.url}')"></div>
          </div>
      </div>
      </div>
  `;
  document.querySelector('#misgifos-container').innerHTML += template;
}



const addMyGifos = (gif, username, title, id) => {    
  let arrayTemporal = JSON.parse(localStorage.getItem('myGifoUrl'));
  let index = arrayTemporal.findIndex(e => e.id == id);
 
  if (index == -1) {
      let newObjGif = {
          gif: gif,
          username: username,
          title: title,
          id: id
      };
      
      myGifosArray = [];
      myGifosArray.push(newObjGif);
             
      arrayTemporal.push(newObjGif);
      //LocalStorage to data
      localStorage.setItem('myGifoUrl', JSON.stringify(arrayTemporal));   
      noFavoritesSection.classList.add('hidden');
      favoritesSection.classList.remove('hidden');
      addMyGifosTemplate(newObjGif);
  } 

}

/* ++++++++++++++++++++++++++    Download Gif    ++++++++++++++++++++++++++ */


const downloadGif = async (url) => {    

  let temporalUrl = JSON.parse(localStorage.getItem('myGifoUrl'));
  
  let myGifoUrlCreated = temporalUrl[temporalUrl.length-1].url;
  const blob = (await fetch(myGifoUrlCreated)).blob();
  const urlGif = URL.createObjectURL(await blob);
  const anker = document.createElement('a');
  anker.href = urlGif;
  anker.download = "giphyDownload.gif";
  document.body.appendChild(anker);
  anker.click();
  document.body.removeChild(anker);
 }

// const gifoLink = async (url) => {
//   debugger;  
//     let urlCopy = document.createElement('input');  
//     urlCopy.value = url;    
//     console.log(urlCopy.value)
//     document.body.appendChild(urlCopy);
//     urlCopy.select();
//     document.execCommand("copy");
//     document.body.removeChild(urlCopy);
// }

const downloadMyGifo = () => {
  let myGifosLS = JSON.parse(localStorage.getItem('myGifoUrl'));

  let myGifos = myGifosLS[myGifosLS.length - 1].url;    
      let template = `
      <div class="gif-buttons-icons-myGifos">                                          
      <div class="button download" id="downloadButton"></div>
      <div class="button icon-link" id="shareButton"></div>      
      <img class="video-preview" id="preview"/>   
      </div>
      `;
      document.querySelector('.gifoMask').innerHTML += template;  
      document.querySelector('#downloadButton').addEventListener('click', downloadGif);
      document.querySelector('#shareButton').addEventListener('click', () => {
    let urlCopy = document.createElement('input');  
    urlCopy.value = myGifos;    
    console.log(urlCopy.value)
    document.body.appendChild(urlCopy);
    urlCopy.select();
    document.execCommand("copy");
    document.body.removeChild(urlCopy);
      });
       
}




});




