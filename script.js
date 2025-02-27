 document.addEventListener("DOMContentLoaded", () => {
            // Mobile navigation handling
            const mobileToggle = document.querySelector(".mobile-toggle");
            const mobileNavPanel = document.querySelector(".mobile-nav-panel");
            const closeBtn = document.querySelector(".close-btn");

            mobileToggle.addEventListener("click", () => {
                mobileNavPanel.classList.add("active");
            });

            closeBtn.addEventListener("click", () => {
                mobileNavPanel.classList.remove("active");
            });

            document.addEventListener("click", (e) => {
                if (!mobileNavPanel.contains(e.target) && !mobileToggle.contains(e.target)) {
                    mobileNavPanel.classList.remove("active");
                }
            });

            // Chart initialization
            let publicationsChart = null;

            // Fetch and display metrics
            fetch('metrics.json')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('total-citations').textContent = data.citations;
                    document.getElementById('num-publications').textContent = data.publications;
                    document.getElementById('h-index').textContent = data.h_index;

                    if (publicationsChart) publicationsChart.destroy();

                    if (data.citations_per_year && Object.keys(data.citations_per_year).length > 0) {
                        const ctx = document.getElementById('publicationsChart').getContext('2d');
                        const citationYears = Object.keys(data.citations_per_year).sort();
                        const citationCounts = citationYears.map(year => data.citations_per_year[year]);

                        publicationsChart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: citationYears,
                                datasets: [{
                                    label: 'Citations per Year',
                                    data: citationCounts,
                                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1,
                                    borderRadius: 4
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Citation History',
                                        font: { size: 18, weight: 'bold' },
                                        padding: 20
                                    },
                                    legend: { display: false }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: { 
                                            display: true, 
                                            text: 'Number of Citations',
                                            font: { weight: 'bold' }
                                        },
                                        grid: { color: 'rgba(0,0,0,0.05)' }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Year',
                                            font: { weight: 'bold' }
                                        },
                                        grid: { display: false }
                                    }
                                }
                            }
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('publicationsChart').parentElement.innerHTML = 
                        '<p class="text-danger text-center">Failed to load citation data</p>';
                });
        });

        function openEmailEditor(email) {
            window.location.href = `mailto:${email}`;
            setTimeout(() => {
                if (!document.hidden && !window.location.href.startsWith('mailto:')) {
                    navigator.clipboard.writeText(email).then(() => {
                        alert('Email copied: ' + email);
                    });
                }
            }, 1000);
        }
