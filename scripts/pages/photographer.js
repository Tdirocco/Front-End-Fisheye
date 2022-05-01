const searchParams = new URLSearchParams(document.location.search);
const idPhotographer = searchParams.get('id');

function fetchData(){
    return fetch('./data/photographers.json')
        .then(response => response.json())
        .then((allData) => {return allData});
}

/* récupère infos & media du photographe sélectionné */
async function getPhotographerInfo() {
    const allData = await fetchData();
    const allPhotographers = allData.photographers;
    const allMedia = allData.media;

    // récupère les infos correspondantes au photographe choisi
    let photograph = [];
    for (let i=0; i<allPhotographers.length; i++){
        if (allPhotographers[i].id === parseInt (idPhotographer)){
            photograph = allPhotographers[i];  
        }
    }
 
    // récupère les media du photographe
    let photographMedia = [];
    for (let i=0; i<allMedia.length; i++) {
        if (allMedia[i].photographerId === parseInt (idPhotographer)) {
            photographMedia.push(allMedia[i]);
        }
    }
 
    const selectedPhotographInfo = [];
    selectedPhotographInfo.photograph = photograph;
    selectedPhotographInfo.photographMedia = photographMedia;
 
     
    return (selectedPhotographInfo)
}

/* Mise en place du Header */
async function displayPhotographHeader() {
    const selectedPhotographInfo = await getPhotographerInfo();
    const photograph = selectedPhotographInfo.photograph;

    const photographName = document.getElementById("photographerName");
    photographName.textContent = photograph.name;

    function addInfo(){
    
        const article = document.createElement('article');
        const Nom = document.createElement('h1');
        Nom.textContent = photograph.name;
        const origin = document.createElement('h2');
        const originText = `${photograph.city}, ${photograph.country}`;
        origin.textContent = originText;
        const tagLine = document.createElement('h3');
        tagLine.textContent = photograph.tagline;
    
        article.append(Nom, origin, tagLine);
    
        return (article)
    }
    
    const picture = `assets/photographers/${photograph.portrait}`;
    function addPicture(){
        const pictId = document.createElement('div');
        pictId.setAttribute('class', 'pict-id');
        const pictFond = document.createElement('img');
        pictFond.setAttribute("src", picture);
        pictFond.setAttribute('alt', photograph.name);
        pictFond.classList.add('pict-fond');
        const pictTop = document.createElement('img');
        pictTop.setAttribute("src", picture);
        pictTop.setAttribute('alt',photograph.name);
        pictTop.classList.add('pict-top');

        pictId.append(pictFond, pictTop);

        return (pictId)
    }


    const photographHeader = document.querySelector('.photograph-header');
    const photographCardDom = addInfo();
    const photographPicture = addPicture();
    photographHeader.append(photographPicture);
    photographHeader.insertBefore(photographCardDom,photographHeader.firstChild);
}

