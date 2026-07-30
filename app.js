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
            },
            {
                id: 'SUP-105',
                name: 'Foxconn Electronics',
                country: 'TW',
                sku: 'SKU-3321 (Industrial Motherboard)',
                plant: 'PLANT-US-1 (Austin High-Tech Assembly)',
                dependency: 55.0,
                spendShare: 0.25,
                invCover: 20.0,
                soleSource: false,
                revImpactM: 25.0,
                stopRisk: 0.70,
                altSources: 2,
                esgRating: 'A',
                creditScore: 81
            },
            {
                id: 'SUP-106',
                name: 'Seoul Semiconductors',
                country: 'KR',
                sku: 'SKU-5544 (OLED Touch Displays)',
                plant: 'PLANT-KR-2 (Seoul Display Fab)',
                dependency: 40.0,
                spendShare: 0.15,
                invCover: 30.0,
                soleSource: false,
                revImpactM: 10.0,
                stopRisk: 0.30,
                altSources: 3,
                esgRating: 'B+',
                creditScore: 78
            },
            {
                id: 'SUP-107',
                name: 'Tokyo Motors',
                country: 'JP',
                sku: 'SKU-4433 (Precision Actuators)',
                plant: 'PLANT-JP-1 (Nagoya Robotics)',
                dependency: 20.0,
                spendShare: 0.10,
                invCover: 60.0,
                soleSource: false,
                revImpactM: 5.0,
                stopRisk: 0.20,
                altSources: 5,
                esgRating: 'AA',
                creditScore: 92
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

        // Force ECharts to resize when its container becomes visible
        if (targetTab === 'heatmap') {
            setTimeout(() => {
                if (typeof heatmapInstance !== 'undefined' && heatmapInstance) heatmapInstance.resize();
                if (typeof graphInstance !== 'undefined' && graphInstance) graphInstance.resize();
            }, 100);
        }
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
    let heatmapInstance = null;
    let graphInstance = null;
    
    function renderHeatmapAndGraph() {
        const mapContainer = document.getElementById('heatmap-container');
        const graphContainer = document.getElementById('graph-view-container');

        if (mapContainer) {
            if (!heatmapInstance) {
                heatmapInstance = echarts.init(mapContainer);
                window.addEventListener('resize', () => heatmapInstance.resize());
            }

            const countryScores = {};
            state.suppliers.forEach(s => {
                const sig = state.signals.find(sig => sig.country === s.country);
                const riskInfo = calculateScore(s, sig);
                if (!countryScores[s.country] || riskInfo.finalScore > countryScores[s.country]) {
                    countryScores[s.country] = riskInfo.finalScore;
                }
            });

            // Map ISO2 to full names for ECharts world map
            const nameMap = {
                'CN': 'China',
                'TW': 'Taiwan',
                'DE': 'Germany',
                'NL': 'Netherlands',
                'US': 'United States',
                'KR': 'South Korea',
                'JP': 'Japan'
            };

            const scatterData = [];
            const coords = {
                'China': [104.1954, 35.8617],
                'Taiwan': [120.9605, 23.6978],
                'Germany': [10.4515, 51.1657],
                'Netherlands': [5.2913, 52.1326],
                'South Korea': [127.7669, 35.9078],
                'Japan': [138.2529, 36.2048]
            };

            for (const [code, score] of Object.entries(countryScores)) {
                const countryName = nameMap[code] || code;
                scatterData.push({
                    name: countryName,
                    value: [...(coords[countryName]||[0,0]), score],
                    riskLevel: score > 75 ? 'Critical' : (score > 40 ? 'High' : 'Low')
                });
            }

            const option = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        if (params.seriesType === 'effectScatter' || params.seriesType === 'scatter') {
                            return `<strong>${params.data.name}</strong><br/>Risk Score: ${params.data.value[2].toFixed(1)} <span class="badge ${params.data.riskLevel==='Critical'?'badge-danger':(params.data.riskLevel==='High'?'badge-warning':'badge-success')}">${params.data.riskLevel}</span>`;
                        }
                        return params.name;
                    },
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    textStyle: { color: '#fff' }
                },
                geo: {
                    map: 'world',
                    roam: true,
                    zoom: 1.2,
                    itemStyle: {
                        areaColor: '#1e293b',
                        borderColor: '#0ea5e9',
                        borderWidth: 0.5
                    },
                    emphasis: {
                        itemStyle: { areaColor: '#334155' },
                        label: { show: false }
                    }
                },
                series: [
                    {
                        name: 'High Risk Nodes',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: scatterData.filter(d => d.value[2] > 40),
                        symbolSize: 8, // Increased by ~50%
                        itemStyle: {
                            color: function(params) {
                                return params.data.riskLevel === 'Critical' ? '#ef4444' : '#f59e0b';
                            },
                            shadowBlur: 8,
                            shadowColor: '#000'
                        },
                        showEffectOn: 'render',
                        rippleEffect: { brushType: 'stroke', scale: 2.5 }, 
                        zlevel: 1
                    },
                    {
                        name: 'Safe Nodes',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: scatterData.filter(d => d.value[2] <= 40),
                        symbolSize: 6, // Increased by 50%
                        itemStyle: { color: '#10b981' }
                    }
                ]
            };
            heatmapInstance.setOption(option);
        }

        if (graphContainer) {
        if (graphContainer) {
            // Destroy any existing ECharts instance
            if (graphInstance) {
                graphInstance.dispose();
                graphInstance = null;
            }

            let htmlCards = '';
            
            // Sort suppliers by dependency (highest first)
            const sortedSuppliers = [...state.suppliers].sort((a, b) => b.dependency - a.dependency);

            sortedSuppliers.forEach(s => {
                const sig = state.signals.find(sig => sig.country === s.country);
                const riskInfo = calculateScore(s, sig);
                let countryBadgeClass = 'badge-success'; // Low Risk
                if (riskInfo.finalScore > 75) countryBadgeClass = 'badge-danger'; // Critical
                else if (riskInfo.finalScore > 40) countryBadgeClass = 'badge-warning'; // High

                htmlCards += `
                    <div class="dependency-card">
                        <div class="dep-path">
                            <span class="badge ${countryBadgeClass}"><i class="fa-solid fa-globe"></i> ${s.country}</span> 
                            <i class="fa-solid fa-arrow-right dep-arrow"></i> 
                            <span class="dep-node"><i class="fa-solid fa-building"></i> ${s.name}</span>
                            <i class="fa-solid fa-arrow-right dep-arrow"></i> 
                            <span class="dep-node"><i class="fa-solid fa-box"></i> ${s.sku.split('(')[0].trim()}</span>
                        </div>
                        <div class="dep-metrics">
                            <div class="dep-bar-container">
                                <div class="dep-bar-fill" style="width: ${s.dependency}%; background: ${s.dependency > 50 ? '#ef4444' : (s.dependency > 20 ? '#f59e0b' : '#10b981')}"></div>
                            </div>
                            <span class="dep-value">${s.dependency}% Dependency Flow</span>
                        </div>
                    </div>
                `;
            });

            graphContainer.innerHTML = htmlCards;
        }
    }
    }

    // 6. What-If Calculator Sliders
    const sliderP = document.getElementById('slider-p');
    const sliderE = document.getElementById('slider-e');
    const sliderC = document.getElementById('slider-c');
    const sliderR = document.getElementById('slider-r');
    const sliderAlt = document.getElementById('slider-alt');

    if (sliderP) sliderP.addEventListener('input', updateCalculator);
    if (sliderE) sliderE.addEventListener('input', updateCalculator);
    if (sliderC) sliderC.addEventListener('input', updateCalculator);
    if (sliderR) sliderR.addEventListener('input', updateCalculator);
    if (sliderAlt) sliderAlt.addEventListener('input', updateCalculator);

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
        const grossRisk = (p * e * c) * 100.0;
        const rawScore = (p * e * c) / resVal;
        const score = Math.min(Math.round(rawScore * 100.0 * 10) / 10, 100.0);

        const scoreDisplay = document.getElementById('calc-result-score');
        const levelDisplay = document.getElementById('calc-result-level');
        const grossDisplay = document.getElementById('calc-gross');
        const resDisplay = document.getElementById('calc-resilience');

        if (scoreDisplay) scoreDisplay.textContent = score.toFixed(1);
        if (grossDisplay) grossDisplay.textContent = grossRisk.toFixed(1);
        if (resDisplay) resDisplay.textContent = resVal.toFixed(2);
        
        let levelText = 'Low Exposure';
        let badgeClass = 'badge-emerald';
        if (score >= 70) { levelText = 'Critical Exposure'; badgeClass = 'badge-danger'; }
        else if (score >= 50) { levelText = 'High Exposure'; badgeClass = 'badge-warning'; }
        else if (score >= 25) { levelText = 'Medium Exposure'; badgeClass = 'badge-info'; }

        if (levelDisplay) {
            levelDisplay.textContent = levelText;
            levelDisplay.className = `calc-badge badge ${badgeClass}`;
        }
    }

    [sliderP, sliderE, sliderC, sliderR, sliderAlt].forEach(s => {
        if (s) s.addEventListener('input', updateCalculator);
    });

    const supplierSelect = document.getElementById('calc-supplier-select');
    if (supplierSelect) {
        state.suppliers.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = `${s.name} (${s.sku.split('(')[0].trim()})`;
            supplierSelect.appendChild(opt);
        });

        supplierSelect.addEventListener('change', (e) => {
            const supplierId = e.target.value;
            if (!supplierId) return; // Generic Simulation

            const s = state.suppliers.find(sup => sup.id === supplierId);
            if (s) {
                // Determine probability based on current signals for that country
                const sig = state.signals.find(sig => sig.country === s.country);
                let p = s.stopRisk * 0.5; // Base probability without signal
                if (sig) p = sig.credibility; // Override with active signal probability
                
                if (sliderP) sliderP.value = p;
                if (sliderE) sliderE.value = s.dependency;
                if (sliderC) sliderC.value = s.stopRisk;
                if (sliderR) sliderR.value = s.invCover;
                if (sliderAlt) sliderAlt.value = s.altSources;
                updateCalculator();
            }
        });
    }

    // 7. Hugging Face Dataset Ingest Handler
    const btnHfIngest = document.getElementById('btn-hf-ingest');
    const simConsole = document.getElementById('sim-console-output');

    function logConsole(msg, type = 'info', payload = null) {
        if (!simConsole) return;
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        simConsole.appendChild(line);
        
        if (payload) {
            const feedContainer = document.getElementById('live-news-feed');
            if (feedContainer) {
                if (feedContainer.innerHTML.includes('Waiting for live news ingestion')) {
                    feedContainer.innerHTML = '';
                }
                const card = document.createElement('div');
                card.className = 'glass-card';
                card.style.padding = '15px';
                card.style.borderLeft = '4px solid var(--color-emerald)';
                
                card.innerHTML = `
                    <div style="margin-bottom: 8px;"><strong>📍 Location:</strong> ${payload.country || 'Global'}</div>
                    <div style="margin-bottom: 8px;"><strong>⚠️ Event Type:</strong> <span style="color: var(--color-warning);">${payload.type || 'Alert'}</span></div>
                    <div style="margin-bottom: 12px; font-size: 1.05em;"><strong>📰 Headline:</strong> <span style="color: #fff;">${payload.summary || 'No details provided.'}</span></div>
                    <div style="margin-bottom: 12px; font-size: 0.85em; color: var(--color-slate);"><strong>📡 Source:</strong> ${payload.source || 'External System'}</div>
                    <div style="display: flex; gap: 15px; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.85em; color: var(--color-sky);">
                        <div><strong>AI Confidence:</strong> ${(payload.confidence ? payload.confidence * 100 : 0).toFixed(0)}%</div>
                        <div><strong>Trend:</strong> ${payload.trend || 'Stable'}</div>
                        <div><strong>Date:</strong> ${payload.date || new Date().toLocaleDateString()}</div>
                    </div>
                `;
                feedContainer.prepend(card);
            }
        }
        
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
                logConsole(`Layer 1: Successfully ingested HuggingFace record ${hfEvt.id}`, "success", hfEvt);
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
                updateKPICounters();
                alert("Successfully ingested sample geopolitical dataset records from Hugging Face!\n\nClick OK, then scroll down and look at the black Terminal Console to see the raw JSON data that was ingested.");
            }, 800);
        });
    }

    // 7b. Live RSS Feed Ingest Handler
    const btnRssIngest = document.getElementById('btn-rss-ingest');
    if (btnRssIngest) {
        btnRssIngest.addEventListener('click', async () => {
            logConsole("Connecting to BBC World News Live RSS Feed via Python Backend...", "info");
            
            try {
                const response = await fetch('/api/live-risks');
                const newLiveEvents = await response.json();
                
                logConsole(`Layer 1: Successfully ingested ${newLiveEvents.length} live records from internet.`, "success");
                
                newLiveEvents.forEach(evt => {
                    logConsole(`Layer 2: Event tagged as ${evt.type}, Source: ${evt.source}`, "info", evt);
                    
                    state.signals.unshift(evt);
                    
                    const impacted = state.suppliers.filter(s => s.country === evt.country);
                    logConsole(`Layer 3: Graph Linker mapped live signal to ${impacted.length} supplier nodes in ${evt.country}`, "warn");
                    
                    impacted.forEach(sup => {
                        const score = calculateScore(sup, evt);
                        logConsole(`Layer 4: Calculated score for '${sup.name}': Score = ${score.finalScore} (${score.level})`, score.level === 'Critical' ? 'danger' : 'warn');

                        if (score.level === 'Critical' || score.level === 'High') {
                            const newAct = {
                                id: `ACT-RSS-${Math.floor(100 + Math.random() * 900)}`,
                                entityName: sup.name,
                                owner: 'Procurement & Legal',
                                recommendation: `LIVE SCRM TRIGGER: Expedite safety stock for SKU '${sup.sku}' based on live geopolitical event.`,
                                rule: `ISO-SCRM-R1 (Live Event: ${evt.type})`,
                                dueDays: 1,
                                status: 'Proposed',
                                confidence: evt.confidence
                            };
                            state.actions.unshift(newAct);
                            logConsole(`Layer 5: Action Orchestrated -> Action ID [${newAct.id}] assigned.`, 'success');
                        }
                    });
                });
                
                renderWatchlist();
                renderActions();
                renderMasterScoreTable();
                updateKPICounters();
                
                alert(`Successfully pulled ${newLiveEvents.length} live news events from the internet! \n\nClick OK, then scroll down and look at the black Terminal Console to see the raw JSON data for all ${newLiveEvents.length} feeds!`);
                
            } catch (error) {
                logConsole(`Error fetching live RSS feed: ${error}`, "danger");
                alert("Failed to fetch live RSS feed. Make sure the Python backend (server.py) is running on port 8000.");
            }
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
            updateKPICounters();
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

    // --- Active Signals Modal Logic ---
    const signalsModal = document.getElementById('signals-modal');
    const closeSignalsModalBtn = document.getElementById('close-signals-modal');

    function renderSignalsModal() {
        const tbody = document.querySelector('#active-signals-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        state.signals.forEach(sig => {
            const impactedSkus = state.suppliers
                .filter(s => s.country === sig.country)
                .map(s => `<code>${s.sku}</code>`)
                .join('<br>');

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${sig.date}</td>
                <td><span class="badge badge-info">${sig.source.split(' ')[0]}</span></td>
                <td><strong>${sig.type}</strong><br><span style="font-size:11px; color:var(--text-muted);">${sig.summary}</span></td>
                <td><strong class="color-warning">${sig.country}</strong></td>
                <td><span class="badge ${sig.trend === 'Rising' ? 'badge-danger' : 'badge-warning'}">${sig.trend}</span></td>
                <td>${impactedSkus || '<span style="color:var(--text-muted)">None</span>'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function openSignalsModal() {
        renderSignalsModal();
        if (signalsModal) signalsModal.classList.add('active');
    }

    if (closeSignalsModalBtn) {
        closeSignalsModalBtn.addEventListener('click', () => {
            if (signalsModal) signalsModal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === signalsModal) {
            signalsModal.classList.remove('active');
        }
    });

    // --- Critical SKUs Modal Logic ---
    const skusModal = document.getElementById('skus-modal');
    const closeSkusModalBtn = document.getElementById('close-skus-modal');

    function renderSkusModal() {
        const tbody = document.querySelector('#skus-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        state.suppliers.forEach(s => {
            const riskInfo = calculateScore(s, state.signals.find(sig => sig.country === s.country));
            let scoreBadgeClass = 'badge-success';
            if (riskInfo.finalScore > 75) scoreBadgeClass = 'badge-danger';
            else if (riskInfo.finalScore > 40) scoreBadgeClass = 'badge-warning';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${s.sku}</strong></td>
                <td>${s.name}</td>
                <td><strong class="color-warning">${s.country}</strong></td>
                <td>${s.dependency}%</td>
                <td>${s.invCover} Days</td>
                <td><span class="badge ${scoreBadgeClass}">${riskInfo.finalScore.toFixed(1)}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    function openSkusModal() {
        renderSkusModal();
        if (skusModal) skusModal.classList.add('active');
    }

    if (closeSkusModalBtn) {
        closeSkusModalBtn.addEventListener('click', () => {
            if (skusModal) skusModal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === skusModal) {
            skusModal.classList.remove('active');
        }
    });

    // --- Revenue Impact Modal Logic ---
    const revenueModal = document.getElementById('revenue-modal');
    const closeRevenueModalBtn = document.getElementById('close-revenue-modal');

    function renderRevenueModal() {
        const tbody = document.querySelector('#revenue-table tbody');
        const totalCell = document.getElementById('revenue-total-cell');
        if (!tbody || !totalCell) return;
        tbody.innerHTML = '';

        let totalRevenue = 0;

        state.suppliers.forEach(s => {
            totalRevenue += s.revImpactM;
            const soleSourceBadge = s.soleSource ? '<span class="badge badge-danger">Yes</span>' : '<span class="badge badge-success">No</span>';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${s.name}</strong></td>
                <td><code>${s.sku}</code></td>
                <td>${s.dependency}%</td>
                <td>${soleSourceBadge}</td>
                <td style="color: var(--color-emerald); font-weight: bold;">$${s.revImpactM.toFixed(1)}M</td>
            `;
            tbody.appendChild(tr);
        });

        totalCell.textContent = `$${totalRevenue.toFixed(1)}M`;
    }

    function openRevenueModal() {
        renderRevenueModal();
        if (revenueModal) revenueModal.classList.add('active');
    }

    if (closeRevenueModalBtn) {
        closeRevenueModalBtn.addEventListener('click', () => {
            if (revenueModal) revenueModal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === revenueModal) {
            revenueModal.classList.remove('active');
        }
    });

    // --- KPI Navigation Triggers ---
    const kpiSignalsBtn = document.getElementById('btn-kpi-signals');
    if (kpiSignalsBtn) kpiSignalsBtn.addEventListener('click', openSignalsModal);

    const kpiSuppliersBtn = document.getElementById('btn-kpi-suppliers');
    if (kpiSuppliersBtn) kpiSuppliersBtn.addEventListener('click', openSuppliersModal);

    // --- Exposed Suppliers Modal Logic ---
    const suppliersModal = document.getElementById('suppliers-modal');
    const closeSuppliersModalBtn = document.getElementById('close-suppliers-modal');

    function renderSuppliersModal() {
        const tbody = document.querySelector('#exposed-suppliers-table tbody');
        if (!tbody) return;
        
        let html = '';
        
        // Sort suppliers by highest risk
        const sortedSuppliers = [...state.suppliers].sort((a, b) => {
            const sigA = state.signals.find(sig => sig.country === a.country);
            const scoreA = calculateScore(a, sigA).finalScore;
            
            const sigB = state.signals.find(sig => sig.country === b.country);
            const scoreB = calculateScore(b, sigB).finalScore;
            
            return scoreB - scoreA;
        });

        sortedSuppliers.forEach(s => {
            const sig = state.signals.find(sig => sig.country === s.country);
            const riskInfo = calculateScore(s, sig);
            
            let scoreBadge = 'badge-success';
            if (riskInfo.finalScore > 75) scoreBadge = 'badge-danger';
            else if (riskInfo.finalScore > 40) scoreBadge = 'badge-warning';

            html += `
                <tr>
                    <td><strong>${s.name}</strong></td>
                    <td>${s.country}</td>
                    <td>${s.plant}</td>
                    <td>${s.dependency}%</td>
                    <td><span class="badge ${scoreBadge}">${riskInfo.finalScore.toFixed(1)}</span></td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    function openSuppliersModal() {
        renderSuppliersModal();
        if (suppliersModal) suppliersModal.classList.add('active');
    }

    if (closeSuppliersModalBtn) {
        closeSuppliersModalBtn.addEventListener('click', () => {
            if (suppliersModal) suppliersModal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === suppliersModal) {
            suppliersModal.classList.remove('active');
        }
    });

    const kpiSkusBtn = document.getElementById('btn-kpi-skus');
    if (kpiSkusBtn) kpiSkusBtn.addEventListener('click', openSkusModal);

    const kpiRevenueBtn = document.getElementById('btn-kpi-revenue');
    if (kpiRevenueBtn) kpiRevenueBtn.addEventListener('click', openRevenueModal);

    const kpiActionsBtn = document.getElementById('btn-kpi-actions');
    if (kpiActionsBtn) kpiActionsBtn.addEventListener('click', () => switchTab('actions'));

    function updateKPICounters() {
        const kpiSignals = document.getElementById('kpi-signals');
        const kpiSuppliers = document.getElementById('kpi-suppliers');
        const kpiSkus = document.getElementById('kpi-skus');
        const kpiRevenue = document.getElementById('kpi-revenue');
        const kpiActions = document.getElementById('kpi-actions');

        if (kpiSignals) kpiSignals.textContent = state.signals.length;
        if (kpiSuppliers) kpiSuppliers.textContent = state.suppliers.length;
        if (kpiSkus) kpiSkus.textContent = state.suppliers.map(s => s.sku).filter((v, i, a) => a.indexOf(v) === i).length;
        if (kpiActions) kpiActions.textContent = state.actions.length;
        
        if (kpiRevenue) {
            const totalRev = state.suppliers.reduce((sum, s) => sum + s.revImpactM, 0);
            kpiRevenue.textContent = `$${totalRev.toFixed(1)}M`;
        }
    }

    // --- Initial Execution ---
    renderWatchlist();
    renderActions();
    renderMasterScoreTable();
    renderHeatmapAndGraph();
    updateCalculator();
    updateKPICounters();
});

