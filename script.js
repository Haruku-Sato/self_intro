// Scroll Animation Logic
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach(el => observer.observe(el));
    
    // Trigger animation for elements already in viewport on load
    setTimeout(() => {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                el.classList.add("active");
            }
        });
    }, 100);

    // Fetch GitHub Repositories
    async function fetchGitHubRepos() {
        const container = document.getElementById('github-repos');
        try {
            const response = await fetch('https://api.github.com/users/Haruku-Sato/repos?sort=updated&direction=desc');
            if (!response.ok) throw new Error('Failed to fetch');
            const repos = await response.json();
            
            container.innerHTML = '';
            
            if (repos.length === 0) {
                container.innerHTML = '<p>公開されているリポジトリはありません。</p>';
                return;
            }

            repos.slice(0, 5).forEach(repo => {
                const el = document.createElement('div');
                el.className = 'repo-item';
                const updatedDate = new Date(repo.updated_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
                el.innerHTML = `
                    <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
                    <p>${repo.description || '説明がありません'}</p>
                    <div class="repo-meta">
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>🔄 最終更新: ${updatedDate}</span>
                    </div>
                `;
                container.appendChild(el);
            });
        } catch (error) {
            console.error('Error fetching repos:', error);
            container.innerHTML = '<p>リポジトリの読み込みに失敗しました。</p>';
        }
    }

    fetchGitHubRepos();
});
