async function loadSchedule() {
    try {
        const response = await fetch('http://localhost:3000/api/jobs');
        const jobs = await response.json();

        const scheduleDiv = document.getElementById('schedule');
        scheduleDiv.innerHTML = '';

        const confirmedJobs = jobs.filter(job => job.confirmed === 1);

        if (confirmedJobs.length === 0) {
            scheduleDiv.innerHTML = "<p>Немає підтверджених робіт</p>";
            return;
        }

        const grouped = {};
        confirmedJobs.forEach(job => {
            if (!grouped[job.machine]) grouped[job.machine] = [];
            grouped[job.machine].push(job);
        });

        for (const machine in grouped) {
            const machineDiv = document.createElement('div');
            machineDiv.innerHTML = `<h2>${machine}</h2>`;

            grouped[machine].forEach(job => {
                const jobDiv = document.createElement('div');
                jobDiv.innerHTML = `
                    <strong>${job.part}</strong><br>
                    Прогрес: ${job.progress}%<br>
                    Кількість: ${job.quantity}<br>
                    Оператор: ${job.operator}<br>
                    Зміна: ${job.shiftHours || '-'} год<br>
                    Примітка: ${job.note || '-'}
                    <hr>
                `;
                machineDiv.appendChild(jobDiv);
            });

            scheduleDiv.appendChild(machineDiv);
        }
    } catch (error) {
        console.error('Помилка завантаження розкладу:', error);
    }
}

loadSchedule();
