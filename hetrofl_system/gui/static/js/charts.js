// HETROFL System Plotting Functions
// This module provides enhanced plotting capabilities using Plotly.js

// Global color palette for consistent styling
const COLORS = {
    global: '#e74c3c',       // Red for global model
    xgboost: '#3498db',      // Blue for XGBoost
    catboost: '#2ecc71',     // Green for CatBoost
    random_forest: '#f39c12', // Orange for Random Forest
    background: '#f8f9fa',   // Light background
    grid: '#eaecef',         // Grid lines
    text: '#2c3e50'          // Text color
};

// Plot size defaults
const PLOT_CONFIG = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d']
};

// Error handling for plots
function handlePlotError(containerId, errorMessage) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="plot-error">
                <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                <h5>Error Loading Plot</h5>
                <p>${errorMessage}</p>
                <button class="btn btn-sm btn-outline-danger mt-2" onclick="regeneratePlot('${containerId}')">
                    <i class="fas fa-sync-alt me-1"></i> Retry
                </button>
            </div>
        `;
    }
}

// Loading indicator for plots
function showPlotLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner mb-3"></div>
                <p>Loading plot data...</p>
            </div>
        `;
    }
}

// Create real-time accuracy comparison chart
function createAccuracyComparisonChart(containerId, metricsHistory) {
    try {
        showPlotLoading(containerId);
        
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Prepare data
        const traces = [];
        
        // Global model trace
        if (metricsHistory.global && metricsHistory.global.length > 0) {
            const rounds = metricsHistory.global.map((_, i) => i + 1);
            const accuracy = metricsHistory.global.map(m => m.accuracy * 100); // Convert to percentage
            
            traces.push({
                x: rounds,
                y: accuracy,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Global MLP',
                line: {
                    color: COLORS.global,
                    width: 4
                },
                marker: {
                    size: 8,
                    symbol: 'circle'
                }
            });
        }
        
        // Local models traces
        if (metricsHistory.local) {
            Object.entries(metricsHistory.local).forEach(([modelName, metrics]) => {
                if (metrics && metrics.length > 0) {
                    const rounds = metrics.map((_, i) => i + 1);
                    const accuracy = metrics.map(m => m.accuracy * 100); // Convert to percentage
                    
                    traces.push({
                        x: rounds,
                        y: accuracy,
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: modelName.charAt(0).toUpperCase() + modelName.slice(1),
                        line: {
                            color: COLORS[modelName] || '#9b59b6', // Default to purple if color not defined
                            width: 3
                        },
                        marker: {
                            size: 7
                        }
                    });
                }
            });
        }
        
        // If no data, add a message
        if (traces.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="fas fa-chart-line fa-3x mb-3"></i>
                    <h5>No data available</h5>
                    <p>Start training to see model accuracy comparison.</p>
                </div>
            `;
            return;
        }
        
        // Layout configuration
        const layout = {
            title: 'Model Accuracy Comparison',
            xaxis: {
                title: 'Training Round',
                gridcolor: COLORS.grid,
                gridwidth: 1,
                zeroline: false
            },
            yaxis: {
                title: 'Accuracy (%)',
                gridcolor: COLORS.grid,
                gridwidth: 1,
                zeroline: false,
                range: [0, 100]
            },
            font: {
                family: 'Segoe UI, sans-serif',
                color: COLORS.text
            },
            legend: {
                orientation: 'h',
                y: -0.2
            },
            margin: { t: 60, b: 80, l: 60, r: 30 },
            plot_bgcolor: COLORS.background,
            paper_bgcolor: 'white',
            hovermode: 'closest',
            height: 450
        };
        
        // Create the plot
        Plotly.newPlot(containerId, traces, layout, PLOT_CONFIG);
        
    } catch (error) {
        console.error('Error creating accuracy comparison chart:', error);
        handlePlotError(containerId, 'Failed to create accuracy comparison chart.');
    }
}

// Create the F1 score comparison chart
function createF1ScoreComparisonChart(containerId, metricsHistory) {
    try {
        showPlotLoading(containerId);
        
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Prepare data
        const traces = [];
        
        // Global model trace
        if (metricsHistory.global && metricsHistory.global.length > 0) {
            const rounds = metricsHistory.global.map((_, i) => i + 1);
            const f1Score = metricsHistory.global.map(m => m.f1_score * 100); // Convert to percentage
            
            traces.push({
                x: rounds,
                y: f1Score,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Global MLP',
                line: {
                    color: COLORS.global,
                    width: 4
                },
                marker: {
                    size: 8,
                    symbol: 'circle'
                }
            });
        }
        
        // Local models traces
        if (metricsHistory.local) {
            Object.entries(metricsHistory.local).forEach(([modelName, metrics]) => {
                if (metrics && metrics.length > 0) {
                    const rounds = metrics.map((_, i) => i + 1);
                    const f1Score = metrics.map(m => (m.f1_score || 0) * 100); // Convert to percentage
                    
                    traces.push({
                        x: rounds,
                        y: f1Score,
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: modelName.charAt(0).toUpperCase() + modelName.slice(1),
                        line: {
                            color: COLORS[modelName] || '#9b59b6', // Default to purple if color not defined
                            width: 3
                        },
                        marker: {
                            size: 7
                        }
                    });
                }
            });
        }
        
        // If no data, add a message
        if (traces.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="fas fa-chart-bar fa-3x mb-3"></i>
                    <h5>No data available</h5>
                    <p>Start training to see model F1 score comparison.</p>
                </div>
            `;
            return;
        }
        
        // Layout configuration
        const layout = {
            title: 'Model F1 Score Comparison',
            xaxis: {
                title: 'Training Round',
                gridcolor: COLORS.grid,
                gridwidth: 1,
                zeroline: false
            },
            yaxis: {
                title: 'F1 Score (%)',
                gridcolor: COLORS.grid,
                gridwidth: 1,
                zeroline: false,
                range: [0, 100]
            },
            font: {
                family: 'Segoe UI, sans-serif',
                color: COLORS.text
            },
            legend: {
                orientation: 'h',
                y: -0.2
            },
            margin: { t: 60, b: 80, l: 60, r: 30 },
            plot_bgcolor: COLORS.background,
            paper_bgcolor: 'white',
            hovermode: 'closest',
            height: 450
        };
        
        // Create the plot
        Plotly.newPlot(containerId, traces, layout, PLOT_CONFIG);
        
    } catch (error) {
        console.error('Error creating F1 score comparison chart:', error);
        handlePlotError(containerId, 'Failed to create F1 score comparison chart.');
    }
}

