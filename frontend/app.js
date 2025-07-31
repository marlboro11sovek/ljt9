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
            Плановий час: ${job.plannedTime} хв
        `;
        jobsDiv.appendChild(div);
    });
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

loadJobs();
