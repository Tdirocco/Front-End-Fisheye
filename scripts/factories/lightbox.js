class lightbox {
    static async init () {
        const selectedPhotographInfo = await getPhotographerInfo();
        const photographMedia = selectedPhotographInfo.photographMedia;
        const links = Array.from(document.querySelectorAll('a[href$=".jpg"], a[href$=".mp4"]'));
        const gallery = links.map(link => link.getAttribute('href'));
        links.forEach(link => link.addEventListener('click', e =>
            {
                e.preventDefault();
                const parent = e.target.parentElement.parentElement;
                const titre = parent.children[1].children[0].innerText;

                new lightbox(e.currentTarget.getAttribute('href'), titre, gallery);
            }))
    }


    /*
        @param {string} url = URL du media
        @param {string[]} media => chemins des media de la lightbox 
    */
    constructor (url, titre, media){
        this.element = this.buildDom(url);
        this.titre = titre;
        this.media = media;
        this.mediaFactory(url);
        this.oneKeyUp = this.oneKeyUp.bind(this);
        document.body.appendChild(this.element);
        document.addEventListener('keyup', this.oneKeyUp.bind(this));
    }
  
    async mediaFactory(url){
        const selectedPhotographInfo = await getPhotographerInfo();
        const photographMedia = selectedPhotographInfo.photographMedia;

        const lien = url;
        const objMedia = photographMedia.find(media => {
            const adressLien = lien.split('/');
            const l = adressLien[adressLien.length-1];
            if (media.image){
                return media.image == l
            } else {
                return media.video == l
            }                
        })

        if(url.endsWith('.jpg')){
            this.loadImage(url, objMedia)
        } else if(url.endsWith('.mp4')){
            this.loadPlayer(url, objMedia)
        }
    }

    loadImage(url, objMedia) {
        
        this.url = null;
        const image = new Image();
        image.alt = objMedia.title;
        const container = this.element.querySelector('.lightbox__container');
        const loader = document.createElement('div');
        const title = document.createElement('h2');
        title.innerHTML = objMedia.title;
        loader.classList.add('lightbox__loader');
        container.innerHTML = '';
        container.appendChild(loader);
        image.onload = () => {
            container.removeChild(loader);
            container.append(image, title);
            this.url = url;
        }
        image.src = url;
    }

    loadPlayer(url, objMedia) {
        this.url = null;
        const player = document.createElement('div');
        player.setAttribute('class', 'player');
        const video = document.createElement('video');
        video.setAttribute('type', 'video/mp4');
        video.setAttribute ('alt',objMedia.title);
        video.addEventListener('ended', stopMedia);
        const titre = document.createElement('h2');
        titre.innerHTML = objMedia.title;

        const controls = document.createElement('div');
        controls.setAttribute('class', 'controls');

        const playBtn = document.createElement('button');
        playBtn.classList.add('play');
        playBtn.setAttribute('data-icon','P');
        playBtn.setAttribute('aria-label', 'bascule lecture pause');

        const stopBtn = document.createElement('button');
        stopBtn.classList.add('stop');
        stopBtn.setAttribute('data-icon', 'S');
        stopBtn.setAttribute('aria-label', 'stop');

        const timer = document.createElement('div');
        timer.setAttribute('class', 'timer');
        const timerBar = document.createElement('div');
        timerBar.setAttribute('class', 'timer-bar');
        const counter = document.createElement('span');
        counter.setAttribute('aria-label', 'timer');
        timer.append(timerBar, counter);

        const rwdBtn = document.createElement('button');
        rwdBtn.classList.add('rwd');
        rwdBtn.setAttribute('data-icon', 'B');
        rwdBtn.setAttribute('aria-label', 'arrière rapide');

        const fwdBtn = document.createElement('button');
        fwdBtn.classList.add('fwd');
        fwdBtn.setAttribute('data-icon', 'F');
        fwdBtn.setAttribute('aria-label', 'avance rapide');

        controls.append(playBtn, stopBtn, timer, rwdBtn, fwdBtn);

        playBtn.addEventListener('click', playPauseMedia);
        stopBtn.addEventListener('click', stopMedia);
        rwdBtn.addEventListener('click', mediaBackward);
        fwdBtn.addEventListener('click', mediaForward);


        const container = this.element.querySelector('.lightbox__container');
        const loader = document.createElement('div');
        loader.classList.add('lightbox__loader');
        container.innerHTML = '';
        player.append(video, controls);
        container.appendChild(loader);
        video.onloadstart = () => {
            container.removeChild(loader);
            container.append(player, titre);
            this.url = url;
        }
        video.src = url;


        window.addEventListener('keyup', playerRemote);

        function playerRemote (e) {
            if (e.keyCode === 32 || e.key === ' ') {
                playPauseMedia();
            } else if (e.key === 's') {
                stopMedia();
            }
        }

        function playPauseMedia() {
            if(video.paused) {
                playBtn.setAttribute('class', 'pause');
                playBtn.setAttribute('data-icon', 'u');
                video.play();
            } else {
                playBtn.setAttribute('class', 'play');
                playBtn.setAttribute('data-icon', 'P');
                video.pause();
            }
        }

        function stopMedia() {
            video.pause();
            video.currentTime = 0;
            playBtn.setAttribute('data-icon', 'P');
        }

        let intervalFwd;
        let intervalRwd;

        function mediaBackward() {
            clearInterval(intervalFwd);
            fwdBtn.classList.remove('active');

            if(rwdBtn.classList.contains('active')) {
                rwdBtn.classList.remove('active');
                clearInterval(intervalRwd);
                video.play();
            } else {
                rwdBtn.classList.add('active');
                video.pause();
                intervalRwd = setInterval(windBackward, 500);
            }
        }

        function mediaForward() {
            clearInterval(intervalRwd);
            rwdBtn.classList.remove('active');

            if(fwdBtn.classList.contains('active')) {
                fwdBtn.classList.remove('active');
                clearInterval(intervalFwd);
                video.play();
            } else {
                fwdBtn.classList.add('active');
                video.pause();
                intervalFwd = setInterval(windForward, 500);
            }
        }

        function windBackward() {
            if(video.currentTime <= 1) {
                rwdBtn.classList.remove('active');
                clearInterval(intervalRwd);
                stopMedia();
            } else {
                video.currentTime -= 1;
            }
        }

        function windForward() {
            if(video.currentTime >= video.duration -1) {
                fwdBtn.classList.remove('active');
                clearInterval(intervalFwd);
                stopMedia();
            } else {
                video.currentTime += 1;
            }
        }

        video.addEventListener('timeupdate', setTime);

        function setTime() {
            let minutes = Math.floor(video.currentTime / 60);
            let seconds = Math.floor(video.currentTime - minutes * 60);
            let minuteValue;
            let secondValue;
            
            if(minutes < 10) {
                minuteValue = '0' + minutes;
            } else {
                minuteValue = minutes;
            }

            if (seconds < 10) {
                secondValue = '0' + seconds;
            } else {
                secondValue = seconds;
            }

            let mediaTime = minuteValue + ':' + secondValue;
            counter.textContent = mediaTime;

            let barlength = timer.clientWidth * (video.currentTime/video.duration);
            timerBar.style.width = barlength + 'px';
        }

        rwdBtn.classList.remove('active');
        fwdBtn.classList.remove('active');
        clearInterval(intervalRwd);
        clearInterval(intervalFwd);


    }


    oneKeyUp (e) {
        if (e.key === 'Escape') {
            this.close(e);
        } else if (e.key === 'ArrowLeft') {
            this.prev(e);
        } else if (e.key === 'ArrowRight') {
            this.next(e);
        }
    }

    close(e) {
        e.preventDefault();
        this.element.classList.add('fadeOut');
        window.setTimeout(() => {
            this.element.parentElement.removeChild(this.element);
        }, 500);
        document.removeEventListener('keyup', this.oneKeyUp);
    }

    next(e) {
        e.preventDefault();
        let i = this.media.findIndex(image => image === this.url);
        if (i === this.media.length -1){
            i = -1;
        }
        this.mediaFactory(this.media[i+1]);
    }

    prev(e) {
        e.preventDefault();
        let i= this.media.findIndex(image => image === this.url);
        if (i === 0) {
            i = this.media.length;
        }
        this.mediaFactory(this.media[i-1]);
    }

  
    /*
        @param {string url = URL de l'image}
        @ return {HTMLElement}
    */
    buildDom (url){
        const dom = document.createElement('div');
        dom.setAttribute('class', 'lightbox');
        dom.innerHTML = `<button class="lightbox__close">Fermer</button>
        <button class="lightbox__next">Suivant</button>
        <button class="lightbox__prev">Précédent</button>
        <div class="lightbox__container"></div>`;
        dom.querySelector('.lightbox__close').addEventListener('click', this.close.bind(this));
        dom.querySelector('.lightbox__next').addEventListener('click', this.next.bind(this));
        dom.querySelector('.lightbox__prev').addEventListener('click', this.prev.bind(this));
        return dom
    }


}

/*
const lien = e.currentTarget.getAttribute('href');
                const title = photographMedia.find(media => {
                    const adressLien = lien.split('/');
                    const l = adressLien[adressLien.length-1];
                    if (media.image){
                        return media.image == l
                    } else {
                        return media.video == l
                    }                
                })
*/