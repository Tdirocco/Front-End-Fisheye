const searchParams = new URLSearchParams(document.location.search);

const idPhotographer = searchParams.get("id");



function fetchData(){
    return fetch("./data/photographers.json")
        .then(response => response.json())
        .then((allData) => {return allData});
}



async function getPhotographerInfo(){
    const allData = await fetchData();
    const allPhotographers = allData.photographers;
    const allMedia = allData.media;


    // recupère les infos correspondantes au photographe choisi
    let selectedPhotographerInfo = [];
    for (let i=0; i<allPhotographers.length; i++){
        if (allPhotographers[i].id === parseInt (idPhotographer)){
            selectedPhotographerInfo = allPhotographers[i];  
        }
    }

    // recupère les media du photographe choisi
    const selectedPhotographerMedia = [];
    for (let i=0; i<allMedia.length; i++){
        if (allMedia[i].photographerId === parseInt (idPhotographer)){
            selectedPhotographerMedia.push(allMedia[i]);
        }
    }
 
    const photographerName = document.getElementById("photographerName");
    photographerName.textContent = selectedPhotographerInfo.name;

    // creation de la fiche info photographe dans le header de la page photographe 
    function addInfo(){
        const article = document.createElement('article');
        const Nom = document.createElement('h1');
        Nom.textContent = selectedPhotographerInfo.name;
        const origin = document.createElement('h3');
        const originText = `${selectedPhotographerInfo.city}, ${selectedPhotographerInfo.country}`;
        origin.textContent = originText;
        const tagLine = document.createElement('h4');
        tagLine.textContent = selectedPhotographerInfo.tagline;
    
        article.append(Nom, origin, tagLine);
    
        return (article)
    }
    

    // creation de la photo d'Id dans le header de la page photographe
    const picture = `assets/photographers/${selectedPhotographerInfo.portrait}`;

    function addPicture(){
        const pictId = document.createElement('img');
        pictId.setAttribute("src", picture)

        return (pictId)
    }
    
    // affichage des info du photographe choisi
    function displayHeaderData(){
        const photographHeader = document.querySelector('.photograph-header');
        const photographCardDom = addInfo();
        const photographPicture = addPicture();
        photographHeader.append(photographPicture);
        photographHeader.insertBefore(photographCardDom,photographHeader.firstChild);
    }


    displayHeaderData();

}

getPhotographerInfo();




