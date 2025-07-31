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

async function loadStatistics() {
    try {
        const jobsRes = await fetch('http://localhost:3000/api/statistics/jobs');
        const jobsStats = await jobsRes.json();

        const downtimeRes = await fetch('http://localhost:3000/api/statistics/downtime');
        const downtimeStats = await downtimeRes.json();

        const jobsCtx = document.getElementById('jobsChart').getContext('2d');
        const downtimeCtx = document.getElementById('downtimeChart').getContext('2d');
        const jobsLineCtx = document.getElementById('jobsLineChart').getContext('2d');
        const downtimePieCtx = document.getElementById('downtimePieChart').getContext('2d');

        // Jobs bar chart
        if (jobsStats.length > 0) {
            new Chart(jobsCtx, {
                type: 'bar',
                data: {
                    labels: jobsStats.map(j => j.operator),
                    datasets: [{
                        label: 'Виконано деталей',
                        data: jobsStats.map(j => j.completed_parts),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)'
                    }]
                }
            });

            // Jobs line chart by date
            const dates = [...new Set(jobsStats.map(j => j.work_date))];
            const totals = dates.map(date =>
                jobsStats
                    .filter(j => j.work_date === date)
                    .reduce((sum, j) => sum + j.completed_parts, 0)
            );

            new Chart(jobsLineCtx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Деталі по днях',
                        data: totals,
                        fill: false,
                        borderColor: 'rgba(54, 162, 235, 0.9)'
                    }]
                }
            });
        }

        // Downtime bar chart
        if (downtimeStats.length > 0) {
            new Chart(downtimeCtx, {
                type: 'bar',
                data: {
                    labels: downtimeStats.map(d => d.operator),
                    datasets: [{
                        label: 'Простої (хв)',
                        data: downtimeStats.map(d => d.total_downtime),
                        backgroundColor: 'rgba(255, 99, 132, 0.6)'
                    }]
                }
            });

            // Downtime pie chart by reason
            const reasonsCount = {};
            const downtimesRes = await fetch('http://localhost:3000/api/downtime');
            const downtimes = await downtimesRes.json();

            downtimes.forEach(dt => {
                if (!reasonsCount[dt.reason]) reasonsCount[dt.reason] = 0;
                reasonsCount[dt.reason] += dt.duration;
            });

            new Chart(downtimePieCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(reasonsCount),
                    datasets: [{
                        data: Object.values(reasonsCount),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(75, 192, 192, 0.6)'
                        ]
                    }]
                }
            });
        }

    } catch (error) {
        console.error('Помилка завантаження статистики:', error);
    }
}

// Initial load
loadSchedule();
loadDowntimes();
loadStatistics();
