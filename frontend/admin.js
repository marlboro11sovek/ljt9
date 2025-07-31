async function loadParts() {
    try {
        const response = await fetch('http://localhost:3000/api/parts');
        const parts = await response.json();

        const partsDiv = document.getElementById('parts');
        partsDiv.innerHTML = '';

        parts.forEach(part => {
            const div = document.createElement('div');
            div.innerHTML = `
                <strong>${part.name}</strong> (${part.allowedMachines})<br>
                Опис: ${part.description || '-'}<br>
                Час на 1 деталь: ${part.timePerPiece} хв
                <hr>
            `;
            partsDiv.appendChild(div);
        });
    } catch (error) {
        console.error('Помилка завантаження деталей:', error);
    }
}

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
                Примітка: ${job.note || '-'}<br>
                Зміна: ${job.shiftHours || '-'} год<br>
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

async function loadDowntimes() {
    try {
        const response = await fetch('http://localhost:3000/api/downtime');
        const downtimes = await response.json();

        const downtimesDiv = document.getElementById('downtimes');
        downtimesDiv.innerHTML = '';

        downtimes.forEach(dt => {
            const div = document.createElement('div');
            div.innerHTML = `
                <strong>Простій для роботи ID: ${dt.jobId}</strong><br>
                Оператор: ${dt.operator}<br>
                Причина: ${dt.reason}<br>
                Тривалість: ${dt.duration} хв<br>
                Дата: ${dt.date}
                <hr>
            `;
            downtimesDiv.appendChild(div);
        });
    } catch (error) {
        console.error('Помилка завантаження простоїв:', error);
    }
}

document.getElementById('partForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const part = {
        name: document.getElementById('partName').value,
        description: document.getElementById('partDesc').value,
        allowedMachines: document.getElementById('allowedMachines').value,
        timePerPiece: document.getElementById('timePerPiece').value
    };

    await fetch('http://localhost:3000/api/parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(part)
    });

    loadParts();
    e.target.reset();
});

async function confirmJob(id) {
    try {
        await fetch(`http://localhost:3000/api/jobs/${id}/confirm`, {
            method: 'PUT'
        });
        alert(`Робота з ID ${id} підтверджена ✅`);
        loadJobs();
    } catch (error) {
        alert(`Не вдалося підтвердити роботу: ${error}`);
    }
}

async function deleteJob(id) {
    try {
        await fetch(`http://localhost:3000/api/jobs/${id}`, {
            method: 'DELETE'
        });
        alert(`Робота з ID ${id} видалена ❌`);
        loadJobs();
    } catch (error) {
        alert(`Не вдалося видалити роботу: ${error}`);
    }
}

// Initial load
loadParts();
loadJobs();
loadDowntimes();
