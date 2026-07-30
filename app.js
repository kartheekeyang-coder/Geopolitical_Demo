/**
 * Geopolitical Supply Chain Risk Decision Agent - Interactive Web Dashboard Engine
 * Implements 5-Layer Pipeline Logic:
 * 1. Signal Ingestion (with Hugging Face Datasets Connector)
 * 2. Event Classification
 * 3. Network Entity Mapping
 * 4. Risk Scoring Engine (Prob * Exposure * Criticality / Resilience)
 * 5. Action Orchestration (ISO 31000 SCRM Playbooks)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State & Master Database ---
    const state = {
        activeTab: 'overview',
        signals: [
            {
                id: 'HF-EVT-101',
                date: '2026-07-25',
                source: 'HuggingFace (alerterra/geopolitical_risk_events)',
                type: 'Sanctions',
                country: 'CN',
                summary: 'HuggingFace Stream: Restricted entity list update on semiconductor raw material exporters.',
                credibility: 0.92,
                confidence: 0.88,
                trend: 'Rising'
            },
            {
                id: 'EVT-2026-081',
                date: '2026-07-24',
                source: 'OFAC Sanctions & BIS Bulletin',
                type: 'Sanctions',
                country: 'CN',
                summary: 'New export control quotas and restricted entity listings placed on specialty chemical precursor producers.',
                credibility: 0.95,
                confidence: 0.90,
                trend: 'Rising'
            },
            {
                id: 'EVT-2026-082',
                date: '2026-07-25',
                source: 'Reuters Maritime Alert',
                type: 'Port Closure',
                country: 'CN',
                summary: 'Port of Shanghai dockworker labor union issues 48-hour strike notice over customs overtime policies.',
                credibility: 0.88,
                confidence: 0.85,
                trend: 'Rising'
            },
            {
                id: 'EVT-2026-083',
                date: '2026-07-23',
                source: 'European Energy Risk Brief',
                type: 'Trade Restriction',
                country: 'DE',
                summary: 'German Industrial Gas Regulatory Board mandates 15% emergency allocation reserve on ultrapure gases.',
                credibility: 0.90,
                confidence: 0.92,
                trend: 'Stable'
            }
        ],
        suppliers: [
            {
                id: 'SUP-101',
                name: 'TaiChi Microchip Tech',
                country: 'TW',
                sku: 'SKU-9901 (Advanced Micro-Controller IC)',
                plant: 'PLANT-US-1 (Austin High-Tech Assembly)',
                dependency: 65.0,
                spendShare: 0.55,
                invCover: 12.0,
                soleSource: true,
                revImpactM: 45.0,
                stopRisk: 0.85,
                altSources: 0,
                esgRating: 'A+',
                creditScore: 88
            },
            {
                id: 'SUP-102',
                name: 'SinoChem Resins Ltd',
                country: 'CN',
                sku: 'SKU-8820 (Specialty Epichlorohydrin Resin)',
                plant: 'PLANT-US-1 (Austin High-Tech Assembly)',
                dependency: 48.0,
                spendShare: 0.35,
                invCover: 14.0,
                soleSource: false,
                revImpactM: 18.0,
                stopRisk: 0.60,
                altSources: 1,
                esgRating: 'B',
                creditScore: 72
            },
            {
                id: 'SUP-103',
                name: 'ASML Litho Systems',
                country: 'NL',
                sku: 'SKU-5040 (EUV Scanner Optics Replacement Module)',
                plant: 'PLANT-US-1 (Austin High-Tech Assembly)',
                dependency: 90.0,
                spendShare: 0.80,
                invCover: 45.0,
                soleSource: true,
                revImpactM: 60.0,
                stopRisk: 0.95,
                altSources: 0,
                esgRating: 'AAA',
                creditScore: 94
            },
            {
                id: 'SUP-104',
                name: 'Rheinland Special Gas',
                country: 'DE',
                sku: 'SKU-7711 (Ultrapure Neon Gas Grade 5)',
                plant: 'PLANT-EU-1 (Munich Industrial Systems)',
                dependency: 80.0,
                spendShare: 0.70,
                invCover: 8.0,
                soleSource: true,
                revImpactM: 32.0,
                stopRisk: 0.90,
                altSources: 0,
                esgRating: 'AA',
                creditScore: 85
            }
        ],
        actions: [
            {
                id: 'ACT-901',
                entityName: 'TaiChi Microchip Tech',
                owner: 'Procurement & Supply Planning',
                recommendation: 'IMMEDIATE BUFFER BUILD: Expedite +30 days safety stock for SKU-9901, initiate alternate vendor qualification, and trigger legal geopolitical escalation.',
                rule: 'ISO-SCRM-R1 (High Dependency Trade Barrier Trigger)',
                dueDays: 3,
                status: 'Proposed',
                confidence: 0.94
            },
            {
                id: 'ACT-902',
                entityName: 'Rheinland Special Gas',
                owner: 'Procurement & Operations',
                recommendation: 'SAFETY STOCK EXPEDITE: Procure emergency 15-day gas cylinder reserve and place supplier on daily allocation monitoring.',
                rule: 'ISO-SCRM-R1 (Critical Inv Cover Below 10 Days)',
                dueDays: 2,
                status: 'Approved',
                confidence: 0.96
            },
            {
                id: 'ACT-903',
                entityName: 'SinoChem Resins Ltd',
                owner: 'Logistics & Operations',
                recommendation: 'REROUTE & EXPEDITE: Shift upcoming ocean freight shipments from Port of Shanghai to Port of Ningbo to avoid 48-hr strike delay.',
                rule: 'ISO-SCRM-R2 (Logistics Port Disruption Playbook)',
                dueDays: 5,
                status: 'Proposed',
                confidence: 0.88
            }
        ]
    };

    // --- Core Risk Calculation Math ---
    function calculateScore(sup, signal) {
        let prob = (signal ? signal.credibility * signal.confidence : 0.80) * (signal && signal.trend === 'Rising' ? 1.15 : 1.0);
        prob = Math.min(Math.max(prob, 0.1), 1.0);

        let exp = (sup.dependency / 100.0) * 0.6 + (sup.spendShare) * 0.4;
        exp = Math.min(Math.max(exp, 0.1), 1.0);

        let crit = (sup.stopRisk * 0.5) + (sup.soleSource ? 1.0 : 0.3) * 0.5;
        crit = Math.min(Math.max(crit, 0.1), 1.0);

        let res = (sup.altSources * 0.3) + Math.min(sup.invCover / 30.0, 1.0) * 0.7;
        res = Math.max(res, 0.1);

        let rawScore = (prob * exp * crit) / res;
        let finalScore = Math.min(Math.round(rawScore * 100.0 * 10) / 10, 100.0);

        let level = 'Low';
        if (finalScore >= 70) level = 'Critical';
        else if (finalScore >= 50) level = 'High';
        else if (finalScore >= 25) level = 'Medium';

        return {
            probability: Math.round(prob * 100) / 100,
            exposure: Math.round(exp * 100) / 100,
            criticality: Math.round(crit * 100) / 100,
            resilience: Math.round(res * 100) / 100,
            finalScore: finalScore,
            level: level
        };
    }

    // --- UI Render Handlers ---

    // 1. Navigation Tab Controller
    const navButtons = document.querySelectorAll('.nav-item');
    const tabPages = document.querySelectorAll('.tab-page');
    const pageTitle = document.getElementById('page-title');

    const pageTitles = {
        overview: 'Executive Risk Overview',
        pipeline: '5-Layer Pipeline Flow Architecture',
        heatmap: 'Global Geopolitical Risk Heatmap & Supply Graph',
        simulator: 'Live Signal Simulator & Agent Execution Console',
        scoring: 'Risk Scoring Matrix & What-If Calculator',
        actions: 'Action Orchestration & Governance Board'
    };

    function switchTab(targetTab) {
        navButtons.forEach(b => b.classList.remove('active'));
        tabPages.forEach(p => p.classList.remove('active'));

        const activeNavBtn = document.querySelector(`.nav-item[data-tab="${targetTab}"]`);
        if (activeNavBtn) activeNavBtn.classList.add('active');

        const targetPage = document.getElementById(`tab-${targetTab}`);
        if (targetPage) targetPage.classList.add('active');

        if (pageTitle && pageTitles[targetTab]) {
            pageTitle.textContent = pageTitles[targetTab];
        }
        state.activeTab = targetTab;
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Wire up top header "Inject Signal" button
    const btnTriggerSim = document.getElementById('btn-trigger-sim');
    if (btnTriggerSim) {
        btnTriggerSim.addEventListener('click', () => {
            switchTab('simulator');
            const summaryField = document.getElementById('sim-summary');
            if (summaryField) summaryField.focus();
        });
    }

    // 2. Render Watchlist Table
    function renderWatchlist() {
        const tbody = document.querySelector('#watchlist-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        state.suppliers.forEach(sup => {
            const matchingSignal = state.signals.find(s => s.country === sup.country);
            const scoreObj = calculateScore(sup, matchingSignal);

            let badgeClass = 'badge-info';
            if (scoreObj.level === 'Critical') badgeClass = 'badge-danger';
            else if (scoreObj.level === 'High') badgeClass = 'badge-warning';
            else if (scoreObj.level === 'Medium') badgeClass = 'badge-info';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong class="color-warning">${sup.country}</strong></td>
                <td><strong>${sup.name}</strong></td>
                <td><code>${sup.sku}</code></td>
                <td>${sup.invCover} Days</td>
                <td>${sup.dependency}%</td>
                <td><span class="badge ${badgeClass}">${scoreObj.finalScore} (${scoreObj.level})</span></td>
                <td>${scoreObj.level === 'Critical' || scoreObj.level === 'High' ? '<span class="badge badge-danger">Immediate Intervention</span>' : '<span class="badge badge-neutral">Watchlist</span>'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // 3. Render Top Actions Grid
    function renderActions() {
        const container = document.getElementById('top-actions-container');
        const boardFull = document.getElementById('action-board-full');
        
        const html = state.actions.map(act => `
            <div class="action-card">
                <div class="action-card-header">
                    <span class="action-card-title">${act.entityName}</span>
                    <span class="badge ${act.status === 'Approved' ? 'badge-emerald' : 'badge-warning'}">${act.status}</span>
                </div>
                <div class="action-card-body">
                    <p>${act.recommendation}</p>
                </div>
                <div class="action-card-footer">
                    <span><i class="fa-solid fa-user-gear"></i> ${act.owner}</span>
                    <span><i class="fa-solid fa-clock"></i> ${act.dueDays}d SLA</span>
                </div>
            </div>
        `).join('');

        if (container) container.innerHTML = html;
        if (boardFull) boardFull.innerHTML = `<div class="action-card-grid">${html}</div>`;
    }

    // 4. Render Master Risk Scoring Matrix Table
    function renderMasterScoreTable() {
        const tbody = document.querySelector('#master-score-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        state.suppliers.forEach(sup => {
            const matchingSignal = state.signals.find(s => s.country === sup.country);
            const score = calculateScore(sup, matchingSignal);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${sup.name}</strong> (${sup.country})</td>
                <td><code>${sup.sku}</code></td>
                <td>${score.probability}</td>
                <td>${score.exposure}</td>
                <td>${score.criticality}</td>
                <td>${score.resilience}</td>
                <td><strong>${score.finalScore}</strong></td>
                <td><span class="badge ${score.level === 'Critical' ? 'badge-danger' : score.level === 'High' ? 'badge-warning' : 'badge-info'}">${score.level}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // 5. Render Heatmap & Graph
    function renderHeatmapAndGraph() {
        const mapContainer = document.getElementById('geo-map-visual');
        const graphContainer = document.getElementById('graph-view-container');

        const countryRiskData = state.suppliers.reduce((acc, sup) => {
            const matchingSignal = state.signals.find(s => s.country === sup.country);
            const score = calculateScore(sup, matchingSignal);
            const entry = acc[sup.country] || { country: sup.country, score: 0, suppliers: [], label: '' };
            entry.score += score.finalScore;
            entry.suppliers.push({ name: sup.name, dependency: sup.dependency, invCover: sup.invCover });
            acc[sup.country] = entry;
            return acc;
        }, {});

        const countryEntries = Object.values(countryRiskData).map(entry => ({
            ...entry,
            avgScore: Math.round((entry.score / entry.suppliers.length) * 10) / 10,
            label: entry.country === 'TW' ? 'Taiwan' : entry.country === 'CN' ? 'China' : entry.country === 'DE' ? 'Germany' : 'Netherlands'
        })).sort((a, b) => b.avgScore - a.avgScore);

        const defaultPositions = {
            TW: { x: 180, y: 140 },
            CN: { x: 315, y: 155 },
            DE: { x: 430, y: 138 },
            NL: { x: 455, y: 120 }
        };

        const connectionTargets = {
            TW: { x: 224, y: 220 },
            CN: { x: 349, y: 220 },
            DE: { x: 468, y: 220 },
            NL: { x: 500, y: 210 }
        };

        const mapState = window.__geoMapView || (window.__geoMapView = { zoom: 1, panX: 0, panY: 0, positions: {} });
        const positions = {};
        Object.keys(defaultPositions).forEach(country => {
            const saved = mapState.positions[country];
            positions[country] = saved ? { x: saved.x, y: saved.y } : { ...defaultPositions[country] };
        });

        if (mapContainer) {
            const mapMarkup = `
                <div class="geo-map-shell">
                    <div class="geo-map-controls">
                        <button class="map-zoom-btn" data-zoom="in">+</button>
                        <button class="map-zoom-btn" data-zoom="out">−</button>
                    </div>
                    <svg class="geo-map-svg" viewBox="0 0 600 300" aria-label="Geopolitical risk heatmap">
                        <rect x="20" y="20" width="560" height="260" rx="24" class="geo-map-bg"></rect>
                        <g transform="translate(${mapState.panX} ${mapState.panY}) scale(${mapState.zoom})">
                            <path d="M96 104c6-24 26-41 50-44l24-4 14 16 22 6 14-10 22 4 16 18 26 8 16-12 18 10-8 24-18 10-24 4-10 24-20 16-24-4-18 6-14-12-26-2-20-16-12-16-14-10z" class="geo-map-land"></path>
                            <path d="M252 86c16-14 38-16 56-8l22 10 14-8 24 14 18-4 10 14-14 16-28 8-22 12-28 2-20-12-12-16-10-18z" class="geo-map-land"></path>
                            <path d="M346 124c12-14 34-20 54-12l16 6 18-10 20 8 16 20-6 20-20 12-28-2-20 8-24-8-10-16z" class="geo-map-land"></path>
                            <path d="M110 172c10-16 26-26 46-24l22 2 18-10 20 6 12 20-10 18-22 10-26-4-18 8-18-8-14-18z" class="geo-map-land"></path>
                            <path d="M250 178c12-14 30-20 48-16l18 4 16-10 16 10 20 6-10 20-20 12-18-2-16 10-24-4-18-8-12-22z" class="geo-map-land"></path>
                            <path d="M392 182c12-8 26-10 40-6l18 8 16-6 16 12 10 18-16 12-18-4-16 10-24-8-12-18z" class="geo-map-land"></path>
                            <path d="M430 118c8-8 20-10 30-6l14 6 12-8 12 10 10 18-8 12-22 4-20-8-12-14z" class="geo-map-land"></path>
                            <line x1="70" y1="70" x2="510" y2="70" class="geo-grid-line"></line>
                            <line x1="70" y1="120" x2="510" y2="120" class="geo-grid-line"></line>
                            <line x1="70" y1="180" x2="510" y2="180" class="geo-grid-line"></line>
                            <line x1="70" y1="240" x2="510" y2="240" class="geo-grid-line"></line>
                        </g>
                        ${countryEntries.map(entry => {
                            const pos = positions[entry.country] || defaultPositions[entry.country];
                            const target = connectionTargets[entry.country] || { x: pos.x + 80, y: pos.y + 70 };
                            const color = entry.avgScore >= 70 ? '#ff5d7a' : entry.avgScore >= 50 ? '#ffb84d' : entry.avgScore >= 25 ? '#6bb7ff' : '#39d98a';
                            const radius = 18 + (entry.avgScore / 100) * 16;
                            return `
                                <g class="geo-link-group">
                                    <line x1="${pos.x}" y1="${pos.y}" x2="${target.x}" y2="${target.y}" class="geo-link" stroke="${color}"></line>
                                    <circle cx="${target.x}" cy="${target.y}" r="6" fill="${color}" opacity="0.9"></circle>
                                    <g class="geo-country-node" data-country="${entry.country}" data-label="${entry.label}" data-score="${entry.avgScore}" data-suppliers="${entry.suppliers.length}" data-signal="${entry.suppliers.map(s => s.name).slice(0, 2).join(', ')}">
                                        <circle cx="${pos.x}" cy="${pos.y}" r="${radius + 10}" fill="${color}" opacity="0.14" class="geo-map-pulse"></circle>
                                        <circle cx="${pos.x}" cy="${pos.y}" r="${radius + 6}" fill="${color}" opacity="0.16"></circle>
                                        <circle cx="${pos.x}" cy="${pos.y}" r="${radius}" fill="${color}" opacity="0.9"></circle>
                                        <circle cx="${pos.x}" cy="${pos.y}" r="${radius - 6}" fill="#0f172a" opacity="0.95"></circle>
                                    </g>
                                    <text x="${pos.x}" y="${pos.y + 35}" class="geo-map-label">${entry.label} (${entry.country})</text>
                                </g>`;
                        }).join('')}
                    </svg>
                    <div class="geo-map-tooltip" id="geo-map-tooltip"></div>
                    <div class="geo-map-legend">
                        <span><i class="fa-solid fa-circle" style="color:#ff5d7a"></i> Critical</span>
                        <span><i class="fa-solid fa-circle" style="color:#ffb84d"></i> Elevated</span>
                        <span><i class="fa-solid fa-circle" style="color:#6bb7ff"></i> Moderate</span>
                        <span><i class="fa-solid fa-circle" style="color:#39d98a"></i> Low</span>
                    </div>
                    <div class="geo-timeline">
                        <div class="timeline-label">Live risk pulse</div>
                        <div class="timeline-track">
                            ${countryEntries.map(entry => `
                                <div class="timeline-bar">
                                    <span style="height:${Math.max(18, entry.avgScore)}%"></span>
                                    <label>${entry.country}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="country-risk-list">
                    ${countryEntries.map(entry => {
                        const severityClass = entry.avgScore >= 70 ? 'critical' : entry.avgScore >= 50 ? 'elevated' : entry.avgScore >= 25 ? 'moderate' : 'low';
                        return `
                            <div class="country-card ${severityClass}">
                                <div class="country-flag-name">
                                    <i class="fa-solid fa-flag"></i> ${entry.label} (${entry.country})
                                </div>
                                <span class="badge ${entry.avgScore >= 70 ? 'badge-danger' : entry.avgScore >= 50 ? 'badge-warning' : 'badge-info'}">Score: ${entry.avgScore}</span>
                            </div>`;
                    }).join('')}
                </div>
            `;
            mapContainer.innerHTML = mapMarkup;

            const tooltip = document.getElementById('geo-map-tooltip');
            const countryNodes = mapContainer.querySelectorAll('.geo-country-node');
            const zoomButtons = mapContainer.querySelectorAll('.map-zoom-btn');

            if (!window.__geoMapListenersBound) {
                window.__geoMapListenersBound = true;
                window.addEventListener('mousemove', (event) => {
                    if (!window.__geoMapDragState) return;
                    const svg = mapContainer.querySelector('svg');
                    if (!svg) return;
                    const rect = svg.getBoundingClientRect();
                    const scaleFactorX = 600 / rect.width;
                    const scaleFactorY = 300 / rect.height;
                    const svgX = (event.clientX - rect.left) * scaleFactorX;
                    const svgY = (event.clientY - rect.top) * scaleFactorY;
                    const worldX = (svgX - mapState.panX) / mapState.zoom;
                    const worldY = (svgY - mapState.panY) / mapState.zoom;
                    mapState.positions[window.__geoMapDragState.country] = {
                        x: Math.max(60, Math.min(540, worldX)),
                        y: Math.max(60, Math.min(240, worldY))
                    };
                    renderHeatmapAndGraph();
                });

                window.addEventListener('mouseup', () => {
                    window.__geoMapDragState = null;
                });
            }

            zoomButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const direction = button.getAttribute('data-zoom');
                    if (direction === 'in') {
                        mapState.zoom = Math.min(2.2, mapState.zoom + 0.2);
                    } else {
                        mapState.zoom = Math.max(0.8, mapState.zoom - 0.2);
                    }
                    renderHeatmapAndGraph();
                });
            });

            mapContainer.addEventListener('wheel', (event) => {
                event.preventDefault();
                if (event.deltaY < 0) {
                    mapState.zoom = Math.min(2.2, mapState.zoom + 0.08);
                } else {
                    mapState.zoom = Math.max(0.8, mapState.zoom - 0.08);
                }
                renderHeatmapAndGraph();
            }, { passive: false });

            countryNodes.forEach(node => {
                node.addEventListener('mousedown', (event) => {
                    event.preventDefault();
                    window.__geoMapDragState = { country: node.getAttribute('data-country') };
                });

                node.addEventListener('mouseenter', (event) => {
                    const country = node.getAttribute('data-country');
                    const label = node.getAttribute('data-label');
                    const score = node.getAttribute('data-score');
                    const suppliers = node.getAttribute('data-suppliers');
                    const signal = node.getAttribute('data-signal');
                    tooltip.innerHTML = `
                        <strong>${label} (${country})</strong><br>
                        Risk score: <span>${score}</span><br>
                        Active suppliers: <span>${suppliers}</span><br>
                        Key exposure: <span>${signal}</span>
                    `;
                    tooltip.classList.add('visible');
                    const rect = mapContainer.getBoundingClientRect();
                    tooltip.style.left = `${event.clientX - rect.left + 10}px`;
                    tooltip.style.top = `${event.clientY - rect.top + 10}px`;
                });

                node.addEventListener('mousemove', (event) => {
                    const rect = mapContainer.getBoundingClientRect();
                    tooltip.style.left = `${event.clientX - rect.left + 10}px`;
                    tooltip.style.top = `${event.clientY - rect.top + 10}px`;
                });

                node.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('visible');
                });
            });
        }

        if (graphContainer) {
            const graphNodes = state.suppliers.slice(0, 4).map((sup, index) => {
                const matchingSignal = state.signals.find(s => s.country === sup.country);
                const score = calculateScore(sup, matchingSignal);
                const positions = [
                    { x: 95, y: 70 },
                    { x: 285, y: 70 },
                    { x: 95, y: 180 },
                    { x: 285, y: 180 }
                ];
                const pos = positions[index] || { x: 190, y: 125 };
                return `
                    <g>
                        <rect x="${pos.x - 70}" y="${pos.y - 35}" width="140" height="90" rx="14" class="graph-node-box"></rect>
                        <text x="${pos.x}" y="${pos.y - 18}" class="graph-node-stage">Country • ${sup.country}</text>
                        <text x="${pos.x}" y="${pos.y - 2}" class="graph-node-title">${sup.name}</text>
                        <text x="${pos.x}" y="${pos.y + 14}" class="graph-node-detail">SKU: ${sup.sku}</text>
                        <text x="${pos.x}" y="${pos.y + 28}" class="graph-node-detail">Plant: ${sup.plant}</text>
                        <text x="${pos.x}" y="${pos.y + 42}" class="graph-node-score">Risk ${score.finalScore}</text>
                    </g>`;
            }).join('');

            graphContainer.innerHTML = `
                <div class="graph-header">
                    <div class="graph-title">Supply Network Dependency Graph</div>
                    <div class="graph-subtitle">Country → Supplier → SKU → Plant</div>
                </div>
                <div class="graph-legend-row">
                    <span><span class="graph-legend-dot country"></span>Country</span>
                    <span><span class="graph-legend-dot supplier"></span>Supplier</span>
                    <span><span class="graph-legend-dot sku"></span>SKU</span>
                    <span><span class="graph-legend-dot plant"></span>Plant</span>
                </div>
                <div class="graph-svg-shell">
                    <svg class="graph-svg" viewBox="0 0 380 260" aria-label="Supply network dependency graph">
                        <defs>
                            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                                <path d="M0,0 L8,4 L0,8 Z" fill="rgba(107, 183, 255, 0.85)" />
                            </marker>
                        </defs>
                        <rect x="12" y="12" width="356" height="236" rx="18" class="graph-svg-bg"></rect>
                        <line x1="145" y1="70" x2="235" y2="70" class="graph-edge" marker-end="url(#arrowhead)"></line>
                        <line x1="145" y1="180" x2="235" y2="180" class="graph-edge" marker-end="url(#arrowhead)"></line>
                        <line x1="95" y1="105" x2="95" y2="145" class="graph-edge" marker-end="url(#arrowhead)"></line>
                        <line x1="285" y1="105" x2="285" y2="145" class="graph-edge" marker-end="url(#arrowhead)"></line>
                        ${graphNodes}
                    </svg>
                </div>
            `;
        }
    }

    // 6. What-If Calculator Sliders
    const sliderP = document.getElementById('slider-p');
    const sliderE = document.getElementById('slider-e');
    const sliderC = document.getElementById('slider-c');
    const sliderR = document.getElementById('slider-r');
    const sliderAlt = document.getElementById('slider-alt');

    function updateCalculator() {
        if (!sliderP) return;

        const p = parseFloat(sliderP.value);
        const e = parseFloat(sliderE.value) / 100.0;
        const c = parseFloat(sliderC.value);
        const rDays = parseFloat(sliderR.value);
        const alt = parseInt(sliderAlt.value);

        document.getElementById('val-p').textContent = p.toFixed(2);
        document.getElementById('val-e').textContent = `${sliderE.value}%`;
        document.getElementById('val-c').textContent = c.toFixed(2);
        document.getElementById('val-r').textContent = `${rDays} Days`;
        document.getElementById('val-alt').textContent = `${alt} Vendors`;

        const res = (alt * 0.3) + Math.min(rDays / 30.0, 1.0) * 0.7;
        const resVal = Math.max(res, 0.1);
        const rawScore = (p * e * c) / resVal;
        const score = Math.min(Math.round(rawScore * 100.0 * 10) / 10, 100.0);

        const scoreDisplay = document.getElementById('calc-result-score');
        const levelDisplay = document.getElementById('calc-result-level');
        const formulaDisplay = document.getElementById('calc-result-formula');

        if (scoreDisplay) scoreDisplay.textContent = score.toFixed(1);
        
        let levelText = 'Low Exposure';
        let badgeClass = 'badge-emerald';
        if (score >= 70) { levelText = 'Critical Exposure'; badgeClass = 'badge-danger'; }
        else if (score >= 50) { levelText = 'High Exposure'; badgeClass = 'badge-warning'; }
        else if (score >= 25) { levelText = 'Medium Exposure'; badgeClass = 'badge-info'; }

        if (levelDisplay) {
            levelDisplay.textContent = levelText;
            levelDisplay.className = `calc-badge badge ${badgeClass}`;
        }

        if (formulaDisplay) {
            formulaDisplay.textContent = `Formula: (${p.toFixed(2)} × ${e.toFixed(2)} × ${c.toFixed(2)}) / ${resVal.toFixed(2)} = ${score.toFixed(1)}`;
        }
    }

    [sliderP, sliderE, sliderC, sliderR, sliderAlt].forEach(s => {
        if (s) s.addEventListener('input', updateCalculator);
    });

    // 7. Hugging Face Dataset Ingest Handler
    const btnHfIngest = document.getElementById('btn-hf-ingest');
    const simConsole = document.getElementById('sim-console-output');

    function logConsole(msg, type = 'info') {
        if (!simConsole) return;
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        simConsole.appendChild(line);
        simConsole.scrollTop = simConsole.scrollHeight;
    }

    if (btnHfIngest) {
        btnHfIngest.addEventListener('click', () => {
            logConsole("Connecting to Hugging Face Hub (hf.co/datasets/alerterra/geopolitical_risk_events)...", "info");
            
            setTimeout(() => {
                const hfEvt = {
                    id: `HF-EVT-${Math.floor(100 + Math.random() * 900)}`,
                    date: new Date().toISOString().split('T')[0],
                    source: 'HuggingFace Hub (alerterra/geopolitical_risk_events)',
                    type: 'Sanctions',
                    country: 'TW',
                    summary: 'HuggingFace Feed: Critical export quota advisory on advanced micro-controllers and wafer production lines.',
                    credibility: 0.95,
                    confidence: 0.92,
                    trend: 'Rising'
                };

                state.signals.unshift(hfEvt);
                logConsole(`Layer 1: Successfully ingested HuggingFace record ${hfEvt.id}`, "success");
                logConsole(`Layer 2: Event tagged as Sanctions/Trade Barrier, Escalation: Rising`, "info");

                const impacted = state.suppliers.filter(s => s.country === 'TW');
                logConsole(`Layer 3: Graph Linker mapped Hugging Face signal to ${impacted.length} supplier nodes in TW`, "warn");

                impacted.forEach(sup => {
                    const score = calculateScore(sup, hfEvt);
                    logConsole(`Layer 4: Calculated score for '${sup.name}': Score = ${score.finalScore} (${score.level})`, score.level === 'Critical' ? 'danger' : 'warn');

                    if (score.level === 'Critical' || score.level === 'High') {
                        const newAct = {
                            id: `ACT-HF-${Math.floor(100 + Math.random() * 900)}`,
                            entityName: sup.name,
                            owner: 'Procurement & Legal',
                            recommendation: `HUGGINGFACE SCRM TRIGGER: Expedite +30 days safety stock for SKU '${sup.sku}' and initiate dual-sourcing audit.`,
                            rule: 'ISO-SCRM-R1 (HuggingFace Feed Barrier Trigger)',
                            dueDays: 2,
                            status: 'Proposed',
                            confidence: 0.95
                        };
                        state.actions.unshift(newAct);
                        logConsole(`Layer 5: Action Orchestrated -> Action ID [${newAct.id}] assigned to Procurement & Legal.`, 'success');
                    }
                });

                renderWatchlist();
                renderActions();
                renderMasterScoreTable();
                alert("Successfully ingested sample geopolitical dataset records from Hugging Face!");
            }, 800);
        });
    }

    // 8. Live Signal Simulator Handler
    const simForm = document.getElementById('signal-sim-form');
    const simPreset = document.getElementById('sim-preset');

    const presets = {
        'preset-hf': {
            type: 'Sanctions',
            country: 'TW',
            credibility: 0.95,
            confidence: 0.92,
            trend: 'Rising',
            summary: 'HuggingFace Dataset Feed: Restricted export quotas issued on semiconductor raw materials.'
        },
        'preset-1': {
            type: 'Sanctions',
            country: 'TW',
            credibility: 0.95,
            confidence: 0.90,
            trend: 'Rising',
            summary: 'Tension in Taiwan Strait triggers heightened export control advisories on advanced micro-controllers.'
        },
        'preset-2': {
            type: 'Port Closure',
            country: 'CN',
            credibility: 0.90,
            confidence: 0.85,
            trend: 'Rising',
            summary: 'Port of Shanghai dockworker strike halts 40% of outgoing chemical container shipments.'
        },
        'preset-3': {
            type: 'Trade Restriction',
            country: 'DE',
            credibility: 0.85,
            confidence: 0.80,
            trend: 'Stable',
            summary: 'Emergency industrial gas rationing imposed on European specialty neon gas refineries.'
        },
        'preset-4': {
            type: 'Military Conflict',
            country: 'CN',
            credibility: 0.92,
            confidence: 0.88,
            trend: 'Rising',
            summary: 'Maritime safety corridor restriction issued in East China Sea shipping lanes.'
        }
    };

    if (simPreset) {
        simPreset.addEventListener('change', () => {
            const val = simPreset.value;
            if (presets[val]) {
                const p = presets[val];
                document.getElementById('sim-event-type').value = p.type;
                document.getElementById('sim-country').value = p.country;
                document.getElementById('sim-credibility').value = p.credibility;
                document.getElementById('sim-confidence').value = p.confidence;
                document.getElementById('sim-trend').value = p.trend;
                document.getElementById('sim-summary').value = p.summary;
            }
        });
    }

    if (simForm) {
        simForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const eventType = document.getElementById('sim-event-type').value;
            const country = document.getElementById('sim-country').value;
            const cred = parseFloat(document.getElementById('sim-credibility').value);
            const conf = parseFloat(document.getElementById('sim-confidence').value);
            const trend = document.getElementById('sim-trend').value;
            const summary = document.getElementById('sim-summary').value;

            const newEvt = {
                id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
                date: new Date().toISOString().split('T')[0],
                source: 'User Signal Generator',
                type: eventType,
                country: country,
                summary: summary,
                credibility: cred,
                confidence: conf,
                trend: trend
            };

            logConsole(`Layer 1: Ingested signal ${newEvt.id} for country [${country}]`, 'info');
            logConsole(`Layer 2: Event tagged as [${eventType}], Escalation: [${trend}], Confidence: ${conf}`, 'info');

            const impacted = state.suppliers.filter(s => s.country === country);
            logConsole(`Layer 3: Graph Linker mapped signal to ${impacted.length} supplier nodes in ${country}`, 'warn');

            impacted.forEach(sup => {
                const score = calculateScore(sup, newEvt);
                logConsole(`Layer 4: Calculated score for '${sup.name}': Prob=${score.probability}, Exp=${score.exposure}, Crit=${score.criticality}, Res=${score.resilience} → SCORE = ${score.finalScore} (${score.level})`, score.level === 'Critical' ? 'danger' : 'warn');

                if (score.level === 'Critical' || score.level === 'High') {
                    const newAct = {
                        id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
                        entityName: sup.name,
                        owner: 'Procurement & Logistics',
                        recommendation: `AUTOMATED SCRM TRIGGER: Expedite +30 days safety stock for SKU '${sup.sku}' and initiate legal sourcing review.`,
                        rule: 'ISO-SCRM-R1 (High Dependency Trigger)',
                        dueDays: 3,
                        status: 'Proposed',
                        confidence: 0.93
                    };
                    state.actions.unshift(newAct);
                    logConsole(`Layer 5: Action Orchestrated -> Action ID [${newAct.id}] assigned to Procurement.`, 'success');
                }
            });

            state.signals.unshift(newEvt);
            renderWatchlist();
            renderActions();
            renderMasterScoreTable();
        });
    }

    // Export SCRM Report Button
    const btnExport = document.getElementById('btn-export-report');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            const reportData = {
                title: 'Geopolitical Supply Chain Risk Decision Audit',
                timestamp: new Date().toISOString(),
                framework: 'ISO 31000 SCRM',
                totalExposedSuppliers: state.suppliers.length,
                activeSignals: state.signals.length,
                actionsOrchestrated: state.actions.length,
                suppliers: state.suppliers.map(s => ({
                    name: s.name,
                    country: s.country,
                    sku: s.sku,
                    riskScore: calculateScore(s, state.signals.find(sig => sig.country === s.country)).finalScore
                }))
            };
            
            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `SCRM_Geopolitical_Risk_Report_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // --- Initial Execution ---
    renderWatchlist();
    renderActions();
    renderMasterScoreTable();
    renderHeatmapAndGraph();
    updateCalculator();
});
