let api_key = "pdgPfpMIBejBL2VCIMm1u95FafUZoCMm";
let favoritesSection = document.querySelector('#favorites-section');
let noFavoritesSection = document.querySelector('#noFavorites-container');
let favoritesArray = [];
favoritesGifos = [];
let maximizedSection = document.querySelector('#maximizedGifSection');
let camara = document.querySelector('.camara');
let camaraNocturna = document.querySelector('.camaraNocturna');





document.addEventListener("DOMContentLoaded", function (event) {
    if (
        JSON.parse(localStorage.getItem("myGifoUrl")) === null ||
        JSON.parse(localStorage.getItem("myGifoUrl")) === undefined
      ) {
        localStorage.setItem("myGifoUrl", JSON.stringify([]));
      }
    appearFavoriteGifos();   
         
});


const appearFavoriteGifos = () => {
    if (favoritesArray == 0 || favoritesArray == null) {
        noFavoritesSection.classList.remove('hidden');
        favoritesSection.classList.add('hidden');
    } else {
        noFavoritesSection.classList.add('hidden');
        favoritesSection.classList.remove('hidden');
    }
}



  

/* ++++++++++++++++++++++++++    Trendings    ++++++++++++++++++++++++++ */

//Variables

let arrowLeft = document.querySelector('.arrow-left');
let arrowRight = document.querySelector('.arrow-right');
let trendingParagraph = document.querySelector('.trending-gifos-text');
let imageContainer = document.querySelector(".image-container");


// Change arrow image on Hover

arrowLeft.addEventListener('mouseover', () => {
    arrowLeft.src = './assets/button-slider-left-hover.svg'
});

arrowRight.addEventListener('mouseover', () => {
    arrowRight.src = './assets/button-Slider-right-hover.svg'
});

arrowLeft.addEventListener('mouseout', () => {
    arrowLeft.src = './assets/button-slider-left.svg'
});

arrowRight.addEventListener('mouseout', () => {
    arrowRight.src = './assets/button-Slider-right.svg'
});

//Api Call

const callTrending = async () => {
    await fetch(`https://api.giphy.com/v1/trending/searches?api_key=${api_key}`)
        .then((response) => response.json())
        .then((trendingGifos) => {
            showTrendingGifos(trendingGifos);
        })
        .catch((err) => console.log(err));
};

callTrending();

const showTrendingGifos = (trendingGifos) => {
    for (let i = 0; i < 6; i++) {
        const createSpan = document.createElement('span');
        createSpan.classList.add('trending-tag');
        createSpan.setAttribute('onclick', `findSearch("${trendingGifos.data[i]}")`);
        createSpan.innerHTML = `${trendingGifos.data[i]}`;
    }
};

