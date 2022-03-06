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
        selectedItem.setAttribute('type','text');
        selectedItem.setAttribute('value', selElmnt.options[selElmnt.selectedIndex].innerHTML);
        selectedItem.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        customFilter[i].appendChild(selectedItem);
        
        /* pour chaque element creation d'une div contenant l'option-list */
        const optionList = document.createElement('div');
        optionList.setAttribute('class', 'option-list option-hide');

        /* pour chaque option du select creation d'une div option-item */
        for (j=0; j<selElmntLength; j++) {
            const optionItem = document.createElement('div');
            optionItem.innerHTML = selElmnt.options[j].innerHTML;
            optionItem.addEventListener('click', function(e) {
                
                /* qd item clické => update original select box et selected item */
                const sel = this.parentNode.parentNode.getElementsByTagName('select')[0];
                const selLength = sel.length;
                const prevNode = this.parentNode.previousSibling;
                for (i=0; i<selLength; i++) {
                    if (sel.options[i].innerHTML == this.innerHTML) {
                        sel.selectedIndex = i;
                        prevNode.innerHTML = this.innerHTML;
                        prevNode.setAttribute('value', this.innerHTML);
                        const selectedOption = this.parentNode.getElementsByClassName('same-as-selected');
                        const selectedOptionLength = selectedOption.length;
                        for (k=0; k<selectedOptionLength; k++) {
                            selectedOption[k].removeAttribute('class');
                        }
                        this.setAttribute('class', 'same-as-selected');
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