// Create improvement percentages chart
function createImprovementChart(containerId, improvements) {
    try {
        showPlotLoading(containerId);
        
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Prepare data
        const modelNames = [];
        const accuracyImprovements = [];
        const f1Improvements = [];
        
        // Global model improvements
        if (improvements.global) {
            modelNames.push('Global MLP');
            accuracyImprovements.push(improvements.global.accuracy_improvement || 0);
            f1Improvements.push(improvements.global.f1_score_improvement || 0);
        }
        
        // Local models improvements
        if (improvements.local) {
            Object.entries(improvements.local).forEach(([modelName, modelImprovements]) => {
                modelNames.push(modelName.charAt(0).toUpperCase() + modelName.slice(1));
                accuracyImprovements.push(modelImprovements.accuracy_improvement || 0);
                f1Improvements.push(modelImprovements.f1_score_improvement || 0);
            });
        }
        
        // If no data, add a message
        if (modelNames.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="fas fa-percentage fa-3x mb-3"></i>
                    <h5>No improvement data available</h5>
                    <p>Complete multiple training rounds to see improvements.</p>
                </div>
            `;
            return;
        }
        
        // Create traces for accuracy and F1 score improvements
        const traces = [
            {
                x: modelNames,
                y: accuracyImprovements.map(val => val * 100), // Convert to percentage
                name: 'Accuracy Improvement',
                type: 'bar',
                marker: {
                    color: '#3498db'
                }
            },
            {
                x: modelNames,
                y: f1Improvements.map(val => val * 100), // Convert to percentage
                name: 'F1 Score Improvement',
                type: 'bar',
                marker: {
                    color: '#2ecc71'
                }
            }
        ];
        
        // Layout configuration
        const layout = {
            title: 'Model Improvement Percentages',
            xaxis: {
                title: 'Model',
                gridcolor: COLORS.grid,
                gridwidth: 1
            },
            yaxis: {
                title: 'Improvement (%)',
                gridcolor: COLORS.grid,
                gridwidth: 1,
                zeroline: true
            },
            barmode: 'group',
            font: {
                family: 'Segoe UI, sans-serif',
                color: COLORS.text
            },
            legend: {
                orientation: 'h',
                y: -0.2
            },
            margin: { t: 60, b: 80, l: 60, r: 30 },
            plot_bgcolor: COLORS.background,
            paper_bgcolor: 'white',
            height: 450
        };
        
        // Create the plot
        Plotly.newPlot(containerId, traces, layout, PLOT_CONFIG);
        
    } catch (error) {
        console.error('Error creating improvement chart:', error);
        handlePlotError(containerId, 'Failed to create improvement chart.');
    }
}

// Create training progress chart (loss over time)
function createTrainingProgressChart(containerId, metricsHistory) {
    try {
        showPlotLoading(containerId);
        
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Check if we have global metrics with loss data
        if (!metricsHistory.global || !metricsHistory.global.length) {
            container.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="fas fa-chart-line fa-3x mb-3"></i>
                    <h5>No training data available</h5>
                    <p>Start training to see progress charts.</p>
                </div>
            `;
            return;
        }
        
        // Extract loss and training time data
        const rounds = metricsHistory.global.map((_, i) => i + 1);
        const loss = metricsHistory.global.map(m => m.loss || 0);
        const trainingTime = metricsHistory.global.map(m => m.training_time || 0);
        
        // Create a subplot with two y-axes
        const traces = [
            {
                x: rounds,
                y: loss,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Loss',
                line: {
                    color: '#e74c3c',
                    width: 3
                },
                marker: {
                    size: 7,
                    symbol: 'circle'
                },
                yaxis: 'y'
            },
            {
                x: rounds,
                y: trainingTime,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Training Time (s)',
                line: {
                    color: '#3498db',
                    width: 3
                },
                marker: {
                    size: 7,
                    symbol: 'square'
                },
                yaxis: 'y2'
            }
        ];
        
        // Layout with dual y-axes
        const layout = {
            title: 'Training Progress',
            xaxis: {
                title: 'Round',
                gridcolor: COLORS.grid,
                gridwidth: 1,
                zeroline: false
            },
            yaxis: {
                title: 'Loss',
                gridcolor: COLORS.grid,
                gridwidth: 1,
                zeroline: false,
                side: 'left'
            },
            yaxis2: {
                title: 'Training Time (s)',
                gridcolor: COLORS.grid,
                gridwidth: 1,
                zeroline: false,
                overlaying: 'y',
                side: 'right'
            },
            font: {
                family: 'Segoe UI, sans-serif',
                color: COLORS.text
            },
            legend: {
                orientation: 'h',
                y: -0.2
            },
            margin: { t: 60, b: 80, l: 60, r: 60 },
            plot_bgcolor: COLORS.background,
            paper_bgcolor: 'white',
            hovermode: 'closest',
            height: 450
        };
        
        // Create the plot
        Plotly.newPlot(containerId, traces, layout, PLOT_CONFIG);
        
    } catch (error) {
        console.error('Error creating training progress chart:', error);
        handlePlotError(containerId, 'Failed to create training progress chart.');
    }
}