/* Mise en place du filter */

    const enterKey = 13;
    const rightArr = 39;
    const downArr = 40;
    const upArr = 38;
    const escKey = 27;

    const list = document.querySelector('.dropdown__list');
    const listContainer = document.querySelector('.dropdown__list-container');
    const listItems = document.querySelectorAll('.dropdown__list-item');
    const dropdownSelectedNode = document.querySelector('#dropdown__selected');
    const listItemIds = [];

    dropdownSelectedNode.addEventListener('click', e => toggleListVisibility(e));
    dropdownSelectedNode.addEventListener('keydown', e => toggleListVisibility(e));

    listItems.forEach(item => listItemIds.push(item.id));
    listItems.forEach(item => {
        item.addEventListener('click', e => {
            setSelectedListItem(e);
            closeList();
        });

        item.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case enterKey:
                    setSelectedListItem(e);
                    closeList();
                    return;
                    
                case downArr:
                    focusNextItem(downArr);
                    return;
                
                case upArr:
                    focusNextItem(upArr);
                    return;

                case escKey:
                    closeList();
                    return;

                default:
                    return;
            }
        });
    });

    function setSelectedListItem(e) {
        let selectedTextToAppend = document.createTextNode(e.target.innerText);
        dropdownSelectedNode.innerHTML = null;
        dropdownSelectedNode.appendChild(selectedTextToAppend);
        sortMedia(e.target.innerText);
    }

    function closeList() {
        list.classList.remove('open');
        //list.classList.add('expanded', 'false');
        listContainer.setAttribute('aria-expanded', false);
    }

    function toggleListVisibility(e) {
        let openDropDown = e.keyCode === rightArr || e.keyCode === enterKey;
        if (e.keyCode === escKey) {
            closeList();
        }

        if (e.type === 'click' || openDropDown) {
            list.classList.toggle('open');
            //dropdownArrow.classList.toggle('expanded');
            listContainer.setAttribute('aria-expanded', list.classList.contains('open'));
        }

        if (e.keyCode === downArr) {
            focusNextItem(downArr);
        }
        
        if (e.keyCode === upArr) {
            focusNextItem(upArr);
        }
    }

    function focusNextItem(direction) {
        const activeElementId = document.activeElement.id;
        if (activeElementId === 'dropdown__selected') {
            document.querySelector(`#${listItemIds[0]}`).focus();
        } else {
            const currentActiveElementIndex = listItemIds.indexOf(activeElementId);
            if (direction === downArr) {
                const currentActiveElementIsNotLastItem = currentActiveElementIndex < listItemIds.length -1;
                if (currentActiveElementIsNotLastItem) {
                    const nextListItemId = listItemIds[currentActiveElementIndex +1];
                    document.querySelector(`#${nextListItemId}`).focus();
                }
            } else if (direction === upArr) {
                const currentActiveElementIsNotFirstItem = currentActiveElementIndex > 0;
                if (currentActiveElementIsNotFirstItem) {
                    const nextListItemId = listItemIds[currentActiveElementIndex -1];
                    document.querySelector(`#${nextListItemId}`).focus();
                }
            }
        }
    }



/* Mise en place de la Galerie */
async function displayPhotographGalerie(data) {
    const selectedPhotographInfo = await getPhotographerInfo();
    const photograph = selectedPhotographInfo.photograph;
    const photographMedia = selectedPhotographInfo.photographMedia;
    
    if (data == undefined){
        data = photographMedia;
    }

    const mediaSection = document.querySelector('.media_section');
    
    mediaSection.innerHTML = '';
    displayTotalLikes(photographMedia, photograph);
    data.forEach((media)=>{
        const mediaModel = mediaFactory(media);
        const mediaCardDOM = mediaModel.getMediaCardDOM();
        mediaSection.appendChild(mediaCardDOM);
    })

    function mediaFactory(elmnt){
        let {title, image, video, likes} = elmnt;
    
        const separate = photograph.name.split(" ");
        const firstName = separate[0].split("-").join(" ");
    
        const picture = `assets/Media/${firstName}/${image}`;
        const movies = `assets/Media/${firstName}/${video}`;
        const heart = "assets/icons/heartPict.svg";
        const heartSelect = "assets/icons/heartPictSelect.svg";
        
    
        function getMediaCardDOM(){
            const article = document.createElement('article');

            const lien = document.createElement('a');
            lien.setAttribute("class", "container");
            lien.setAttribute('alt', title);
            const pictInfo = document.createElement('section');
            pictInfo.setAttribute("class","info");
            const pictTitle = document.createElement('h4');
            pictTitle.textContent = title;
            const rates = document.createElement('div');
            rates.setAttribute("class","rates");
            const nbreLikes = document.createElement('div');
            nbreLikes.setAttribute("class","likes");
            nbreLikes.textContent = likes;
            const heartIcons = document.createElement('a');
            heartIcons.setAttribute('class', 'heart__icons');
            heartIcons.setAttribute('href', '#');
            const heartPict = document.createElement('img');
            heartPict.setAttribute("src", heart);
            heartPict.setAttribute('alt', 'likes');
            heartPict.classList.add('heart');
            const heartPictSelect = document.createElement('img');
            heartPictSelect.setAttribute('alt','likes');
            heartPictSelect.setAttribute("src", heartSelect);
            heartPictSelect.classList.add('heart__selected');
            heartIcons.append(heartPict, heartPictSelect);
            
            heartIcons.addEventListener('click', addLike);
            
            

            function addLike (e) {
                e.preventDefault();
                const totalLikes = document.querySelector('#totalLikes');
                heartPictSelect.classList.toggle('visible');
                if (heartPictSelect.classList.contains('visible')){
                    nbreLikes.textContent = likes+1;
                    totalLikes.textContent = parseInt(totalLikes.textContent)+1;
                } else {
                    nbreLikes.textContent = likes;
                    totalLikes.textContent = parseInt(totalLikes.textContent)-1;
                }
            }
            



            if(image !== undefined){
                lien.setAttribute("href", picture);
                const img = document.createElement('img');
                img.setAttribute("src", picture);
                img.setAttribute('alt',title);
                lien.append(img);
            } else {
                lien.setAttribute("href", movies);
                const film = document.createElement('video');
                film.setAttribute("src", movies);
                film.setAttribute('alt',title);
                film.setAttribute("id","video");
                //lien.innerText = title;
                lien.appendChild(film);
                film.addEventListener('mouseover', function (){
                    this.play();
                });
                film.addEventListener('mouseout', function (){
                    this.pause();
                    this.currentTime = 0;
                })
            };            

            article.append(lien, pictInfo);

            pictInfo.append(pictTitle, rates);

            rates.append(nbreLikes, heartIcons);

            return (article);
        }
    
    return {title, picture, getMediaCardDOM }
    }

    lightbox.init()

}

