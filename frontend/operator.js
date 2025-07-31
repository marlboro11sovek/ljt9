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
                Зміна: ${job.shiftHours ? job.shiftHours + ' год' : '—'}<br>
                Примітка: ${job.note && job.note.trim() !== '' ? job.note : '—'}<br>
                Статус: ${job.confirmed ? '✅ Підтверджено' : '⏳ Очікує підтвердження'}
                <hr>
            `;
            jobsDiv.appendChild(div);
        });
    } catch (error) {
        console.error('Помилка завантаження робіт:', error);
    }
}

document.getElementById('jobForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const job = {
        machine: document.getElementById('machine').value,
        customer: document.getElementById('customer').value,
        part: document.getElementById('part').value,
        quantity: document.getElementById('quantity').value,
        operator: document.getElementById('operator').value,
        plannedTime: document.getElementById('plannedTime').value
    };

    await fetch('http://localhost:3000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
    });

    loadJobs();
    e.target.reset();
});

document.getElementById('progressForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('jobId').value;
    const progress = document.getElementById('progress').value;
    const shiftHours = document.getElementById('shiftHours').value;
    const note = document.getElementById('note').value;

    await fetch(`http://localhost:3000/api/jobs/${id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress, shiftHours, note })
    });

    loadJobs();
    e.target.reset();
});

document.getElementById('downtimeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const downtime = {
        jobId: document.getElementById('dtJobId').value,
        operator: document.getElementById('operator').value,
        reason: document.getElementById('dtReason').value,
        duration: document.getElementById('dtDuration').value,
        date: new Date().toISOString().split('T')[0]
    };

    await fetch('http://localhost:3000/api/downtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(downtime)
    });

    alert("Простій додано ✅");
    e.target.reset();
});

loadJobs();
