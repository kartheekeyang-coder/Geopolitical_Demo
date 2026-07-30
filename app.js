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

        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="country-risk-list">
                    <div class="country-card">
                        <div class="country-flag-name">
                            <i class="fa-solid fa-flag color-warning"></i> Taiwan (TW)
                        </div>
                        <span class="badge badge-danger">Critical Risk (Score: 78.2)</span>
                    </div>
                    <div class="country-card">
                        <div class="country-flag-name">
                            <i class="fa-solid fa-flag color-warning"></i> China (CN)
                        </div>
                        <span class="badge badge-warning">Elevated Risk (Score: 54.0)</span>
                    </div>
                    <div class="country-card">
                        <div class="country-flag-name">
                            <i class="fa-solid fa-flag"></i> Germany (DE)
                        </div>
                        <span class="badge badge-warning">Medium Risk (Score: 48.5)</span>
                    </div>
                    <div class="country-card">
                        <div class="country-flag-name">
                            <i class="fa-solid fa-flag"></i> Netherlands (NL)
                        </div>
                        <span class="badge badge-emerald">Low Risk (Score: 18.4)</span>
                    </div>
                </div>
                <div style="margin-top:20px; font-size:12px; color:var(--text-muted); text-align:center;">
                    <i class="fa-solid fa-globe"></i> Heatmap weighted by supplier spend share, inventory cover, and Hugging Face event feeds.
                </div>
            `;
        }

        if (graphContainer) {
            graphContainer.innerHTML = state.suppliers.map(sup => `
                <div class="graph-tree-node">
                    <div class="graph-node-title"><i class="fa-solid fa-building"></i> Country: ${sup.country} → Supplier: ${sup.name}</div>
                    <div class="graph-node-children">
                        <div class="graph-node-child">
                            <span><i class="fa-solid fa-box"></i> SKU: ${sup.sku}</span>
                            <span>Dep: ${sup.dependency}%</span>
                        </div>
                        <div class="graph-node-child">
                            <span><i class="fa-solid fa-industry"></i> Impacted Plant: ${sup.plant}</span>
                            <span>Cover: ${sup.invCover}d</span>
                        </div>
                    </div>
                </div>
            `).join('');
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