// Create live performance meter gauge chart
function createPerformanceMeter(containerId, value, title) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Convert value to percentage if it's a decimal
        const percentage = value <= 1 ? value * 100 : value;
        
        // Create gauge chart
        const data = [{
            type: 'indicator',
            mode: 'gauge+number',
            value: percentage,
            title: { text: title, font: { size: 18 } },
            gauge: {
                axis: { range: [0, 100], tickwidth: 1, tickcolor: COLORS.text },
                bar: { color: getColorForPercentage(percentage) },
                bgcolor: 'white',
                borderwidth: 2,
                bordercolor: '#ccc',
                steps: [
                    { range: [0, 50], color: '#ffcccc' },
                    { range: [50, 75], color: '#ffebcc' },
                    { range: [75, 90], color: '#e6ffcc' },
                    { range: [90, 100], color: '#ccffcc' }
                ],
                threshold: {
                    line: { color: 'red', width: 4 },
                    thickness: 0.75,
                    value: 90
                }
            }
        }];
        
        // Layout configuration
        const layout = {
            font: { family: 'Segoe UI, sans-serif' },
            margin: { t: 50, b: 20, l: 20, r: 30 },
            paper_bgcolor: 'white',
            height: 220
        };
        
        // Create the plot
        Plotly.newPlot(containerId, data, layout, PLOT_CONFIG);
        
    } catch (error) {
        console.error(`Error creating performance meter for ${title}:`, error);
        container.innerHTML = `<div class="alert alert-danger">Error loading performance meter</div>`;
    }
}

// Create model comparison radar chart
function createModelComparisonRadar(containerId, latestMetrics) {
    try {
        showPlotLoading(containerId);
        
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Prepare data
        const modelNames = [];
        const modelData = [];
        
        // Add global model if available
        if (latestMetrics.global) {
            modelNames.push('Global MLP');
            modelData.push({
                accuracy: latestMetrics.global.accuracy || 0,
                f1_score: latestMetrics.global.f1_score || 0,
                precision: latestMetrics.global.precision || 0,
                recall: latestMetrics.global.recall || 0
            });
        }
        
        // Add local models if available
        if (latestMetrics.local) {
            Object.entries(latestMetrics.local).forEach(([name, metrics]) => {
                modelNames.push(name.charAt(0).toUpperCase() + name.slice(1));
                modelData.push({
                    accuracy: metrics.accuracy || 0,
                    f1_score: metrics.f1_score || 0,
                    precision: metrics.precision || 0,
                    recall: metrics.recall || 0
                });
            });
        }
        
        // If no data, show message
        if (modelNames.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="fas fa-chart-pie fa-3x mb-3"></i>
                    <h5>No model data available</h5>
                    <p>Load models to see radar comparison.</p>
                </div>
            `;
            return;
        }
        
        // Create radar chart traces
        const traces = modelNames.map((name, index) => {
            // Convert values to percentages
            const metrics = modelData[index];
            
            return {
                type: 'scatterpolar',
                name: name,
                r: [
                    metrics.accuracy * 100,
                    metrics.f1_score * 100,
                    metrics.precision * 100, 
                    metrics.recall * 100,
                    metrics.accuracy * 100 // Close the polygon
                ],
                theta: ['Accuracy', 'F1 Score', 'Precision', 'Recall', 'Accuracy'],
                fill: 'toself',
                line: {
                    color: Object.values(COLORS)[index % Object.values(COLORS).length]
                },
                opacity: 0.7
            };
        });
        
        // Layout configuration
        const layout = {
            title: 'Model Metrics Comparison',
            polar: {
                radialaxis: {
                    visible: true,
                    range: [0, 100],
                    angle: 90,
                    ticksuffix: '%'
                }
            },
            font: {
                family: 'Segoe UI, sans-serif',
                color: COLORS.text
            },
            legend: {
                orientation: 'h',
                y: -0.2
            },
            margin: { t: 60, b: 80, l: 60, r: 60 },
            paper_bgcolor: 'white',
            height: 450
        };
        
        // Create the plot
        Plotly.newPlot(containerId, traces, layout, PLOT_CONFIG);
        
    } catch (error) {
        console.error('Error creating model comparison radar:', error);
        handlePlotError(containerId, 'Failed to create model comparison radar chart.');
    }
}

// Helper function to get color based on percentage value
function getColorForPercentage(percentage) {
    if (percentage < 50) return '#e74c3c'; // Red
    if (percentage < 75) return '#f39c12'; // Orange
    if (percentage < 90) return '#3498db'; // Blue
    return '#2ecc71'; // Green
}

// Function to regenerate a plot (call from UI)
function regeneratePlot(containerId) {
    // This will be implemented based on the specific plot type
    const plotType = containerId.split('-')[0]; // Assumes IDs like 'accuracy-chart', 'f1-chart', etc.
    
    switch(plotType) {
        case 'accuracy':
            // Send a request to the server to regenerate the accuracy plot
            fetch('/api/plots/regenerate_all')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Reload the page or just the specific plot
                        loadPlots();
                    } else {
                        alert('Error regenerating plots: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error regenerating plots:', error);
                    alert('Error regenerating plots. See console for details.');
                });
            break;
            
        default:
            // Default regeneration logic
            loadPlots();
            break;
    }
}

// Enhanced interactive chart controls
function addChartControls(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Add control buttons
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'chart-controls d-flex justify-content-end mb-3';
    controlsDiv.innerHTML = `
        <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="btn btn-outline-primary" onclick="zoomChart('${containerId}')">
                <i class="fas fa-search-plus"></i>
            </button>
            <button type="button" class="btn btn-outline-primary" onclick="resetZoom('${containerId}')">
                <i class="fas fa-search-minus"></i>
            </button>
            <button type="button" class="btn btn-outline-primary" onclick="exportChart('${containerId}')">
                <i class="fas fa-download"></i>
            </button>
            <button type="button" class="btn btn-outline-primary" onclick="refreshChart('${containerId}')">
                <i class="fas fa-sync-alt"></i>
            </button>
        </div>
    `;
    
    container.parentNode.insertBefore(controlsDiv, container);
}

function zoomChart(containerId) {
    const plotDiv = document.getElementById(containerId);
    if (plotDiv && plotDiv.layout) {
        Plotly.relayout(plotDiv, {
            'xaxis.autorange': false,
            'yaxis.autorange': false
        });
    }
}

function resetZoom(containerId) {
    const plotDiv = document.getElementById(containerId);
    if (plotDiv) {
        Plotly.relayout(plotDiv, {
            'xaxis.autorange': true,
            'yaxis.autorange': true
        });
    }
}

function exportChart(containerId) {
    const plotDiv = document.getElementById(containerId);
    if (plotDiv) {
        Plotly.downloadImage(plotDiv, {
            format: 'png',
            width: 1200,
            height: 800,
            filename: `hetrofl_${containerId}_${new Date().toISOString().split('T')[0]}`
        });
    }
}

function refreshChart(containerId) {
    showPlotLoading(containerId);
    
    // Determine chart type and refresh accordingly
    const chartType = containerId.split('-')[0];
    
    setTimeout(() => {
        // Simulate refresh - in real implementation, this would fetch new data
        regeneratePlot(containerId);
    }, 1000);
}

// Enhanced plot generation with animations
function createAnimatedChart(containerId, data, layout, config = {}) {
    const defaultConfig = {
        ...PLOT_CONFIG,
        ...config
    };
    
    // Add animation to layout
    const animatedLayout = {
        ...layout,
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        }
    };
    
    return Plotly.newPlot(containerId, data, animatedLayout, defaultConfig)
        .then(() => {
            // Add interactive controls
            addChartControls(containerId);
            
            // Add hover effects
            const plotDiv = document.getElementById(containerId);
            if (plotDiv) {
                plotDiv.on('plotly_hover', function(data) {
                    plotDiv.style.cursor = 'pointer';
                });
                
                plotDiv.on('plotly_unhover', function(data) {
                    plotDiv.style.cursor = 'default';
                });
            }
        });
}

// Enhanced model performance chart with drill-down capability
function createModelPerformanceChart(containerId, modelData, options = {}) {
    try {
        showPlotLoading(containerId);
        
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Create interactive performance chart
        const traces = [];
        const colors = ['#667eea', '#4facfe', '#43e97b', '#fa709a'];
        
        Object.entries(modelData).forEach(([modelName, metrics], index) => {
            traces.push({
                x: ['Accuracy', 'F1 Score', 'Precision', 'Recall'],
                y: [
                    (metrics.accuracy || 0) * 100,
                    (metrics.f1_score || 0) * 100,
                    (metrics.precision || 0) * 100,
                    (metrics.recall || 0) * 100
                ],
                type: 'bar',
                name: modelName,
                marker: {
                    color: colors[index % colors.length],
                    line: {
                        color: 'rgba(255,255,255,0.8)',
                        width: 2
                    }
                },
                hovertemplate: '<b>%{fullData.name}</b><br>' +
                              '%{x}: %{y:.2f}%<br>' +
                              '<extra></extra>'
            });
        });
        
        const layout = {
            title: {
                text: 'Model Performance Comparison',
                font: { size: 18, family: 'Inter, sans-serif' }
            },
            xaxis: {
                title: 'Metrics',
                gridcolor: COLORS.grid,
                gridwidth: 1
            },
            yaxis: {
                title: 'Performance (%)',
                gridcolor: COLORS.grid,
                gridwidth: 1,
                range: [0, 100]
            },
            barmode: 'group',
            font: {
                family: 'Inter, sans-serif',
                color: COLORS.text
            },
            legend: {
                orientation: 'h',
                y: -0.2
            },
            margin: { t: 60, b: 80, l: 60, r: 30 },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'white',
            height: 450,
            hovermode: 'closest'
        };
        
        return createAnimatedChart(containerId, traces, layout);
        
    } catch (error) {
        console.error('Error creating model performance chart:', error);
        handlePlotError(containerId, 'Failed to create model performance chart.');
    }
}

// Real-time chart updates with smooth transitions
function updateChartData(containerId, newData) {
    const plotDiv = document.getElementById(containerId);
    if (!plotDiv) return;
    
    // Smooth data transition
    Plotly.animate(plotDiv, {
        data: newData
    }, {
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 500
        }
    });
}

// Function to update XGBoost model
function rebuildXGBoostModel() {
    showPlotLoading('xgboost-status');
    
    const statusContainer = document.getElementById('xgboost-status');
    if (statusContainer) {
        statusContainer.innerHTML = `
            <div class="alert alert-info">
                <div class="d-flex align-items-center">
                    <div class="spinner-border spinner-border-sm me-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div>
                        <strong>Rebuilding XGBoost model...</strong><br>
                        <small>This may take a few minutes. Please wait.</small>
                    </div>
                </div>
            </div>
        `;
    }
    
    fetch('/api/models/rebuild_xgboost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (statusContainer) {
            if (data.success) {
                statusContainer.innerHTML = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i>
                        <strong>XGBoost model rebuilt successfully!</strong><br>
                        <small>Model is now ready for training.</small>
                    </div>
                `;
                // Reload model info
                if (typeof loadModelsData === 'function') {
                    loadModelsData();
                }
            } else {
                statusContainer.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        <strong>Error rebuilding XGBoost model:</strong><br>
                        <small>${data.error}</small>
                    </div>
                `;
            }
        }
    })
    .catch(error => {
        console.error('Error rebuilding XGBoost model:', error);
        if (statusContainer) {
            statusContainer.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    <strong>Error rebuilding XGBoost model</strong><br>
                    <small>Network error. Please check console for details.</small>
                </div>
            `;
        }
    });
}

