// HETROFL System Enhanced Plotting Functions
// This module provides enhanced plotting capabilities using Plotly.js and Chart.js

// Global color palette for consistent styling
const COLORS = {
    global: '#667eea',       // Purple for global model
    xgboost: '#4facfe',      // Blue for XGBoost
    catboost: '#43e97b',     // Green for CatBoost
    random_forest: '#fa709a', // Pink for Random Forest
    background: '#f8f9fa',   // Light background
    grid: '#eaecef',         // Grid lines
    text: '#2c3e50',         // Text color
    gradients: {
        primary: ['#667eea', '#764ba2'],
        secondary: ['#4facfe', '#00f2fe'],
        success: ['#43e97b', '#38f9d7'],
        warning: ['#f093fb', '#f5576c'],
        danger: ['#ff9a9e', '#fecfef']
    }
};

// Enhanced plot configuration
const PLOT_CONFIG = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
    modeBarButtonsToAdd: [
        {
            name: 'Export as PNG',
            icon: {
                'width': 1792,
                'height': 1792,
                'path': 'M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h465l135 136q58 56 136 56t136-56l136-136h464q40 0 68 28t28 68zm-325-569q17 41-14 70l-448 448q-18 19-45 19t-45-19l-448-448q-31-29-14-70 17-39 59-39h256v-448q0-26 19-45t45-19h256q26 0 45 19t19 45v448h256q42 0 59 39z'
            },
            click: function(gd) {
                Plotly.downloadImage(gd, {
                    format: 'png',
                    width: 1200,
                    height: 800,
                    filename: `hetrofl_chart_${new Date().toISOString().split('T')[0]}`
                });
            }
        }
    ],
    toImageButtonOptions: {
        format: 'png',
        filename: 'hetrofl_chart',
        height: 800,
        width: 1200,
        scale: 2
    }
};

// Chart.js default configuration
const CHARTJS_CONFIG = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    family: 'Poppins, sans-serif',
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#667eea',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            titleFont: {
                family: 'Poppins, sans-serif',
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                family: 'Poppins, sans-serif',
                size: 12
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                drawBorder: false
            },
            ticks: {
                font: {
                    family: 'Poppins, sans-serif',
                    size: 11
                },
                color: '#6c757d'
            }
        },
        y: {
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                drawBorder: false
            },
            ticks: {
                font: {
                    family: 'Poppins, sans-serif',
                    size: 11
                },
                color: '#6c757d'
            }
        }
    },
    animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
    }
};

// Enhanced error handling for plots
function handlePlotError(containerId, errorMessage, retryFunction = null) {
    const container = document.getElementById(containerId);
    if (container) {
        const retryBtn = retryFunction ? 
            `<button class="btn btn-sm btn-outline-danger mt-3" onclick="${retryFunction}">
                <i class="fas fa-sync-alt me-1"></i> Retry
            </button>` : '';
            
        container.innerHTML = `
            <div class="plot-error-enhanced">
                <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                <h5>Error Loading Plot</h5>
                <p class="mb-3">${errorMessage}</p>
                <div class="error-details">
                    <small class="text-muted">
                        <i class="fas fa-clock me-1"></i>
                        ${new Date().toLocaleTimeString()}
                    </small>
                </div>
                ${retryBtn}
            </div>
        `;
    }
}

