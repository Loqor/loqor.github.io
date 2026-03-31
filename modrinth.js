// ============================================
// LOQOR.DEV — Modrinth API Integration
// ============================================

const MODRINTH_API = 'https://api.modrinth.com/v2';
const USER_ID = 'Loqor';
const CACHE_KEY = 'loqor_mods_cache_v1';
const CACHE_TTL = 1000 * 60 * 60 * 12; // 12 hours

// ============================================
// CACHING
// ============================================

function loadCache() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_TTL;

        if (isExpired) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        return data;
    } catch (e) {
        console.warn('Cache read error:', e);
        return null;
    }
}

function saveCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.warn('Cache write error:', e);
    }
}

// ============================================
// API FUNCTIONS
// ============================================

async function fetchUserProjects() {
    const response = await fetch(`${MODRINTH_API}/user/${USER_ID}/projects`, {
        headers: {
            'User-Agent': 'loqor.dev/1.0'
        }
    });

    if (!response.ok) {
        throw new Error(`Modrinth API error: ${response.status}`);
    }

    return response.json();
}

async function fetchProjectVersions(slug) {
    const response = await fetch(`${MODRINTH_API}/project/${slug}/version`, {
        headers: {
            'User-Agent': 'loqor.dev/1.0'
        }
    });

    if (!response.ok) {
        throw new Error(`Modrinth API error: ${response.status}`);
    }

    return response.json();
}

// ============================================
// FORMATTING
// ============================================

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}

function formatProjectType(type) {
    const types = {
        'mod': 'Minecraft Mod',
        'modpack': 'Modpack',
        'resourcepack': 'Resource Pack',
        'shader': 'Shader',
        'datapack': 'Data Pack',
        'plugin': 'Plugin'
    };
    return types[type] || type;
}

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

// ============================================
// RENDERING
// ============================================

function renderModCard(project) {
    const iconUrl = project.icon_url || './img/modrinth.png';
    const modrinthUrl = `https://modrinth.com/${project.project_type}/${project.slug}`;

    return `
        <article class="mod-card">
            <div class="mod-card-header">
                <img src="${iconUrl}" alt="${project.title}" class="mod-icon" loading="lazy">
                <div class="mod-info">
                    <span class="mod-type">${formatProjectType(project.project_type)}</span>
                    <h4 class="mod-title">${project.title}</h4>
                </div>
            </div>
            <p class="mod-desc">${project.description}</p>
            <div class="mod-stats">
                <div class="mod-stat">
                    <span class="mod-stat-value">${formatNumber(project.downloads)}</span>
                    <span class="mod-stat-label">Downloads</span>
                </div>
                <a href="${modrinthUrl}" target="_blank" class="mod-link">View Project &rarr;</a>
            </div>
        </article>
    `;
}

function renderTimelineItem(version, projectTitle) {
    return `
        <div class="timeline-item">
            <span class="timeline-dot"></span>
            <div class="timeline-content">
                <span class="timeline-project">${projectTitle}</span>
                <span class="timeline-version">${version.version_number}</span>
            </div>
            <span class="timeline-date">${timeAgo(version.date_published)}</span>
        </div>
    `;
}

function updateStats(projects) {
    const totalDownloads = projects.reduce((sum, p) => sum + p.downloads, 0);
    const projectCount = projects.length;

    const downloadsEl = document.getElementById('total-downloads');
    const countEl = document.getElementById('project-count');

    if (downloadsEl) {
        downloadsEl.textContent = formatNumber(totalDownloads);
    }
    if (countEl) {
        countEl.textContent = projectCount;
    }
}

// ============================================
// MAIN INITIALIZATION
// ============================================

async function initMods() {
    const modsGrid = document.getElementById('mods-grid');
    const timelineList = document.getElementById('timeline-list');

    if (!modsGrid) {
        console.warn('Mods grid element not found');
        return;
    }

    // Try to load from cache first
    const cached = loadCache();
    if (cached) {
        console.log('Loading from cache');
        renderContent(cached.projects, cached.versions, modsGrid, timelineList);
        return;
    }

    try {
        // Fetch projects
        const projects = await fetchUserProjects();

        // Sort by downloads (most popular first)
        projects.sort((a, b) => b.downloads - a.downloads);

        // Fetch versions for timeline (get latest versions from each project)
        const versionsPromises = projects.slice(0, 10).map(async (project) => {
            try {
                const versions = await fetchProjectVersions(project.slug);
                return versions.slice(0, 3).map(v => ({
                    ...v,
                    projectTitle: project.title
                }));
            } catch (e) {
                console.warn(`Failed to fetch versions for ${project.slug}:`, e);
                return [];
            }
        });

        const allVersions = (await Promise.all(versionsPromises)).flat();

        // Sort by date and take latest 8
        allVersions.sort((a, b) => new Date(b.date_published) - new Date(a.date_published));
        const recentVersions = allVersions.slice(0, 8);

        // Cache the data
        saveCache({ projects, versions: recentVersions });

        // Render
        renderContent(projects, recentVersions, modsGrid, timelineList);

    } catch (error) {
        console.error('Failed to load Modrinth data:', error);

        // Show error state
        modsGrid.innerHTML = `
            <div class="mod-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <p style="color: var(--text-muted);">Failed to load projects. Please try again later.</p>
            </div>
        `;

        if (timelineList) {
            timelineList.innerHTML = `
                <div class="timeline-item" style="justify-content: center;">
                    <p style="color: var(--text-muted);">Failed to load updates.</p>
                </div>
            `;
        }
    }
}

function renderContent(projects, versions, modsGrid, timelineList) {
    // Update stats
    updateStats(projects);

    // Render mods grid
    modsGrid.innerHTML = projects.map(renderModCard).join('');

    // Render timeline
    if (timelineList && versions.length > 0) {
        timelineList.innerHTML = versions.map(v => renderTimelineItem(v, v.projectTitle)).join('');
    } else if (timelineList) {
        timelineList.innerHTML = `
            <div class="timeline-item" style="justify-content: center;">
                <p style="color: var(--text-muted);">No recent updates.</p>
            </div>
        `;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMods);
} else {
    initMods();
}
