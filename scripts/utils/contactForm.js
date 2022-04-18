const form = document.getElementById("contactForm");
const btnSubmit=document.querySelector("#btnSubmit");

const Prenom = document.querySelector('#firstName');
const Nom = document.querySelector('#name');
const email = document.querySelector('#mail');
const message = document.querySelector('#message');

btnSubmit.addEventListener('click',sendModal)

form.addEventListener('input', function(e){
    console.log(e.target.value);
})

function displayModal() {

    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
    modal.setAttribute('aria-hidden', 'false');

    document.addEventListener('keyup', onKeyDown)

    const main = document.getElementById('main');
    main.setAttribute('aria-hidden','true');
    const firstName = document.getElementById('firstName');
    firstName.focus();
    
    
}

function closeModal() {
    
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');

    document.removeEventListener('keyup', onKeyDown);

    const main = document.getElementById('main');
    main.setAttribute('aria-hidden','false');


}

function sendModal(e) {
    e.preventDefault();
    const regData = {
        Prenom : Prenom.value,
        Nom : Nom.value,
        email : email.value,
        message : message.value
    }
    closeModal();
    console.log(regData);

    Prenom.value = '';
    Nom.value = '';
    email.value='';
    message.value='';  
    
}

function onKeyDown(e) {
    if (e.keyCode === 27 || e.key === 'Escape') {
        closeModal();
    } 
}
