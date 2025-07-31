async function loadJobs() {
    const response = await fetch('http://localhost:3000/api/jobs');
    const jobs = await response.json();

    const jobsDiv = document.getElementById('jobs');
    jobsDiv.innerHTML = '';

    jobs.forEach(job => {
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${job.part}</strong> — ${job.machine}<br>
            Замовник: ${job.customer}, Оператор: ${job.operator}<br>
            Кількість: ${job.quantity}, Прогрес: ${job.progress}%<br>
            Плановий час: ${job.plannedTime} хв<br>
            <button onclick="deleteJob(${job.id})">Видалити</button>
        `;
        jobsDiv.appendChild(div);
    });
}

async function deleteJob(id) {
    await fetch(`http://localhost:3000/api/jobs/${id}`, {
        method: 'DELETE'
    });
    loadJobs();
}

loadJobs();