// Enhanced loading indicator with skeleton screens
function showPlotLoading(containerId, message = 'Loading plot data...') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="plot-loading">
                <div class="loading-spinner-enhanced"></div>
                <p class="loading-text">${message}</p>
                <div class="loading-progress">
                    <div class="progress-bar-animated"></div>
                </div>
            </div>
        `;
    }
}

// Show skeleton loader for charts
function showSkeletonChart(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="chart-skeleton">
                <div class="skeleton-header">
                    <div class="skeleton-line" style="width: 60%; height: 20px; margin-bottom: 10px;"></div>
                    <div class="skeleton-line" style="width: 40%; height: 15px; margin-bottom: 20px;"></div>
                </div>
                <div class="skeleton-chart-area">
                    <div class="skeleton-bars">
                        <div class="skeleton-bar" style="height: 60%;"></div>
                        <div class="skeleton-bar" style="height: 80%;"></div>
                        <div class="skeleton-bar" style="height: 45%;"></div>
                        <div class="skeleton-bar" style="height: 90%;"></div>
                        <div class="skeleton-bar" style="height: 70%;"></div>
                    </div>
                </div>
                <div class="skeleton-legend">
                    <div class="skeleton-legend-item"></div>
                    <div class="skeleton-legend-item"></div>
                    <div class="skeleton-legend-item"></div>
                </div>
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
        
        // Enhanced layout configuration
        const layout = {
            title: {
                text: 'Model Accuracy Comparison',
                font: {
                    family: 'Poppins, sans-serif',
                    size: 18,
                    color: COLORS.text
                },
                x: 0.5,
                xanchor: 'center'
            },
            xaxis: {
                title: {
                    text: 'Training Round',
                    font: {
                        family: 'Poppins, sans-serif',
                        size: 14,
                        color: COLORS.text
                    }
                },
                gridcolor: 'rgba(0, 0, 0, 0.1)',
                gridwidth: 1,
                zeroline: false,
                showline: true,
                linecolor: 'rgba(0, 0, 0, 0.2)',
                tickfont: {
                    family: 'Poppins, sans-serif',
                    size: 12,
                    color: '#6c757d'
                }
            },
            yaxis: {
                title: {
                    text: 'Accuracy (%)',
                    font: {
                        family: 'Poppins, sans-serif',
                        size: 14,
                        color: COLORS.text
                    }
                },
                gridcolor: 'rgba(0, 0, 0, 0.1)',
                gridwidth: 1,
                zeroline: false,
                range: [0, 100],
                showline: true,
                linecolor: 'rgba(0, 0, 0, 0.2)',
                tickfont: {
                    family: 'Poppins, sans-serif',
                    size: 12,
                    color: '#6c757d'
                }
            },
            font: {
                family: 'Poppins, sans-serif',
                color: COLORS.text
            },
            legend: {
                orientation: 'h',
                y: -0.15,
                x: 0.5,
                xanchor: 'center',
                font: {
                    family: 'Poppins, sans-serif',
                    size: 12
                },
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                bordercolor: 'rgba(0, 0, 0, 0.1)',
                borderwidth: 1
            },
            margin: { t: 80, b: 100, l: 80, r: 50 },
            plot_bgcolor: 'rgba(248, 249, 250, 0.5)',
            paper_bgcolor: 'white',
            hovermode: 'x unified',
            height: 450,
            transition: {
                duration: 500,
                easing: 'cubic-in-out'
            }
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

// Enhanced Chart.js Functions

// Create animated gauge chart using Chart.js
function createGaugeChart(canvasId, value, label, color = '#667eea') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    const percentage = Math.min(Math.max(value * 100, 0), 100);
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [percentage, 100 - percentage],
                backgroundColor: [color, 'rgba(233, 236, 239, 0.3)'],
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: {
            ...CHARTJS_CONFIG,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            animation: {
                animateRotate: true,
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        },
        plugins: [{
            id: 'gaugeText',
            beforeDraw: function(chart) {
                const ctx = chart.ctx;
                const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
                
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Draw percentage
                ctx.font = 'bold 24px Poppins, sans-serif';
                ctx.fillStyle = color;
                ctx.fillText(percentage.toFixed(1) + '%', centerX, centerY - 5);
                
                // Draw label
                ctx.font = '12px Poppins, sans-serif';
                ctx.fillStyle = '#6c757d';
                ctx.fillText(label, centerX, centerY + 20);
                
                ctx.restore();
            }
        }]
    });
}

// Create animated line chart with gradient fill
function createGradientLineChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    // Create gradient
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0.05)');
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels || [],
            datasets: [{
                label: options.label || 'Data',
                data: data.values || [],
                borderColor: options.borderColor || '#667eea',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: options.borderColor || '#667eea',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            ...CHARTJS_CONFIG,
            ...options,
            scales: {
                ...CHARTJS_CONFIG.scales,
                y: {
                    ...CHARTJS_CONFIG.scales.y,
                    beginAtZero: true,
                    max: options.maxValue || undefined
                }
            }
        }
    });
}

// Create animated bar chart with gradient colors
function createGradientBarChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    const gradients = data.values.map((_, index) => {
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        const colorPair = COLORS.gradients[Object.keys(COLORS.gradients)[index % Object.keys(COLORS.gradients).length]];
        gradient.addColorStop(0, colorPair[0]);
        gradient.addColorStop(1, colorPair[1]);
        return gradient;
    });
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels || [],
            datasets: [{
                label: options.label || 'Data',
                data: data.values || [],
                backgroundColor: gradients,
                borderColor: gradients,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            ...CHARTJS_CONFIG,
            ...options,
            scales: {
                ...CHARTJS_CONFIG.scales,
                y: {
                    ...CHARTJS_CONFIG.scales.y,
                    beginAtZero: true,
                    max: options.maxValue || undefined
                }
            }
        }
    });
}

// Create radar chart for model comparison
function createRadarChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.labels || ['Accuracy', 'F1 Score', 'Precision', 'Recall'],
            datasets: data.datasets.map((dataset, index) => ({
                label: dataset.label,
                data: dataset.data,
                borderColor: COLORS.gradients[Object.keys(COLORS.gradients)[index % Object.keys(COLORS.gradients).length]][0],
                backgroundColor: COLORS.gradients[Object.keys(COLORS.gradients)[index % Object.keys(COLORS.gradients).length]][0] + '20',
                borderWidth: 3,
                pointBackgroundColor: COLORS.gradients[Object.keys(COLORS.gradients)[index % Object.keys(COLORS.gradients).length]][0],
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }))
        },
        options: {
            ...CHARTJS_CONFIG,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                        font: {
                            family: 'Poppins, sans-serif',
                            size: 12
                        },
                        color: '#6c757d'
                    },
                    ticks: {
                        display: false
                    }
                }
            },
            ...options
        }
    });
}

// Real-time chart update function
function updateChartData(chart, newData, animated = true) {
    if (!chart || !newData) return;
    
    if (chart.data.datasets && chart.data.datasets[0]) {
        chart.data.datasets[0].data = newData.values || newData;
        if (newData.labels) {
            chart.data.labels = newData.labels;
        }
        
        chart.update(animated ? 'active' : 'none');
    }
}

// Destroy chart instance safely
function destroyChart(chart) {
    if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
    }
}

// Enhanced plot regeneration with better error handling
function regeneratePlot(containerId) {
    const plotType = containerId.split('-')[0];
    
    // Show loading state
    showPlotLoading(containerId, `Regenerating ${plotType} plot...`);
    
    // Add delay for better UX
    setTimeout(() => {
        switch(plotType) {
            case 'accuracy':
                if (typeof loadPlotForTab === 'function') {
                    loadPlotForTab('accuracy-tab');
                } else {
                    handlePlotError(containerId, 'Unable to reload accuracy plot');
                }
                break;
            case 'f1':
                if (typeof loadPlotForTab === 'function') {
                    loadPlotForTab('f1-tab');
                } else {
                    handlePlotError(containerId, 'Unable to reload F1 score plot');
                }
                break;
            case 'radar':
                if (typeof loadPlotForTab === 'function') {
                    loadPlotForTab('radar-tab');
                } else {
                    handlePlotError(containerId, 'Unable to reload radar plot');
                }
                break;
            case 'training':
                if (typeof loadPlotForTab === 'function') {
                    loadPlotForTab('training-tab');
                } else {
                    handlePlotError(containerId, 'Unable to reload training plot');
                }
                break;
            case 'performance':
                if (typeof loadPlotForTab === 'function') {
                    loadPlotForTab('performance-tab');
                } else {
                    handlePlotError(containerId, 'Unable to reload performance data');
                }
                break;
            case 'improvements':
                if (typeof loadPlotForTab === 'function') {
                    loadPlotForTab('improvements-tab');
                } else {
                    handlePlotError(containerId, 'Unable to reload improvements plot');
                }
                break;
            default:
                handlePlotError(containerId, `Unknown plot type: ${plotType}`);
                break;
        }
    }, 500);
}
