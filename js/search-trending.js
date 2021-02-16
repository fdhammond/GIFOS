//Variables
let api_key = "pdgPfpMIBejBL2VCIMm1u95FafUZoCMm";
let imageContainer = document.querySelector(".image-container");
let iconContainer = document.querySelector('.icons');
let itemContainer = document.querySelector('.item');
let favoritesArray = [];


//Search
let searchResult = document.getElementById('search-result');
let viewMore = document.getElementById('view-more');
let searchErrorContainer = document.getElementById('search-error');
let searchInput = document.querySelector('#input-search');
let searchSuggestionsContainer = document.querySelector('#searchSuggestions');
let suggestionList = document.querySelector('#searchSuggestions-list');
let showResultGallery = document.querySelector('#show-search-result');
let searchButtonGrey = document.querySelector('#button-search-grey');
let searchButtonClose = document.querySelector('#icon-close-search');
let iconSearch = document.querySelector('#icon-search');
let searchContainer = document.querySelector('#container-search');
let resultsTitle = document.querySelector('.results-title');
let searchLine = document.querySelector('.search-line');
//Events
//Favorites
let favoritesContainer = document.querySelector('#favorite-container');
let favoritesSection = document.querySelector('#favorites-section');
let noFavoritesSection = document.querySelector('#noFavorites-container')
let favoritesMenuBar = document.querySelector('#favorites');
//Maximized Gifos
let maximizedSection = document.querySelector('#maximizedGifSection');



/* ++++++++++++++++++++++++++    Trendings    ++++++++++++++++++++++++++ */

//Variables

let arrowLeft = document.querySelector('.arrow-left');
let arrowRight = document.querySelector('.arrow-right');
let trendingParagraph = document.querySelector('.trending-gifos-text');


// Change arrow image on Hover

arrowLeft.addEventListener('mouseover', () => {
    arrowLeft.src = './assets/button-slider-left-hover.svg'
});

arrowRight.addEventListener('mouseover', () => {
    arrowRight.src = './assets/Button-Slider-right-hover.svg'
});

arrowLeft.addEventListener('mouseout', () => {
    arrowLeft.src = './assets/button-slider-left.svg'
});

arrowRight.addEventListener('mouseout', () => {
    arrowRight.src = './assets/Button-Slider-right.svg'
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
        trendingParagraph.appendChild(createSpan);
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


//Maximize Gifo


/* ++++++++++++++++++++++++++    Search    ++++++++++++++++++++++++++ */

let setNewSearch = 0;

//Search Gifos async

const findSearch = async (search) => {
    event.preventDefault();
    clearSuggestions();
    searchInput.value = search;
    resultsTitle.innerHTML = search;

    if (setNewSearch === 0) {
        showResultGallery.innerHTML = ' ';
    }


    await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${search}&offset=${setNewSearch}&limit=14&rating=g`
    )
        .then((response) => response.json())
        .then((results) => {
            if (results.data == 0) {
                showErrorSearch();
            } else {
                displayGifos(results)
            }
        })

        .catch((error) => console.log(error));
};

//Display Gifos

const displayGifos = (results) => {
    //Muestra container de los resultados busqueda
    searchResult.classList.remove('hidden');
    //Muestra boton ver mas
    viewMore.classList.remove('hidden');
    searchSuggestionsContainer.classList.add('hidden');
    searchLine.classList.add('hidden');

    if (setNewSearch == 0) {
        window.scrollTo({ top: 500, behavior: 'smooth' });
    }

    if (results.data.length < 14) {
        viewMore.style.display = 'none';
    }


    for (let i = 0; i < results.data.length; i++) {
        const createContainer = document.createElement('div');
        createContainer.classList.add('general-container');
        createContainer.innerHTML = `
        <img class="gif-image" onclick="maximizeGif('${results.data[i].images.original.url}'
        ,'${results.data[i].username}','${results.data[i].title}')" 
        src="${results.data[i].images.original.url}" alt="${results.data[i].title}">
	
		<div class="gif-buttons">
			<div class="gif-buttons-icons">
				<div class="button favorite" onclick="addFavorites('${results.data[i].images.original.url}','${results.data[i].username}','${results.data[i].title}','${results.data[i].id}')"></div>
				<div class="button download" onclick="downloadGif('${results.data[i].images.original.url}','${results.data[i].title}')"></div>
				<div class="button maximize" onclick="maximizeGif('${results.data[i].images.original.url}','${results.data[i].username}','${results.data[i].title}')"></div>
			</div>
			<div class="gif-info-user">
				<p class="gif-user">${results.data[i].username}</p>
				<p class="gif-title">${results.data[i].title}</p>
			</div>
		</div>
        `;

        showResultGallery.appendChild(createContainer);
    }
}

//Error if doesnt find any Gifo

const showErrorSearch = () => {
    searchResult.classList.remove('hidden');
    searchErrorContainer.classList.remove('hidden');
    searchSuggestionsContainer.classList.add('hidden');
    resultsTitle.classList.add('hidden')
    searchErrorContainer.innerHTML = `
        <div class="search-error" id="search-error">
        <img class="" id="search-error" src="./assets/icon-busqueda-sin-resultado.svg" alg="No se encontraron Gifos">
        <h4 class="search-error-text">Por favor intente nuevamente.</h4>        
        </div>
    `
    viewMore.style.display = 'none';
}

//Push 12 Gifos to array and display them

const viewMoreButton = () => {
    setNewSearch += 12;
    if (searchInput.value) {
        findSearch(searchInput.value);
    }
}

/* ++++++++++++++++++++++++++    Search Suggestions    ++++++++++++++++++++++++++ */

const getSuggestions = async () => {
    clearSuggestions();
    searchSuggestionsContainer.classList.remove('hidden');
    const GET_USER_INPUT = searchInput.value;


if (GET_USER_INPUT.length >= 1) {

       await fetch(
           //Check endpoint suggestions
           `https://api.giphy.com/v1/gifs/search/tags?api_key=${api_key}&q=${GET_USER_INPUT}&limit=5&rating=g`
       )
   
           .then((response) => response.json())
           .then((suggestions) => {
               showSuggestions(suggestions);
           })
           .catch((error) => {
               console.log(error);
           })    
    }
};

