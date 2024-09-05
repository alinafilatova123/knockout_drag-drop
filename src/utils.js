function defineDraggedEl(e) {
    if (e.target.closest('.document')) {
        return {draggedEl: e.target.closest('.document'), type: 'document'}
    } else return {draggedEl: e.target.closest('.category'), type: 'category'} 
};

function resetDraggedEl(draggedEl) {
    if (draggedEl) {
        draggedEl.style.position = null;
        draggedEl.classList.remove('dragged');
    }
};

function getAppendPosition(anchorElement, isDocument) {
    if (!isDocument) {
        return anchorElement.querySelector('.category__block')
        .classList.contains('border-bottom')
        ? 'after'
        : 'before';
    } else {
        return anchorElement.classList.contains('border-bottom') ? 'after' : 'before';
    }
};

function toggleDrop(e) {
    const block = e.target.closest('.category__block');

    const documents = block.nextElementSibling;
    const arrow = block.querySelector('.category__arrow');

    if (documents.style.maxHeight) {
        documents.style.maxHeight = null;
        arrow.classList.remove('category__arrow_active');
    } else {
        documents.style.maxHeight = documents.scrollHeight + 'px';
        arrow.classList.add('category__arrow_active');
    }
};

function appendElement(insertedEl, anchorElement, insertMethod) {
    const isDocument = anchorElement.id.includes('document');

    anchorElement[insertMethod](insertedEl);

    if (isDocument) {
        const body = anchorElement.closest('.documents');
        setTimeout(() => {
        body.style.maxHeight = body.scrollHeight + 'px';
        });
    } else {
        setTimeout(() => (insertedEl.style.maxHeight = '100%'), 500);
    }
};

export {
    defineDraggedEl, 
    resetDraggedEl,
    getAppendPosition,
    toggleDrop,
    appendElement,
};