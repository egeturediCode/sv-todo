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
        const defInfo = subtasksContainer.querySelector('.def-info');
        const defInfoHTML = defInfo ? defInfo.outerHTML : '';

        let tasksHTML = '';
        let resultsHTML = defInfoHTML;

        data.forEach(task => {
            const item = `
                <div class="task-item">
                    <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h3>${task.title}</h3>
                            <small>Status: ${task.is_completed ? 'Completed' : 'To Do'}</small>
                        </div>
                        <button onclick="askAI(${task.id}, this)" style="background:var(--color2); color: #171717; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">
                            Analyze
                        </button>
                    </div>
                </div>
            `;
            const itemResult = `<div id="ai-result-${task.id}" class="ai-result"></div>`;

            tasksHTML += item;
            resultsHTML += itemResult;
        });

        container.innerHTML = tasksHTML;
        subtasksContainer.innerHTML = resultsHTML;
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

function askAI(taskId, btnElement) {
    const originalText = btnElement.innerText;
    btnElement.innerText = "Thinking...";
    btnElement.disabled = true;

    const taskItem = btnElement.closest('.task-item');
    const taskTitle = taskItem ? taskItem.querySelector('h3').innerText : '';

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
        const resultDiv = document.getElementById(`ai-result-${taskId}`);
        const defInfo = document.querySelector('#subtasks .def-info');
        
        if (!resultDiv) return;

        document.querySelectorAll('.ai-result').forEach(d => {
            if (d.id !== `ai-result-${taskId}`) d.innerHTML = '';
        });

        if (data.subtasks) {
            let html = "<ul class='ai-result-item'>";
            data.subtasks.forEach(sub => {
                html += `<li>${sub}</li>`;
            });
            html += "</ul>";

            resultDiv.innerHTML = html;
            if (defInfo) {
                defInfo.style.display = 'none';
            }
        } else {
            resultDiv.innerText = "There is not any suggestion.";
            if (defInfo) {
                defInfo.style.display = 'flex';
            }
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


function searchTasks() {
    const query = document.getElementById('search-box').value;
    const container = document.querySelector('#search-list');

    fetch(`/api/search/?query=${query}`)
    .then(response => response.json())
    .then(data => {
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p style="text-align:center;">No results found.</p>';
            return;
        }

        data.forEach(task => {
            const item = `
                <div class="task-item">
                    <div>
                        <h3>${task.title}</h3>
                        <small>Durum: ${task.is_completed ? 'Completed' : 'To Do'}</small>
                    </div>
                </div>
            `;
            container.innerHTML += item;
        });
    })
    .catch(error => console.error('Hata:', error));
}