const showSuggestions = (suggestions) => {
    if (searchInput === 0) {
        searchSuggestionsContainer.classList.add('hidden');
        suggestionList.classList.add('hidden');
    }
    for (let i = 0; i < suggestions.data.length; i++) {
        const suggestionItem = document.createElement('li');
        suggestionList.classList.remove('hidden')
        suggestionItem.classList.add('searchSuggestions-item');
        suggestionItem.innerHTML = `
            <img class="search-gray" id="" src="./assets/icon-search.svg" alt="Buscar" 
            onclick="findSearch('${suggestions.data[i].name}')">
            <p class="search-text" onclick="findSearch('${suggestions.data[i].name}')">
            ${suggestions.data[i].name}</p> `;
        suggestionList.appendChild(suggestionItem);
    }
}

//Clear container to 0 - Search

const clearResults = () => {
    searchResult.classList.add('hidden');
    searchErrorContainer.classList.remove('hidden');
    viewMore.style.display = 'block';
    showResultGallery.innerHTML = '';
    searchInput.placeholder = 'Busca GIFOS y mas';

}

//Clear container to 0 - Suggestions

const clearSuggestions = () => {
    suggestionList.classList.add('hidden');
    suggestionList.innerHTML = '';
}

//Search Bar State

//Active

const activeStateSearchBar = () => {
    searchButtonGrey.classList.remove('hidden');
    searchButtonClose.classList.remove('hidden');
    iconSearch.classList.add('hidden');
    searchSuggestionsContainer.classList.remove('hidden');
    searchContainer.classList.add('searchActive');
    searchSuggestionsContainer.classList.add('searchActiveContainer');
}

//Inactive

const inactiveSearchBar = () => {
    searchInput.value = '';
    clearResults();
    clearSuggestions();
    searchSuggestionsContainer.classList.add('hidden');
    iconSearch.classList.remove('hidden');
    searchButtonClose.classList.add('hidden');
    searchButtonGrey.classList.add('hidden');
}

//Events to trigger

searchInput.addEventListener('keypress', (e) => {
    //keyCode = 13 = ENTER
    if (e.keyCode === 13) {
        findSearch(searchInput.value);
    }
})

