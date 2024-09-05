import {
    defineDraggedEl, 
    resetDraggedEl,
    getAppendPosition,
    toggleDrop,
    appendElement,
} from './src/utils.js';

let categoryId = 1, documentId = 1;

function ListItem(tittle, docs) {
    const self = this;
    self.tittle = ko.observable(tittle);
    self.docs = ko.observableArray(
        docs.map((doc) => {
        return {
            tittle: doc,
            sub_id: 'document-' + documentId++,
        };
        })
    );
    self.id = categoryId++;
};

function ItemsModel() {
    const self = this;
  
    self.categories = ko.observableArray([
      new ListItem('Обязательные для всех', ['Паспорт', 'ИНН']),
      new ListItem('Обязательные для трудоустройства', ['Трудовой договор', 'Обязательный Документ']),
      new ListItem('Специальные', [
            'Обнародуй нам отец', 
            'Что такое есть Потец', 
            'Вы не путайте сыны',
            'День конца и дочь весны.',
            'Страшен, синь и сед Потец.',
            'Я ваш ангел. Я отец.',
            'Я его жестокость знаю,',
            'Смерть моя уже близка.',
            'На главе моей зияют',
            'Плеши, лысины — тоска.',
            'И если жизнь протянется',
            'То скоро не останется',
            'Ни сокола ни волоска.',
            'Знать смерть близка.',
            'Знать глядь тоска.',
        ]),
    ]);
};

ko.applyBindings(new ItemsModel());

//---------------------------------------------------//

const categories = document.querySelector('.categories');
let anchorElement = null, placeholderElement = null, x = 0, y = 0;

// dragstart
function handleDragStart(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
  
    if (!e.target.classList.contains('drag')) return;

    const {draggedEl, type} = defineDraggedEl(e);

    // Добавление плейсхолдера на место перетаскиваемого элемента
    addPlaceholder(draggedEl);

    x = e.clientX - draggedEl.offsetLeft;
    y = e.clientY - draggedEl.offsetTop;

    placementDraggedEl(e, draggedEl);

    // Скрытие документов при перетаскивании категории
    if (type === 'category') draggedEl.querySelector('.documents').classList.add('hide');
    
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    draggedEl.classList.add('dragged');
    draggedEl.style.position = 'absolute';
    categories.style.cursor = 'drag';
    return true;
}

// dragmove
function handleDragMove(e) {
    e.preventDefault();
  
    const draggedEl = document.querySelector('.dragged');
    placementDraggedEl(e, draggedEl);
    showBorder(e, draggedEl, anchorElement);
}

// dragend
function handleDragEnd(e) {
    if (e) e.preventDefault();
    const draggedEl = document.querySelector('.dragged');

    // Не перетаскиваем элемент при клике
    if(!anchorElement) {
        let docs = draggedEl && draggedEl.querySelector('.documents');
        docs && docs.classList.remove('hide');
        resetDraggedEl(draggedEl)
        document.removeEventListener('mousemove', handleDragMove);
        removePlaceholder();
        return;
    }

    const isDocument = anchorElement.id.includes('document');

    if (!isDocument) {
        draggedEl.style.maxHeight = draggedEl.scrollHeight + 'px';
    }

    if (draggedEl.className.split(' ')[0] === 'category') {
        draggedEl.querySelector('.documents').classList.remove('hide');
    }

    let apendMethod = getAppendPosition(anchorElement, isDocument);

    removePlaceholder();
    appendElement(draggedEl, anchorElement, apendMethod);

    anchorElement = null;
    hideBorder();
    resetDraggedEl(draggedEl);

    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
}

function addPlaceholder(draggedEl) {
    placeholderElement = draggedEl.cloneNode(true);
    placeholderElement.classList.add('placeholder');

    const prevSibling = draggedEl.previousElementSibling;
    setTimeout(() => {
        if (prevSibling) {
            prevSibling.after(placeholderElement);
        } else {
            draggedEl.parentElement.prepend(placeholderElement);
        }
    });
};

function removePlaceholder() {
    placeholderElement.style.height = 0;
    placeholderElement.remove();
};

function showBorder(e, draggedEl) {
    const x = e.clientX;
    const y = e.clientY;

    const isDocument = draggedEl.classList.contains('document');
    const elementsUnderCursor = document.elementsFromPoint(x, y);

    const borderEl = elementsUnderCursor.filter((e) => e.classList.contains(isDocument ? 'document' : 'category__block')).pop();
    
    anchorElement = isDocument ? borderEl : borderEl.parentElement;

    if (!anchorElement || !anchorElement.id || draggedEl.id === anchorElement.id) return;

    const top = anchorElement.getBoundingClientRect().top;
    const bottom = anchorElement.getBoundingClientRect().bottom;

    hideBorder();

    borderEl.classList.add('border');
    if (e.clientY < (top + bottom) / 2) {
        borderEl.classList.add('b-top');
        borderEl.classList.remove('b-bottom');
    } else {
        borderEl.classList.add('b-bottom');
        borderEl.classList.remove('b-top');
    }
};

function hideBorder() {
    document
        .querySelectorAll('.b-top')
        .forEach((e) => e.classList.remove('b-top'));
    document
        .querySelectorAll('.b-bottom')
        .forEach((e) => e.classList.remove('b-bottom'));
    document.querySelector('.border')?.classList.remove('border');
};

function placementDraggedEl(e, draggedEl) {
    draggedEl.style.top = (e.clientY - y).toString() + 'px';
    draggedEl.style.left = (e.clientX - x).toString() + 'px';
};

const arrowBtns = document.querySelectorAll('.category__arrow');
arrowBtns.forEach(btn => btn.addEventListener('click', toggleDrop));
const dragBtns = document.querySelectorAll('.drag');
dragBtns.forEach(btn => btn.addEventListener('mousedown', handleDragStart));