const displayTrendingGifos = async () => {
    await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${api_key}&limit=12`)
        .then((response) => response.json())
        .then((results) => {
            getTrendingGifos(results);
        })
        .catch((err) => console.log(err));
};

displayTrendingGifos();

const getTrendingGifos = (results) => {
    for (let i = 0; i < results.data.length; i++) {
        const createContainer = document.createElement('div');
        createContainer.classList.add('general-container');
        createContainer.innerHTML = `
        <img class="gif-image" onclick="maximizeGif('${results.data[i].images.original.url}'
        ,'${results.data[i].username}','${results.data[i].title}')" 
        src="${results.data[i].images.original.url}" alt="${results.data[i].title}">
	
		<div class="gif-buttons">
			<div class="gif-buttons-icons">
				<div class="button favorite" onclick="addFavorites('${results.data[i].images.original.url}','${results.data[i].username}','${results.data[i].title}', '${results.data[i].id}')"></div>
				<div class="button download" onclick="downloadGif('${results.data[i].images.original.url}','${results.data[i].title}')"></div>
				<div class="button maximize" onclick="maximizeGif('${results.data[i].images.original.url}','${results.data[i].username}','${results.data[i].title}')"></div>
			</div>
			<div class="gif-info-user">
				<p class="gif-user">${results.data[i].username}</p>
				<p class="gif-title">${results.data[i].title}</p>
			</div>
		</div>
        `;

        imageContainer.appendChild(createContainer);
    }
};

const arrowRightFunction = () => {
    imageContainer.scrollLeft += 400;
}

const arrowLeftFunction = () => {
    imageContainer.scrollLeft -= 400;
};

arrowRight.addEventListener('click', arrowRightFunction);
arrowLeft.addEventListener('click', arrowLeftFunction);

const addFavorites = (gif, username, title, id) => {
    let newObjGif = {
        username: username,
        title: title,
        gif: gif,
        id: id
    };
    favoritesArray.push(newObjGif);
    //LocalStorage to data
    localStorage.setItem('FavoriteGifos', JSON.stringify(favoritesArray));
    //showFavoriteGifos();
}


const removeGif = (gif, event) => {

   
    let containerMyGifos = document.querySelector('#misgifos-container');
    
    //Parse first the info, array
    let favoritesArrayParsed = JSON.parse(localStorage.getItem('myGifoUrl'));    
        
    //Loop all to clean localStorage
   console.log(favoritesArrayParsed)
   let returnIndexGif = favoritesArrayParsed.findIndex(e => e.url == gif);
   
   if(returnIndexGif != -1) {
    containerMyGifos.removeChild(containerMyGifos.children[returnIndexGif]);    
    favoritesArrayParsed.splice(returnIndexGif, 1);  
     
    
    localStorage.setItem(
        'myGifoUrl',
        JSON.stringify(favoritesArrayParsed)                
    );        

     if(favoritesArrayParsed == 0) {
         noFavoritesSection.classList.remove('hidden');
         favoritesSection.classList.add('hidden');
     }
    closeMaximizedGifo();      
   }

}


// Show Favorites

const showFavoriteGifos = () => {
    //Local storage Call
    
    favoritesArray = JSON.parse(localStorage.getItem('myGifoUrl'));

    console.log(favoritesArray)
    //Check if arr is null else push all items
    if (favoritesArray === null) {
        favoritesArray = [];
    } else {
        for (let i = 0; i < favoritesArray.length; i++) {
            var template = `
            <div class="general-container">
        <img class="gif-image" onclick="maximizeGif('${favoritesArray[i].url}','${favoritesArray[i].user}','')" src="${favoritesArray[i].url}">
    
        <div class="gif-buttons">
            <div class="gif-buttons-icons">
                <div class="button remove" onclick="removeGif('${favoritesArray[i].url}', event)" id="removeGif"></div>
                <div class="button download" onclick="downloadGif('${favoritesArray[i].url}','${favoritesArray[i].user}')"></div>
                <div class="button maximize" onclick="maximizeGif('${favoritesArray[i].url}','${favoritesArray[i].user}','')"></div>
            </div>
            <div class="gif-info-user">
                <p class="gif-user">${favoritesArray[i].user}</p>
                <p class="gif-title">''</p>
            </div>
        </div>
        </div>
        `;
            document.querySelector('#misgifos-container').innerHTML += template;
            
        }
    }
};

showFavoriteGifos();

let addTrendingGifos = (gif) => {
    let template = `
    <div class="general-container">
        <img class="gif-image" onclick="maximizeGif('${gif.gif}','${gif.username}','${gif.title}')" src="${gif}" alt="${gif.title}">
    
        <div class="gif-buttons">
            <div class="gif-buttons-icons">
                <div class="button remove" onclick="removeGif('${gif.gif}', event)" id="removeGif"></div>
                <div class="button download" onclick="downloadGif('${gif.gif}','${gif.title}')"></div>
                <div class="button maximize" onclick="maximizeGif('${gif.gif}','${gif.username}','${gif.title}')"></div>
            </div>
            <div class="gif-info-user">
                <p class="gif-user">${gif.username}</p>
                <p class="gif-title">${gif.title}</p>
            </div>
        </div>
        </div>
    `;
    document.querySelector('#favorite-container').innerHTML += template;
    
}



const maximizeGif = (gif, username, title) => {
    maximizedSection.classList.remove('hidden');
    maximizedSection.classList.add('maximizedGifSection');
    maximizedSection.innerHTML = '';
    const maximizedContainer = document.createElement('div');
    maximizedContainer.classList.add('maximizedContainer');
    maximizedContainer.innerHTML = `
    <div class="close-maximized" id="close-maximized" onclick="closeMaximizedGifo()"></div>

    <div class="maxGif_Container">
        <img class="gifMaximized" src="${gif}" alt="${title}">
    </div>

    <div class="gifMaxButtons">
        <div class="gif-info">
            <p class="gif-user">${username}</p>
            <p class="gif-title">${title}</p>
        </div>
        <div class="gifMax-btn">
            <div class="buttonsMaximized favoriteMaximized" onclick="addFavorites('${gif}', '${username}', '${title}')"></div>
            <div class="buttonsMaximized downloadMaximized" onclick="downloadGif('${gif}','${title}')"></div>
            </div>
    </div>
    `
    maximizedSection.appendChild(maximizedContainer);
};

const closeMaximizedGifo = () => {
    let maximizedSection = document.querySelector('#maximizedGifSection');
    maximizedSection.classList.add('hidden');
    maximizedSection.classList.remove('maximizedGifSection');
}



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
