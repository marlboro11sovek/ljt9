async function loadJobs() {
    try {
        const response = await fetch('http://localhost:3000/api/jobs');
        const jobs = await response.json();

        const jobsDiv = document.getElementById('jobs');
        jobsDiv.innerHTML = '';

        jobs.forEach(job => {
            const div = document.createElement('div');
            div.innerHTML = `
                <strong>ID: ${job.id}</strong> — ${job.part} (${job.machine})<br>
                Замовник: ${job.customer}, Оператор: ${job.operator}<br>
                Кількість: ${job.quantity}, Прогрес: ${job.progress}%<br>
                Плановий час: ${job.plannedTime} хв<br>
                Примітка: ${job.note && job.note.trim() !== '' ? job.note : '—'}<br>
                Зміна: ${job.shiftHours ? job.shiftHours + ' год' : '—'}<br>
                Статус: ${job.confirmed ? '✅ Підтверджено' : '⏳ Очікує підтвердження'}<br>
                <button onclick="confirmJob(${job.id})">Підтвердити</button>
                <button onclick="deleteJob(${job.id})">Видалити</button>
                <hr>
            `;
            jobsDiv.appendChild(div);
        });
    } catch (error) {
        console.error('Помилка завантаження робіт:', error);
    }
}

async function confirmJob(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/jobs/${id}/confirm`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert(`Робота з ID ${id} підтверджена ✅`);
        loadJobs();
    } catch (error) {
        alert(`Не вдалося підтвердити роботу: ${error}`);
    }
}

async function deleteJob(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/jobs/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert(`Робота з ID ${id} видалена ❌`);
        loadJobs();
    } catch (error) {
        alert(`Не вдалося видалити роботу: ${error}`);
    }
}

loadJobs();