// Enhanced loading states with skeleton screens
function showSkeletonLoader(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="skeleton-loader-container">
            <div class="skeleton-loader mb-3" style="height: 30px; width: 60%;"></div>
            <div class="skeleton-loader mb-2" style="height: 20px; width: 80%;"></div>
            <div class="skeleton-loader mb-2" style="height: 20px; width: 70%;"></div>
            <div class="skeleton-loader mb-2" style="height: 20px; width: 90%;"></div>
            <div class="skeleton-loader mb-2" style="height: 20px; width: 60%;"></div>
            <div class="skeleton-loader" style="height: 200px; width: 100%;"></div>
        </div>
    `;
}

// Toast notification system
function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast ${type}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="fas fa-${getToastIcon(type)} me-2"></i>
                <strong class="me-auto">${getToastTitle(type)}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: duration });
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getToastTitle(type) {
    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
    };
    return titles[type] || 'Notification';
}

// ============================================================================
// INTERACTIVE MAP FUNCTIONALITY
// ============================================================================

// Global map variables
let modelMap = null;
let mapMarkers = {};
let connectionLines = [];
let isMapFullscreen = false;

// Model locations in Jordan
const MODEL_LOCATIONS = {
    xgboost: {
        name: 'XGBoost',
        location: 'Irbid, Jordan',
        coords: [32.53395264274002, 35.90549384206928],
        color: '#3498db',
        icon: 'XGB'
    },
    random_forest: {
        name: 'Random Forest',
        location: 'Zarqa, Jordan',
        coords: [32.10135383081517, 36.111384576884205],
        color: '#f39c12',
        icon: 'RF'
    },
    catboost: {
        name: 'CatBoost',
        location: 'Amman, Jordan',
        coords: [31.96474851135209, 35.921473610670375],
        color: '#2ecc71',
        icon: 'CB'
    }
};

// Initialize the interactive map
function initializeModelMap() {
    try {
        const mapContainer = document.getElementById('model-map');
        if (!mapContainer) return;

        // Initialize map centered on Jordan
        modelMap = L.map('model-map', {
            center: [32.0, 36.0],
            zoom: 8,
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            dragging: true,
            touchZoom: true
        });

        // Add tile layer with custom styling
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            className: 'map-tiles'
        }).addTo(modelMap);

        // Add model markers
        Object.entries(MODEL_LOCATIONS).forEach(([modelType, config]) => {
            addModelMarker(modelType, config);
        });

        // Add connection lines between models
        addConnectionLines();

        console.log('Model map initialized successfully');
    } catch (error) {
        console.error('Error initializing model map:', error);
        handleMapError('Failed to initialize map');
    }
}

// Add a model marker to the map
function addModelMarker(modelType, config) {
    try {
        // Create custom marker icon
        const markerIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-icon ${modelType}">
                     <i class="fas fa-brain"></i>
                   </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20]
        });

        // Create marker
        const marker = L.marker(config.coords, { icon: markerIcon })
            .addTo(modelMap);

        // Create popup content
        const popupContent = createMarkerPopup(modelType, config);
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
        });

        // Store marker reference
        mapMarkers[modelType] = marker;

        // Add marker event handlers
        marker.on('click', () => {
            updateMarkerPopup(modelType);
        });

        marker.on('mouseover', () => {
            marker.getElement().querySelector('.marker-icon').style.transform = 'scale(1.2)';
        });

        marker.on('mouseout', () => {
            marker.getElement().querySelector('.marker-icon').style.transform = 'scale(1)';
        });

    } catch (error) {
        console.error(`Error adding marker for ${modelType}:`, error);
    }
}

// Create popup content for a model marker
function createMarkerPopup(modelType, config) {
    const metrics = getModelMetrics(modelType);
    
    return `
        <div class="popup-content">
            <div class="popup-header">
                <i class="fas fa-brain me-2" style="color: ${config.color}"></i>
                ${config.name}
            </div>
            <div class="popup-location">
                <i class="fas fa-map-marker-alt me-1"></i>
                ${config.location}
            </div>
            <div class="popup-metrics">
                <div class="popup-metric">
                    <div class="popup-metric-value">${formatPercentage(metrics.accuracy)}</div>
                    <div class="popup-metric-label">Accuracy</div>
                </div>
                <div class="popup-metric">
                    <div class="popup-metric-value">${formatPercentage(metrics.f1_score)}</div>
                    <div class="popup-metric-label">F1-Score</div>
                </div>
                <div class="popup-metric">
                    <div class="popup-metric-value">${formatNumber(metrics.loss, 3)}</div>
                    <div class="popup-metric-label">Loss</div>
                </div>
                <div class="popup-metric">
                    <div class="popup-metric-value">${metrics.status}</div>
                    <div class="popup-metric-label">Status</div>
                </div>
            </div>
            <div class="popup-actions mt-2">
                <button class="btn btn-sm btn-outline-primary" onclick="focusOnModel('${modelType}')">
                    <i class="fas fa-eye me-1"></i>Focus
                </button>
                <button class="btn btn-sm btn-outline-info" onclick="showModelDetails('${modelType}')">
                    <i class="fas fa-info me-1"></i>Details
                </button>
            </div>
        </div>
    `;
}

// Get current metrics for a model
function getModelMetrics(modelType) {
    // This would typically come from the system status
    // For now, return mock data
    const mockMetrics = {
        xgboost: { accuracy: 0.92, f1_score: 0.89, loss: 0.08, status: 'Ready' },
        random_forest: { accuracy: 0.88, f1_score: 0.85, loss: 0.12, status: 'Ready' },
        catboost: { accuracy: 0.90, f1_score: 0.87, loss: 0.10, status: 'Ready' }
    };
    
    return mockMetrics[modelType] || { accuracy: 0, f1_score: 0, loss: 0, status: 'Unknown' };
}

// Add connection lines between model locations
function addConnectionLines() {
    try {
        const models = Object.keys(MODEL_LOCATIONS);
        
        // Create lines between all model pairs
        for (let i = 0; i < models.length; i++) {
            for (let j = i + 1; j < models.length; j++) {
                const model1 = MODEL_LOCATIONS[models[i]];
                const model2 = MODEL_LOCATIONS[models[j]];
                
                const line = L.polyline([model1.coords, model2.coords], {
                    color: '#667eea',
                    weight: 2,
                    opacity: 0,
                    dashArray: '5, 10',
                    className: 'connection-line'
                }).addTo(modelMap);
                
                connectionLines.push(line);
            }
        }
    } catch (error) {
        console.error('Error adding connection lines:', error);
    }
}

// Update marker status based on training state
function updateMarkerStatus(modelType, status, metrics = null) {
    try {
        const marker = mapMarkers[modelType];
        if (!marker) return;

        const markerElement = marker.getElement();
        if (!markerElement) return;

        const iconElement = markerElement.querySelector('.marker-icon');
        
        // Remove existing status classes
        iconElement.classList.remove('training', 'error', 'ready');
        
        // Add new status class
        iconElement.classList.add(status);
        
        // Update legend status
        const statusElement = document.getElementById(`${modelType.replace('_', '-')}-status`);
        if (statusElement) {
            statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            statusElement.className = `model-status ${status}`;
        }
        
        // Update popup if open
        if (marker.isPopupOpen()) {
            updateMarkerPopup(modelType, metrics);
        }
        
    } catch (error) {
        console.error(`Error updating marker status for ${modelType}:`, error);
    }
}

// Update marker popup with latest metrics
function updateMarkerPopup(modelType, metrics = null) {
    try {
        const marker = mapMarkers[modelType];
        const config = MODEL_LOCATIONS[modelType];
        
        if (!marker || !config) return;
        
        const currentMetrics = metrics || getModelMetrics(modelType);
        const popupContent = createMarkerPopup(modelType, config);
        
        marker.setPopupContent(popupContent);
    } catch (error) {
        console.error(`Error updating popup for ${modelType}:`, error);
    }
}

// Animate connections during federated learning
function animateConnections(active = true) {
    try {
        connectionLines.forEach(line => {
            if (active) {
                line.setStyle({ opacity: 0.6 });
                line.getElement().style.animation = 'connectionPulse 3s infinite';
            } else {
                line.setStyle({ opacity: 0 });
                line.getElement().style.animation = 'none';
            }
        });
    } catch (error) {
        console.error('Error animating connections:', error);
    }
}

// Reset map view to default
function resetMapView() {
    try {
        if (modelMap) {
            modelMap.setView([32.0, 36.0], 8);
        }
    } catch (error) {
        console.error('Error resetting map view:', error);
    }
}

// Toggle map fullscreen
function toggleMapFullscreen() {
    try {
        const mapCard = document.querySelector('.map-card');
        if (!mapCard) return;

        if (isMapFullscreen) {
            // Exit fullscreen
            mapCard.classList.remove('map-fullscreen');
            document.body.style.overflow = '';
            isMapFullscreen = false;
            
            // Update button icon
            const button = mapCard.querySelector('.plot-controls button[onclick="toggleMapFullscreen()"]');
            if (button) {
                button.innerHTML = '<i class="fas fa-expand"></i>';
                button.title = 'Fullscreen';
            }
        } else {
            // Enter fullscreen
            mapCard.classList.add('map-fullscreen');
            document.body.style.overflow = 'hidden';
            isMapFullscreen = true;
            
            // Update button icon
            const button = mapCard.querySelector('.plot-controls button[onclick="toggleMapFullscreen()"]');
            if (button) {
                button.innerHTML = '<i class="fas fa-compress"></i>';
                button.title = 'Exit Fullscreen';
            }
        }
        
        // Invalidate map size after transition
        setTimeout(() => {
            if (modelMap) {
                modelMap.invalidateSize();
            }
        }, 300);
        
    } catch (error) {
        console.error('Error toggling map fullscreen:', error);
    }
}

// Focus on a specific model
function focusOnModel(modelType) {
    try {
        const config = MODEL_LOCATIONS[modelType];
        if (config && modelMap) {
            modelMap.setView(config.coords, 12);
            
            // Highlight the marker temporarily
            const marker = mapMarkers[modelType];
            if (marker) {
                const iconElement = marker.getElement().querySelector('.marker-icon');
                iconElement.style.animation = 'markerPulse 2s 3';
                
                setTimeout(() => {
                    iconElement.style.animation = '';
                }, 6000);
            }
        }
    } catch (error) {
        console.error(`Error focusing on model ${modelType}:`, error);
    }
}

// Show model details
function showModelDetails(modelType) {
    try {
        // This would typically navigate to the model details page
        // For now, just show an alert
        const config = MODEL_LOCATIONS[modelType];
        showAlert(`Showing details for ${config.name} model at ${config.location}`, 'info');
    } catch (error) {
        console.error(`Error showing details for ${modelType}:`, error);
    }
}

// Handle map errors
function handleMapError(message) {
    const mapContainer = document.getElementById('model-map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div class="plot-error-enhanced">
                <i class="fas fa-map-marked-alt fa-3x mb-3"></i>
                <h5>Map Error</h5>
                <p>${message}</p>
                <button class="btn btn-outline-danger mt-2" onclick="initializeModelMap()">
                    <i class="fas fa-sync-alt me-1"></i> Retry
                </button>
            </div>
        `;
    }
}

