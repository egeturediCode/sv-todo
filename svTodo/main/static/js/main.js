function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener('DOMContentLoaded', function() {
    getTasks();
});



function getTasks() {

    fetch('/api/todos/') 
    .then(response => response.json()) 
    .then(data => {
        const container = document.querySelector('#task-list');
        container.innerHTML = '';

        data.forEach(task => {
            const item = `
                <div class="task-item">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <small>Durum: ${task.is_completed ? 'Tamamlandı' : 'Yapılacak'}</small>
                </div>
            `;
            container.innerHTML += item;
        });
    })
    .catch(error => console.error('Hata:', error));
}

function createTask() {
    const titleInput = document.getElementById('task-title');
    const titleValue = titleInput.value;

    if (!titleValue) {
        alert("Boş görev ekleyemezsin!");
        return;
    }

    fetch('/api/todos/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') 
        },
        body: JSON.stringify({
            title: titleValue,
            description: "Frontend'den eklendi" 
        })
    })
    .then(response => {
        if (response.ok) {
            titleInput.value = '';
            getTasks();
        } else {
            alert("Bir hata oluştu!");
        }
    });
}