/* Mise en place info total likes & tarif */
function displayTotalLikes(photographMedia, photograph) {
   /* const selectedPhotographInfo = await getPhotographerInfo();
    const photograph = selectedPhotographInfo.photograph;
    const photographMedia = selectedPhotographInfo.photographMedia;*/
    


    function addTarif() {
        const price = document.querySelector('.tarif');
        price.textContent = `${photograph.price}€/jour`;
    }
   
    function addTotalLikes(){
        const LikesArr = [];
        for(i=0; i<photographMedia.length; i++){
            let likes = photographMedia[i].likes;
            LikesArr.push(likes);
        }

        const sumLikes = LikesArr.reduce(
            (prevValue, curValue) => prevValue + curValue, 0
        );
        

        const sumLike = document.querySelector('#totalLikes');
        sumLike.textContent = sumLikes;
    }

    addTarif();
    addTotalLikes();    
    
}

/* Filtrage des données */
async function sortMedia(e) {
    const selectedPhotographInfo = await getPhotographerInfo();
    const photographMedia = selectedPhotographInfo.photographMedia;

    if (e === 'Popularité') {
        const orderedMedia = photographMedia.sort(byLikes);
        displayPhotographGalerie(orderedMedia);
    } else if (e === 'Date') {
        const orderedMedia = photographMedia.sort(byDate);
        displayPhotographGalerie(orderedMedia);
    } else if (e === 'Titre') {
        const orderedMedia = photographMedia.sort(byTitle);
        displayPhotographGalerie(orderedMedia);
    } else {
        const orderedMedia = photographMedia;
        displayPhotographGalerie(orderedMedia);
    }



    function byLikes(a,b){
        return b.likes - a.likes;
    }
    
    
    function byTitle(a,b){
       if (a.title > b.title){
           return 1;
       } else if (a.title < b.title){
           return -1;
       }
       return 0;
    }
    
    function byDate(a,b){
        if (a.date < b.date){
            return 1;
        } else if (a.date > b.date){
            return -1;
        }
        return 0;
    }
    
         
     
}


/* Affichage des Data */
function displayData() {
    displayPhotographHeader();
    displayPhotographGalerie();
}



displayData();