// ============================================================================
// FEDERATED LEARNING FLOW ANIMATIONS
// ============================================================================

// Initialize federated learning flow animations
function initializeFederatedFlow() {
    try {
        const flowContainer = document.querySelector('.federated-flow-container');
        if (!flowContainer) return;

        // Set up flow status indicators
        updateFlowStatus('ready');
        
        // Add hover effects to model nodes
        setupFlowInteractions();
        
        console.log('Federated learning flow initialized');
    } catch (error) {
        console.error('Error initializing federated flow:', error);
    }
}

// Update flow status indicators
function updateFlowStatus(phase, activeModels = []) {
    try {
        const statusIndicators = {
            'local-status': document.getElementById('local-status'),
            'distillation-status': document.getElementById('distillation-status'),
            'global-status': document.getElementById('global-status')
        };

        // Reset all indicators
        Object.values(statusIndicators).forEach(indicator => {
            if (indicator) {
                indicator.className = 'status-indicator';
            }
        });

        // Update based on phase
        switch (phase) {
            case 'local_training':
                if (statusIndicators['local-status']) {
                    statusIndicators['local-status'].className = 'status-indicator training';
                }
                animateModelNodes(activeModels, true);
                break;
                
            case 'knowledge_distillation':
                if (statusIndicators['distillation-status']) {
                    statusIndicators['distillation-status'].className = 'status-indicator training';
                }
                animateKnowledgeDistillation(true);
                break;
                
            case 'global_aggregation':
                if (statusIndicators['global-status']) {
                    statusIndicators['global-status'].className = 'status-indicator training';
                }
                animateGlobalModel(true);
                break;
                
            case 'completed':
                Object.values(statusIndicators).forEach(indicator => {
                    if (indicator) {
                        indicator.className = 'status-indicator active';
                    }
                });
                break;
                
            default: // ready
                // All indicators remain in default state
                break;
        }
    } catch (error) {
        console.error('Error updating flow status:', error);
    }
}

