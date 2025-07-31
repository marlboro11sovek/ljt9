async function loadSchedule() {
    const response = await fetch('http://localhost:3000/api/jobs');
    const jobs = await response.json();

    const scheduleDiv = document.getElementById('schedule');
    scheduleDiv.innerHTML = '';

    const grouped = {};
    jobs.forEach(job => {
        if (!grouped[job.machine]) grouped[job.machine] = [];
        grouped[job.machine].push(job);
    });

    for (const machine in grouped) {
        const machineDiv = document.createElement('div');
        machineDiv.innerHTML = `<h2>${machine}</h2>`;
        
        grouped[machine].forEach(job => {
            const jobDiv = document.createElement('div');
            jobDiv.innerHTML = `
                <strong>${job.part}</strong> — ${job.progress}% виконано<br>
                Кількість: ${job.quantity}, Оператор: ${job.operator}
            `;
            machineDiv.appendChild(jobDiv);
        });

        scheduleDiv.appendChild(machineDiv);
    }
}

loadSchedule();
