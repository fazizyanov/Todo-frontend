let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;

window.onload = function init() {
    input = document.getElementById('add-task')
    input.addEventListener('change', updateValue);
    render();
}

const onClickButton = () => {
    allTasks.push({
        text: valueInput,
        isCheck: false
    });
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    valueInput = '';
    input.value = '';
    render();
}


const updateValue = (e) => {
    valueInput = e.target.value;
}

const render = () => {
    const content = document.getElementById('content-page');
    while(content.firstChild) {
        content.removeChild(content.firstChild);
    }
    allTasks.map((item, index) => {
        const container = document.createElement('div'); // создаю блок
        container.id = `task - ${index}`;
        container.className = 'task-container';

        const checkbox = document.createElement('input');
        checkbox.id = 'checkBoxId';
        checkbox.type = 'checkbox';
        checkbox.checked = item.isCheck;
        checkbox.onchange = () => onChangeCheckbox(index);
        container.appendChild(checkbox);

        const text = document.createElement('p'); // создаю параграф для текста
        text.id = 'textId';
        text.innerText = item.text;
        text.className = item.isCheck ? 'text-tasks done-text' : 'text-tasks';
        container.appendChild(text);

        const imageEdit = document.createElement('img');// Edit
        imageEdit.id = 'imageEdit';
        imageEdit.src = './img/edit-list.svg';
        container.appendChild(imageEdit);

        const inputEdit = document.createElement('input'); // новый инпут для исправления
        inputEdit.type = 'text';
        inputEdit.id = 'inputEdit';
        inputEdit.classList.add('hide');
        container.appendChild(inputEdit);

        imageEdit.onclick = () => clickEdit(index);

        const clickEdit = (index) => { // Функция Edit
            inputEdit.value = allTasks[index].text;
            checkbox.classList.toggle('hide');
            text.classList.toggle('hide');
            imageEdit.classList.toggle('hide');
            imageDel.classList.toggle('hide');
            inputEdit.classList.toggle('hide');
            imageDone.classList.toggle('hide');
            localStorage.setItem('tasks', JSON.stringify(allTasks));
        }
        
        const imageDel = document.createElement('img'); // Delete
        imageDel.src = './img/cancel.svg';
        imageDel.id = 'imageDelete';
        container.appendChild(imageDel);
        imageDel.onclick = () => clickDel(index);

        const clickDel = (value) => { // Функция Del
            allTasks = allTasks.filter((item, index) => index !== value)
            console.log('Удалил');
            localStorage.setItem('tasks', JSON.stringify(allTasks));
            render();
        }

        const imageDone = document.createElement('img'); // Done
        imageDone.src = './img/check-mark.svg';
        imageDone.id = 'imageDone';
        imageDone.classList.add('hide');
        container.appendChild(imageDone);

        imageDone.onclick = () => clickDone(index);
        const clickDone = (index) => { // Функция Done
            console.log(allTasks[index].text, inputEdit.value)
            allTasks[index].text = inputEdit.value;
            checkbox.classList.toggle('hide');
            text.classList.toggle('hide');
            imageEdit.classList.toggle('hide');
            imageDel.classList.toggle('hide');
            inputEdit.classList.toggle('hide');
            imageDone.classList.toggle('hide');
            localStorage.setItem('tasks', JSON.stringify(allTasks));
            render()
        }
        content.appendChild(container);

        const btnRemove = document.getElementById('btnRemove');
        const head = document.getElementById('head');
        head.appendChild(btnRemove);

        btnRemove.onclick = () => onClickRemove(content, container);        
    });
};

const onClickRemove = (valueContent) => {
    console.log('удалил всё')
    let body = document.getElementById('body');
    body.removeChild(valueContent)
    localStorage.removeItem('tasks'); 
    render()           
}

const onChangeCheckbox = (index) => {  // Функция состояния checkbox
    allTasks[index].isCheck = !allTasks[index].isCheck;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
}