// Animate model nodes during training
function animateModelNodes(activeModels, active) {
    try {
        const modelNodes = document.querySelectorAll('.model-node');
        
        modelNodes.forEach(node => {
            const nodeClass = node.classList[1]; // e.g., 'xgboost-node'
            const modelType = nodeClass.replace('-node', '');
            
            if (active && activeModels.includes(modelType)) {
                node.style.animation = 'pulse 2s infinite';
                node.style.filter = 'url(#glow) brightness(1.3)';
            } else {
                node.style.animation = '';
                node.style.filter = 'url(#glow)';
            }
        });
    } catch (error) {
        console.error('Error animating model nodes:', error);
    }
}

// Animate knowledge distillation process
function animateKnowledgeDistillation(active) {
    try {
        const kdNode = document.querySelector('.kd-node');
        const progressDots = document.querySelectorAll('.progress-dot');
        
        if (kdNode) {
            if (active) {
                kdNode.style.animation = 'kdPulse 1s infinite';
                kdNode.style.filter = 'url(#glow) brightness(1.2)';
            } else {
                kdNode.style.animation = 'kdPulse 3s infinite';
                kdNode.style.filter = 'url(#glow)';
            }
        }
        
        // Animate progress dots
        progressDots.forEach((dot, index) => {
            if (active) {
                setTimeout(() => {
                    dot.classList.add('active');
                }, index * 500);
            } else {
                dot.classList.remove('active');
            }
        });
    } catch (error) {
        console.error('Error animating knowledge distillation:', error);
    }
}