searchInput.addEventListener('keypress', activeStateSearchBar);
searchInput.addEventListener('input', activeStateSearchBar);
searchInput.addEventListener('input', getSuggestions);
searchInput.addEventListener('input', clearSuggestions);

searchButtonClose.addEventListener('click', inactiveSearchBar);
viewMore.addEventListener('click', viewMoreButton);


//Functions
/* ++++++++++++++++++++++++++    Favorites    ++++++++++++++++++++++++++ */

const showFavoriteGifos = () => {

    //Local storage Call
    favoritesArray = JSON.parse(localStorage.getItem('FavoriteGifos'));

    //Check if arr is null else push all items
    if (favoritesArray == null) {
        favoritesArray = [];
    } else {
        for (let i = 0; i < favoritesArray.length; i++) {
            var template = `
            <div class="general-container">
        <img class="gif-image" onclick="maximizeGif('${favoritesArray[i].gif}','${favoritesArray[i].username}','${favoritesArray[i].title}')" src="${favoritesArray[i].gif}" alt="${favoritesArray[i].title}">
    
        <div class="gif-buttons">
            <div class="gif-buttons-icons">
                <div class="button remove" onclick="removeGif('${favoritesArray[i].gif}')" id="removeGif"></div>
                <div class="button download" onclick="downloadGif('${favoritesArray[i].gif}','${favoritesArray[i].title}')"></div>
                <div class="button maximize" onclick="maximizeGif('${favoritesArray[i].gif}','${favoritesArray[i].username}','${favoritesArray[i].title}')"></div>
            </div>
            <div class="gif-info-user">
                <p class="gif-user">${favoritesArray[i].username}</p>
                <p class="gif-title">${favoritesArray[i].title}</p>
            </div>
        </div>
        </div>
        `;
            document.querySelector('#favorite-container').innerHTML += template;
            
        }
    }
    
};

let addTrendingGifos = (gif) => {
    let template = `
    <div class="general-container">
        <img class="gif-image" onclick="maximizeGif('${gif.gif}','${gif.username}','${gif.title}')" src="${gif.gif}" alt="${gif.title}">
    
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
    if (template == null) {
        document.querySelector('#favorite-container').innerHTML += template;        
    }
}


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
    
}




/* ++++++++++++++++++++++++++    Download Gif    ++++++++++++++++++++++++++ */

const downloadGif = async (url) => {    
   const blob = (await fetch(url)).blob();
   const urlGif = URL.createObjectURL(await blob);
   const anker = document.createElement('a');
   anker.href = urlGif;
   anker.download = "giphyDownload.gif";
   document.body.appendChild(anker);
   anker.click();
   document.body.removeChild(anker);
}


/* ++++++++++++++++++++++++++    Maximize Gif - Search    ++++++++++++++++++++++++++ */

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
			<p class="gif-user gif-title-maximized">${username}</p>
			<p class="gif-title gif-title-maximized">${title}</p>
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
    maximizedSection.classList.add('hidden');
    maximizedSection.classList.remove('maximizedGifSection');

}


/* ++++++++++++++++++++++++++    Remove Gif - Favorites    ++++++++++++++++++++++++++ */

const removeGif = (gif, event) => {

        let containerFavorite = document.querySelector('#favorite-container');
        
        //Parse first the info, array
        let favoritesArrayParsed = JSON.parse(localStorage.getItem('FavoriteGifos'));    
            
        //Loop all to clean localStorage
       
       let returnIndexGif = favoritesArrayParsed.findIndex(e => e.gif == gif);
       
       if(returnIndexGif != -1) {
        containerFavorite.removeChild(containerFavorite.children[returnIndexGif]);
        favoritesArrayParsed.splice(returnIndexGif);  
         
        localStorage.setItem(
            'FavoriteGifos',
            JSON.stringify(favoritesArrayParsed)                
        );        
    
        if(favoritesArrayParsed == 0) {
            noFavoritesSection.classList.remove('hidden');
            favoritesSection.classList.add('hidden');
        }
        
        closeMaximizedGifo();      
       }
    
    }

 if (
        JSON.parse(localStorage.getItem("myGifoUrl")) === null ||
        JSON.parse(localStorage.getItem("myGifoUrl")) === undefined
      ) {
        localStorage.setItem("myGifoUrl", JSON.stringify([]));
      }
