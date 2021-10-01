let allTasks = [];
let valueInput = '';
let input = null;
let activeEditTask = null

window.onload = async function init() {
    input = document.getElementById('add-task')
    input.addEventListener('change', updateValue);
    const resp = await fetch('http://localhost:8000/allTasks', {
        method: 'GET'
    });
    let result = await resp.json();
    allTasks = result.data;
    render();
}

const onClickButton = async () => {
    const resp = await fetch('http://localhost:8000/createTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            text: valueInput,
            isCheck: false
        })
    });
    let result = await resp.json();
    console.log(result.data);
    allTasks = result.data;
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
        checkbox.onchange = () => onChangeCheckbox(index, item._id);
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
        }
        
        const imageDel = document.createElement('img'); // Delete
        imageDel.src = './img/cancel.svg';
        imageDel.id = 'imageDelete';
        container.appendChild(imageDel);
        imageDel.onclick = () => clickDel(item._id);

        const clickDel = async (value) => { // Функция Del
            console.log('Удалил');
            console.log('value', value)
            const resp = await fetch(`http://localhost:8000/deleteTask?_id=${value}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*'
                }
            });
            let result = await resp.json();
            console.log('result delete', result);
            allTasks = result.data;
            render();
        }

        const imageDone = document.createElement('img'); // Done
        imageDone.src = './img/check-mark.svg';
        imageDone.id = 'imageDone';
        imageDone.classList.add('hide');
        container.appendChild(imageDone);

        imageDone.onclick = () => clickDone(item._id, checkbox, text, imageEdit, imageDel, inputEdit, imageDone);

        content.appendChild(container);

        const btnRemove = document.getElementById('btnRemove');
        const head = document.getElementById('head');
        head.appendChild(btnRemove);

        btnRemove.onclick = () => onClickRemove();        
    });
};

const onClickRemove = async () => {
    const resp = await fetch(`http://localhost:8000/deleteAllTask`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
        },
    });
    console.log('удалил всё')
    allTasks = [];
    render();
}

const onChangeCheckbox = async (index, val) => {  // Функция состояния checkbox
    allTasks[index].isCheck = !allTasks[index].isCheck;
    const resp = await fetch(`http://localhost:8000/updateTask`, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            isCheck:  allTasks[index].isCheck,
            _id: val
        })
    });
    let result = await resp.json();
    allTasks = result.data;
    render();
}

const clickDone = async (val, checkbox, text, imageEdit, imageDel, inputEdit, imageDone) => { // Функция Done
    const resp = await fetch(`http://localhost:8000/updateTask`, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            text: inputEdit.value,
            _id: val
        })
    });
    let result = await resp.json();
    allTasks = result.data;
    checkbox.classList.toggle('hide');
    text.classList.toggle('hide');
    imageEdit.classList.toggle('hide');
    imageDel.classList.toggle('hide');
    inputEdit.classList.toggle('hide');
    imageDone.classList.toggle('hide');
    render()
}