// Animate global model during aggregation
function animateGlobalModel(active) {
    try {
        const globalNode = document.querySelector('.global-node');
        
        if (globalNode) {
            if (active) {
                globalNode.style.animation = 'globalPulse 1s infinite';
                globalNode.style.filter = 'url(#glow) brightness(1.3)';
            } else {
                globalNode.style.animation = 'globalPulse 4s infinite';
                globalNode.style.filter = 'url(#glow)';
            }
        }
    } catch (error) {
        console.error('Error animating global model:', error);
    }
}

// Set up interactive hover effects for flow elements
function setupFlowInteractions() {
    try {
        // Model node interactions
        const modelNodes = document.querySelectorAll('.model-node');
        modelNodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                node.style.transform = 'scale(1.1)';
                node.style.filter = 'url(#glow) brightness(1.2)';
            });
            
            node.addEventListener('mouseleave', () => {
                node.style.transform = 'scale(1)';
                node.style.filter = 'url(#glow)';
            });
            
            node.addEventListener('click', () => {
                const nodeClass = node.classList[1];
                const modelType = nodeClass.replace('-node', '');
                showModelFlowDetails(modelType);
            });
        });
        
        // Knowledge distillation interaction
        const kdNode = document.querySelector('.kd-node');
        if (kdNode) {
            kdNode.addEventListener('click', () => {
                showKnowledgeDistillationDetails();
            });
        }
        
        // Global model interaction
        const globalNode = document.querySelector('.global-node');
        if (globalNode) {
            globalNode.addEventListener('click', () => {
                showGlobalModelDetails();
            });
        }
    } catch (error) {
        console.error('Error setting up flow interactions:', error);
    }
}

// Show model flow details
function showModelFlowDetails(modelType) {
    try {
        const config = MODEL_LOCATIONS[modelType];
        if (config) {
            showAlert(`${config.name} model details - Click to view training metrics`, 'info');
        }
    } catch (error) {
        console.error(`Error showing flow details for ${modelType}:`, error);
    }
}

// Show knowledge distillation details
function showKnowledgeDistillationDetails() {
    try {
        showAlert('Knowledge Distillation Process - Transferring knowledge from local models to global model', 'info');
    } catch (error) {
        console.error('Error showing knowledge distillation details:', error);
    }
}

// Show global model details
function showGlobalModelDetails() {
    try {
        showAlert('Global MLP Model - Aggregated knowledge from all local models', 'info');
    } catch (error) {
        console.error('Error showing global model details:', error);
    }
}

// ============================================================================
// INITIALIZATION AND EVENT HANDLERS
// ============================================================================

// Initialize map and animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map if container exists
    if (document.getElementById('model-map')) {
        setTimeout(initializeModelMap, 500);
    }
    
    // Initialize federated flow if container exists
    if (document.querySelector('.federated-flow-container')) {
        setTimeout(initializeFederatedFlow, 100);
    }
});

// Handle window resize for map
window.addEventListener('resize', function() {
    if (modelMap) {
        setTimeout(() => {
            modelMap.invalidateSize();
        }, 100);
    }
});

// Handle escape key for fullscreen exit
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && isMapFullscreen) {
        toggleMapFullscreen();
    }
});

// ============================================================================
// ADVANCED METRICS FUNCTIONS
// ============================================================================

// Create performance gauge meter
function createPerformanceMeter(containerId, value, title) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Convert value to percentage if it's a decimal
        const percentage = value <= 1 ? value * 100 : value;
        
        // Create gauge chart
        const data = [{
            type: 'indicator',
            mode: 'gauge+number',
            value: percentage,
            title: { text: title, font: { size: 16 } },
            gauge: {
                axis: { range: [0, 100], tickwidth: 1, tickcolor: '#2c3e50' },
                bar: { color: getColorForPercentage(percentage) },
                bgcolor: 'white',
                borderwidth: 2,
                bordercolor: '#ccc',
                steps: [
                    { range: [0, 50], color: '#ffcccc' },
                    { range: [50, 75], color: '#ffebcc' },
                    { range: [75, 90], color: '#e6ffcc' },
                    { range: [90, 100], color: '#ccffcc' }
                ],
                threshold: {
                    line: { color: 'red', width: 4 },
                    thickness: 0.75,
                    value: 90
                }
            }
        }];
        
        // Layout configuration
        const layout = {
            font: { family: 'Inter, sans-serif' },
            margin: { t: 40, b: 20, l: 20, r: 20 },
            paper_bgcolor: 'white',
            height: 200
        };
        
        // Create the plot
        Plotly.newPlot(containerId, data, layout, { responsive: true, displayModeBar: false });
        
    } catch (error) {
        console.error(`Error creating performance meter for ${title}:`, error);
        container.innerHTML = `<div class="alert alert-danger">Error loading performance meter</div>`;
    }
}

// Helper function to get color based on percentage value
function getColorForPercentage(percentage) {
    if (percentage < 50) return '#e74c3c'; // Red
    if (percentage < 75) return '#f39c12'; // Orange
    if (percentage < 90) return '#3498db'; // Blue
    return '#2ecc71'; // Green
}

