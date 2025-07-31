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

async function loadDowntimes() {
    try {
        const response = await fetch('http://localhost:3000/api/downtime');
        const downtimes = await response.json();

        const downtimesDiv = document.getElementById('downtimes');
        downtimesDiv.innerHTML = '';

        if (downtimes.length === 0) {
            downtimesDiv.innerHTML = "<p>Немає зафіксованих простоїв</p>";
            return;
        }

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

loadSchedule();
loadDowntimes();
