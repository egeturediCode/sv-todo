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
        const subtasksContainer = document.querySelector('#subtasks');
        container.innerHTML = '';
        subtasksContainer.innerHTML = '';

        data.forEach(task => {
            const item = `
                <div class="task-item">
                    <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h3>${task.title}</h3>
                            <small>Durum: ${task.is_completed ? 'Tamamlandı' : 'Yapılacak'}</small>
                        </div>
                        <button onclick="askAI('${task.title}', this)" style="background:var(--color2); color: #171717; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">
                            Analyze
                        </button>
                    </div>
                </div>
            `;
            const itemResult = `
                <div id="ai-result-${task.id}" class="ai-result"></div>
            `;
            container.innerHTML += item;
            subtasksContainer.innerHTML += itemResult;
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

function askAI(taskTitle, btnElement) {
    const originalText = btnElement.innerText;
    btnElement.innerText = "Thinking...";
    btnElement.disabled = true;

    fetch('/api/ai-analyze/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ task_title: taskTitle })
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.querySelector('div[id^="ai-result-"]');
        
        if (data.subtasks) {
            let html = "<ul class='ai-result-item'>";
            data.subtasks.forEach(sub => {
                html += `<li>${sub}</li>`;
            });
            html += "</ul>";
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerText = "There is not any suggestion.";
        }
    })
    .catch(err => {
        alert("AI Hatası: " + err);
    })
    .finally(() => {
        btnElement.innerText = originalText;
        btnElement.disabled = false;
    });
}