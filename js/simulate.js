// Split from index.html in Phase 4 (GSD). See .planning/phases/04-js-css-separation/PLAN.md.
// Concern: random-walk simulation + controls
import { formatCurrency } from './charts-core.js';
    // 1. GLOBAL STATE for Random Walk
    let rwSimulationData = null; // Stores data from the main backtest
    // Fed by main.js after every calculateMetrics() run (fix: was never assigned).
    export function setRandomWalkData(historyWithoutWithdrawals) {
        rwSimulationData = historyWithoutWithdrawals ? { historyWithoutWithdrawals } : null;
    }
    export function getSeededRNG(seed) {
        return function() {
            var t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    export function getNormalRandom(rng) {
        let u = 0, v = 0;
        while(u === 0) u = rng(); 
        while(v === 0) v = rng();
        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    }

    // 3. CORE FUNCTION: Execute Simulation & Render Chart
    export function runRandomWalkSimulation() {
        // Validation
        if (!rwSimulationData || !rwSimulationData.historyWithoutWithdrawals) {
            alert("⚠️ Please wait for the main strategy to finish calculating, then try again.");
            return;
        }

        const chartDom = document.getElementById('random-walk-chart');
        if(!chartDom) return;
        
        // Initialize Chart
        let chart = echarts.getInstanceByDom(chartDom);
        if(!chart) chart = echarts.init(chartDom);
        
        chart.showLoading();

        // Get Inputs
        const steps = parseInt(document.getElementById('rw-steps').value) || 120;
        const paths = parseInt(document.getElementById('rw-paths').value) || 50;
        const seedVal = parseInt(document.getElementById('rw-seed').value) || 12345;
        
        // Get Historical Data Stats (Drift & Volatility)
        const hist = rwSimulationData.historyWithoutWithdrawals;
        const startValue = hist[hist.length-1]; // Start from current portfolio value
        
        // Calculate Log Returns to determine Drift and Volatility
        const rets = [];
        for(let i=1; i<hist.length; i++) {
            if(hist[i-1] > 0) rets.push(Math.log(hist[i]/hist[i-1])); 
        }
        
        if(rets.length === 0) {
            chart.hideLoading();
            alert("Not enough historical data to simulate.");
            return;
        }

        const mean = rets.reduce((a,b)=>a+b,0)/rets.length;
        const vol = Math.sqrt(rets.reduce((s,x)=>s+Math.pow(x-mean,2),0)/(rets.length-1));

        // Initialize RNG
        const rng = getSeededRNG(seedVal);
        
        // Generate Paths
        const allPaths = [];
        const finalValues = [];
        const xLabels = Array.from({length: steps+1}, (_, i) => i);

        for(let p=0; p<paths; p++) {
            const path = [startValue];
            let current = startValue;
            
            for(let t=1; t<=steps; t++) {
                const shock = getNormalRandom(rng);
                // Geometric Brownian Motion Formula
                const ret = mean + (vol * shock);
                current = current * Math.exp(ret);
                path.push(current);
            }
            allPaths.push(path);
            finalValues.push(current);
        }

        // Calculate Stats for Verdict
        finalValues.sort((a,b) => a-b);
        const medianPathData = [];
        // Construct visual median line point-by-point
        for(let t=0; t<=steps; t++) {
            const timeSlice = allPaths.map(p => p[t]).sort((a,b)=>a-b);
            medianPathData.push(timeSlice[Math.floor(timeSlice.length * 0.5)]);
        }

        const successCount = finalValues.filter(v => v > startValue).length;
        const winRate = (successCount / paths) * 100;
        const p10 = finalValues[Math.floor(paths * 0.1)];
        const p90 = finalValues[Math.floor(paths * 0.9)];

        // Update Text Verdict
        const verdictEl = document.getElementById('rw-verdict');
        if(verdictEl) {
            verdictEl.innerHTML = `
                Win Probability: <span style="color:${winRate>50?'#27ae60':'#c0392b'}">${winRate.toFixed(1)}%</span> | 
                Worst Case (10%): <span style="color:#c0392b">${formatCurrency(p10)}</span> | 
                Best Case (90%): <span style="color:#27ae60">${formatCurrency(p90)}</span>
            `;
        }

        // Build Chart Series
        const series = [];
        
        // 1. Add background spaghetti lines
        allPaths.forEach(path => {
            series.push({
                type: 'line',
                data: path,
                showSymbol: false,
                lineStyle: { width: 1, opacity: 0.15, color: '#8e44ad' },
                animation: false,
                silent: true // Performance boost
            });
        });

        // 2. Add Median Line (Bold)
        series.push({
            name: 'Median Scenario',
            type: 'line',
            data: medianPathData,
            showSymbol: false,
            lineStyle: { width: 3, color: '#2c3e50' },
            z: 10
        });

        const option = {
            title: { text: `Projecting ${steps} Months Forward`, left: 'center', top: 10, textStyle: { fontSize: 14 } },
            tooltip: { trigger: 'axis', formatter: (p) => {
                const med = p.find(x => x.seriesName === 'Median Scenario');
                return med ? `Month ${med.axisValue}<br/>Median Value: <b>${formatCurrency(med.value)}</b>` : '';
            }},
            xAxis: { name: 'Months From Now', type: 'category', data: xLabels },
            yAxis: { 
                name: 'Portfolio Value', type: 'value', scale: true,
                axisLabel: { formatter: (v) => new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(v) }
            },
            series: series,
            grid: { top: 50, right: 30, bottom: 30, left: 60 }
        };

        chart.hideLoading();
        chart.setOption(option, true); // true = Destructive update (clear old lines)
    }

    // 4. SETUP FUNCTION: Hooks up the sliders and button
    export function setupRandomWalkControls() {
        console.log("Initializing Random Walk Controls...");
        
        // Link Sliders to Text displays
        const stepsIn = document.getElementById('rw-steps');
        const stepsOut = document.getElementById('rw-steps-val');
        if(stepsIn && stepsOut) stepsIn.addEventListener('input', (e) => stepsOut.textContent = e.target.value);

        const pathsIn = document.getElementById('rw-paths');
        const pathsOut = document.getElementById('rw-paths-val');
        if(pathsIn && pathsOut) pathsIn.addEventListener('input', (e) => pathsOut.textContent = e.target.value);

        // Link Button
        const btn = document.getElementById('run-rw-btn');
        if(btn) {
            // Remove old listeners to prevent duplicates if function called multiple times
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent detail/summary toggle if inside one
                console.log("Running Random Walk...");
                runRandomWalkSimulation();
            });
        }
    }

    // Phase 2: standalone calculation engine. Takes the active merged dataset
    // ([{date, EQUITY, GOLD, BENCHMARK}]) as an argument instead of reading the
    // module-global `data`, purges previous-run state on every call, and returns
    // everything the render layer needs. (Distinct from module-level
    // calcMetrics(values, dates, cashFlows) used inside.)