// Show loading state for plots
function showPlotLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading-spinner-enhanced">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading chart data...</p>
            </div>
        `;
    }
}

// Create enhanced heatmap
function createEnhancedHeatmap(containerId, data, title) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const heatmapData = [{
            z: data.values,
            x: data.xLabels,
            y: data.yLabels,
            type: 'heatmap',
            colorscale: 'Viridis',
            showscale: true,
            hoverongaps: false,
            hovertemplate: '<b>%{y}</b><br>%{x}: %{z:.3f}<extra></extra>'
        }];
        
        const layout = {
            title: {
                text: title,
                font: { size: 18, family: 'Inter, sans-serif' }
            },
            xaxis: { title: 'Metrics' },
            yaxis: { title: 'Models' },
            margin: { l: 100, r: 50, t: 60, b: 60 },
            height: 400,
            font: { family: 'Inter, sans-serif' }
        };
        
        Plotly.newPlot(containerId, heatmapData, layout, { responsive: true });
        
    } catch (error) {
        console.error(`Error creating heatmap for ${containerId}:`, error);
        handlePlotError(containerId, 'Failed to create heatmap');
    }
}

// Create correlation matrix
function createCorrelationMatrix(containerId, correlationData) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const data = [{
            z: correlationData.matrix,
            x: correlationData.labels,
            y: correlationData.labels,
            type: 'heatmap',
            colorscale: 'RdBu',
            zmid: 0,
            showscale: true,
            hovertemplate: '<b>%{y}</b> vs <b>%{x}</b><br>Correlation: %{z:.3f}<extra></extra>'
        }];
        
        const layout = {
            title: 'Metrics Correlation Matrix',
            xaxis: { title: 'Metrics' },
            yaxis: { title: 'Metrics' },
            margin: { l: 80, r: 50, t: 60, b: 80 },
            height: 500,
            font: { family: 'Inter, sans-serif' }
        };
        
        Plotly.newPlot(containerId, data, layout, { responsive: true });
        
    } catch (error) {
        console.error(`Error creating correlation matrix:`, error);
        handlePlotError(containerId, 'Failed to create correlation matrix');
    }
}

// Create box plot for statistical distribution
function createBoxPlot(containerId, data, title) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const traces = data.map((series, index) => ({
            y: series.values,
            type: 'box',
            name: series.name,
            marker: { color: series.color || COLORS[Object.keys(COLORS)[index]] }
        }));
        
        const layout = {
            title: title,
            yaxis: { title: 'Value' },
            margin: { l: 60, r: 30, t: 60, b: 60 },
            height: 350,
            font: { family: 'Inter, sans-serif' }
        };
        
        Plotly.newPlot(containerId, traces, layout, { responsive: true });
        
    } catch (error) {
        console.error(`Error creating box plot:`, error);
        handlePlotError(containerId, 'Failed to create box plot');
    }
}

// Create time series with predictions
function createTimeSeriesWithPredictions(containerId, historicalData, predictions) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const traces = [
            {
                x: historicalData.x,
                y: historicalData.y,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Historical Data',
                line: { color: '#3498db', width: 3 },
                marker: { size: 6 }
            }
        ];
        
        if (predictions && predictions.x && predictions.y) {
            traces.push({
                x: predictions.x,
                y: predictions.y,
                type: 'scatter',
                mode: 'lines',
                name: 'Predictions',
                line: { color: '#e74c3c', width: 2, dash: 'dash' }
            });
        }
        
        const layout = {
            title: 'Time Series Analysis with Predictions',
            xaxis: { title: 'Time/Round' },
            yaxis: { title: 'Performance' },
            margin: { l: 60, r: 30, t: 60, b: 60 },
            height: 500,
            font: { family: 'Inter, sans-serif' },
            hovermode: 'x unified'
        };
        
        Plotly.newPlot(containerId, traces, layout, { responsive: true });
        
    } catch (error) {
        console.error(`Error creating time series:`, error);
        handlePlotError(containerId, 'Failed to create time series chart');
    }
}

// Create multi-axis chart
function createMultiAxisChart(containerId, datasets) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const traces = datasets.map((dataset, index) => ({
            x: dataset.x,
            y: dataset.y,
            type: 'scatter',
            mode: 'lines+markers',
            name: dataset.name,
            line: { color: dataset.color, width: 3 },
            yaxis: dataset.yaxis || 'y'
        }));
        
        const layout = {
            title: 'Multi-axis Performance Analysis',
            xaxis: { title: 'Training Round' },
            yaxis: {
                title: 'Primary Metrics',
                side: 'left'
            },
            yaxis2: {
                title: 'Secondary Metrics',
                side: 'right',
                overlaying: 'y'
            },
            legend: { orientation: 'h', y: -0.2 },
            margin: { l: 60, r: 80, t: 60, b: 80 },
            height: 500,
            font: { family: 'Inter, sans-serif' }
        };
        
        Plotly.newPlot(containerId, traces, layout, { responsive: true });
        
    } catch (error) {
        console.error(`Error creating multi-axis chart:`, error);
        handlePlotError(containerId, 'Failed to create multi-axis chart');
    }
}

// Enhanced toast notification system
function showToast(message, type = 'info', duration = 5000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '11';
        document.body.appendChild(toastContainer);
    }
    
    const toastId = 'toast-' + Date.now();
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    
    const toastHTML = `
        <div id="${toastId}" class="toast enhanced-toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="fas fa-${iconMap[type] || 'info-circle'} me-2 text-${type}"></i>
                <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <small>just now</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: duration });
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Export functions for global access
window.initializeModelMap = initializeModelMap;
window.resetMapView = resetMapView;
window.toggleMapFullscreen = toggleMapFullscreen;
window.updateMarkerStatus = updateMarkerStatus;
window.animateConnections = animateConnections;
window.updateFlowStatus = updateFlowStatus;
window.focusOnModel = focusOnModel;
window.showModelDetails = showModelDetails;
window.createPerformanceMeter = createPerformanceMeter;
window.showPlotLoading = showPlotLoading;
window.createEnhancedHeatmap = createEnhancedHeatmap;
window.createCorrelationMatrix = createCorrelationMatrix;
window.createBoxPlot = createBoxPlot;
window.createTimeSeriesWithPredictions = createTimeSeriesWithPredictions;
window.createMultiAxisChart = createMultiAxisChart;
window.showToast = showToast;
