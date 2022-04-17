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
        const origin = document.createElement('h3');
        const originText = `${photograph.city}, ${photograph.country}`;
        origin.textContent = originText;
        const tagLine = document.createElement('h4');
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
function filterFactory() {
    const customFilter = document.getElementsByClassName('filter-container');
    const customFilterLength = customFilter.length;

    for (i=0; i<customFilterLength; i++) {
        const selElmnt = customFilter[i].getElementsByTagName('select')[0];
        const selElmntLength = selElmnt.length;

        /* creation de l'input pour selected item */
        const selectedItem = document.createElement('input');
        selectedItem.setAttribute('class', 'selected-item');
        selectedItem.setAttribute('name', 'selected-item');
        selectedItem.setAttribute('role', 'button');
        selectedItem.setAttribute('aria-haspopup', 'listbox');
        selectedItem.setAttribute('aria-expanded', 'false');
        selectedItem.setAttribute('type', 'button');
        selectedItem.setAttribute('value', selElmnt.options[selElmnt.selectedIndex].innerHTML);
        selectedItem.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        customFilter[i].appendChild(selectedItem);

        /* creation d'une div contenant l'option-list */
        const optionList = document.createElement('div');
        optionList.setAttribute('class', 'option-list option-hide');
        optionList.setAttribute('role', 'listbox');
        optionList.setAttribute('aria-haspopup', 'listbox2');
        optionList.setAttribute('aria-expanded', 'true');
        optionList.setAttribute('tabindex', '0');
        
        /* pour chaque option du select creation d'une div option-item */
        for (j=0; j<selElmntLength; j++) {
            const optionItem = document.createElement('div');
            optionItem.setAttribute('href', '#');
            optionItem.setAttribute('role', 'listbox2');
            optionItem.setAttribute('tabindex', '0');
            optionItem.setAttribute('aria-labelledby', selElmnt.options[j].innerHTML)
            optionItem.innerHTML = selElmnt.options[j].innerHTML;
            optionItem.addEventListener('click', function(e) {
                
                /* qd item clické => update original select box et selected item */
                const sel = this.parentNode.parentNode.getElementsByTagName('select')[0];
                const selLength = sel.length;
                const prevNode = this.parentNode.previousSibling;
                for (i=0; i<selLength; i++) {
                    if (sel.options[i].innerHTML == this.innerHTML) {
                        sel.selectedIndex = i;
                        selectedItem.innerHTML = this.innerHTML;
                        selectedItem.setAttribute('value', this.innerHTML);
                        const selectedOption = this.parentNode.getElementsByClassName('same-as-selected');
                        const selectedOptionLength = selectedOption.length;
                        for (k=0; k<selectedOptionLength; k++) {
                            selectedOption[k].removeAttribute('class');
                            
                        }
                        this.setAttribute('class', 'same-as-selected');
                        
                        let filterChoice = selectedItem.value;
                        sortMedia(filterChoice);
                        break;
                    }
                    
                }
                prevNode.click();
            });
            optionList.appendChild(optionItem);
        }
        customFilter[i].appendChild(optionList);
        selectedItem.addEventListener('click', function(e) {
            /* qd input selectionné open/close option item */
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle('option-hide');
            this.classList.toggle('select-arrow-active');
        });
    }
    
    function closeAllSelect(elmnt) {
        /* ferme ttes les box sauf celle utilisée */
        const arrNo = [];
        const itemsList = document.getElementsByClassName('option-list');
        const selected = document.getElementsByClassName('selected-item');
        const itemsListLength = itemsList.length;
        const selectedLength = selected.length;
        for (i=0; i<selectedLength; i++) {
            if (elmnt == selected[i]) {
                arrNo.push(i);
            } else {
                selected[i].classList.remove('select-arrow-active');
            }
        }
        for (i=0; i<itemsListLength; i++) {
            if (arrNo.indexOf(i)) {
                itemsList[i].classList.add('option-hide')
            }
        }
    }
    
    /* si click en dehors de la box => close la box */
    document.addEventListener('click', closeAllSelect); 
    
    
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
            const pictInfo = document.createElement('section');
            pictInfo.setAttribute("class","info");
            const pictTitle = document.createElement('h2');
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
                film.setAttribute("id","video");
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

    if (e === 'Popularité'){
        const orderedMedia = photographMedia.sort(byLikes);
        displayPhotographGalerie(orderedMedia);
    } else if (e ==='Date'){
        const orderedMedia = photographMedia.sort(byDate);
        displayPhotographGalerie(orderedMedia);
    } else if (e ==='Titre'){
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
    filterFactory();
    displayPhotographGalerie();
}



displayData();


