/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});

//A partition is a sequence of non-increasing positive integers, like [4, 3, 3, 1, 1].
function displayPartitionYoungDiagram(partition) {
    const partitionDisplayer = document.getElementById('partitionDisplayer');
    partitionDisplayer.innerHTML = ''; // Clear previous content

    // Guard: empty partition means the game is over
    if (!partition || partition.length === 0) {
        const msg = document.createElement('p');
        msg.textContent = 'No chocolate left!';
        msg.style.cssText = 'font-size:1.25rem; color:var(--bs-secondary); text-align:center; margin:0;';
        partitionDisplayer.appendChild(msg);
        return;
    }

    // Guard: layout not ready yet — skip silently
    const availableWidth = partitionDisplayer.clientWidth;
    const availableHeight = partitionDisplayer.clientHeight;
    if (availableWidth <= 0 || availableHeight <= 0) return;

    // Create canvas element
    const canvas = document.createElement('canvas');
    partitionDisplayer.appendChild(canvas);

    const squareSize = 30;
    const padding = 5;
    const marginX = 10;
    const marginY = 10;

    // Calculate logical canvas size based on partition dimensions
    const maxColHeight = Math.max(...partition);
    const numCols = partition.length;
    const logicalWidth = numCols * (squareSize + padding) + marginX * 2;
    const logicalHeight = maxColHeight * (squareSize + padding) + marginY * 2;

    // Calculate scale factor - allow scrolling if content is too large
    const maxWidth = availableWidth - 40; // Account for padding and scrollbar
    const maxHeight = availableHeight - 40;
    const scaleX = maxWidth / logicalWidth;
    const scaleY = maxHeight / logicalHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in, only out

    // Set canvas size based on logical size with scaling
    canvas.width = Math.max(logicalWidth * scale, availableWidth);
    canvas.height = Math.max(logicalHeight * scale, availableHeight);

    const ctx = canvas.getContext('2d');

    // Calculate centering offset - only center if content is smaller than viewport
    const scaledWidth = logicalWidth * scale;
    const scaledHeight = logicalHeight * scale;
    const offsetX = Math.max(0, (availableWidth - scaledWidth) / 2);
    const offsetY = Math.max(0, (availableHeight - scaledHeight) / 2);

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Store square positions for click detection
    const squarePositions = [];

    let xPos = marginX;

    // Draw squares for each number in the partition
    partition.forEach((part, rowIndex) => {
        for (let colIndex = 0; colIndex < part; colIndex++) {
            const x = xPos;
            const y = marginY + (colIndex * (squareSize + padding));

            const isHint = _hintMoves.some(h =>
                h.partitionIdx === rowIndex + 1 && h.heightIdx === colIndex + 1);

            ctx.fillStyle = isHint
                ? 'rgba(34, 197, 94, 0.7)'
                : 'rgba(139, 90, 43, 0.82)';
            ctx.fillRect(x, y, squareSize, squareSize);

            const dark = document.body.getAttribute('data-theme') === 'dark';
            ctx.strokeStyle = dark ? '#c8a46e' : '#5a3010';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y, squareSize, squareSize);

            // Store position and partition info for click detection
            squarePositions.push({
                x: x,
                y: y,
                size: squareSize,
                newPartition: RemoveBlock(partition, rowIndex + 1, colIndex + 1)
            });
        }
        xPos += squareSize + padding;
    });

    ctx.restore();

    // Single click handler for the entire canvas
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Convert click coordinates to logical coordinates
        // Account for the canvas transformation (translate and scale)
        const logicalX = (clickX - offsetX) / scale;
        const logicalY = (clickY - offsetY) / scale;

        // Check which square was clicked
        for (let square of squarePositions) {
            if (logicalX >= square.x && logicalX <= square.x + square.size &&
                logicalY >= square.y && logicalY <= square.y + square.size) {
                setPartition(square.newPartition);
                return;
            }
        }
    });
}

function displayPartitionListAndButtons(partition) {
    const partitionSelect = document.getElementById('partitionSelect');
    partitionSelect.innerHTML = ''; // Clear previous content

    const canvas = document.createElement('canvas');
    const buttonSize = 25;
    const spacing = 5;
    const padding = 10;

    // Calculate canvas dimensions based on partition length
    canvas.width = partition.length * (buttonSize + spacing * 2) + (buttonSize + spacing) + padding * 2;
    canvas.height = (4 * (buttonSize + spacing)) + padding * 2;
    partitionSelect.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Fill canvas background to match theme
    const bgColor = getComputedStyle(document.body).getPropertyValue('--bs-body-bg').trim();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    partition.forEach((num, index) => {
        const x = padding + index * (buttonSize + spacing);

        if( partition.length > 1 ) drawSquare(ctx, x, padding + (0 * (buttonSize + spacing)), buttonSize, '🗑', canvas, RemovePart(partition, index))
        drawSquare(ctx, x, padding + (1 * (buttonSize + spacing)), buttonSize, '+', canvas, AddOne(partition, index))
        drawSquare(ctx, x, padding + (2 * (buttonSize + spacing)), buttonSize, num.toString(), canvas, partition)
        if( num > 1 ) drawSquare(ctx, x, padding + (3 * (buttonSize + spacing)), buttonSize, '-', canvas, RemoveOne(partition, index))

    });
    drawSquare(ctx, padding + partition.length * (buttonSize + spacing), padding + (2 * (buttonSize + spacing)), buttonSize, '+', canvas, AddOnePart(partition));
}

function drawSquare(ctx, x, y, buttonSize, text, canvas, newPartition) {
    const dark = document.body.getAttribute('data-theme') === 'dark';
    ctx.strokeStyle = dark ? '#7ab3cc' : '#333';
    ctx.strokeRect(x, y, buttonSize, buttonSize);
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = dark ? '#b8cdd6' : '#000';
    ctx.fillText(text, x + buttonSize/2, y + buttonSize/2);

    //Add callback function
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        if((x < mouseX) && (mouseX < x + buttonSize) && (y < mouseY) && (mouseY < y + buttonSize)) {
            setPartition(newPartition);
        }
    });
}

let _calcWorker = null;
let _calcTimeout = null;
let _hintMoves = [];
let _partitionHistory = [];

function setPartition(newPartition) {
    _partitionHistory.push([...CurrentPartition]);
    CurrentPartition = newPartition;
    document.getElementById('undoButton').disabled = false;
    setTimeout(displayNewPartition, 20);
}

function undoMove() {
    if (_partitionHistory.length === 0) return;
    CurrentPartition = _partitionHistory.pop();
    document.getElementById('undoButton').disabled = (_partitionHistory.length === 0);
    displayNewPartition();
}

function calculate() {
    if (_calcWorker) {
        _calcWorker.terminate();
        _calcWorker = null;
    }
    clearTimeout(_calcTimeout);

    const resultIndicator = document.getElementById('resultIndicator');
    const tooBigMessage = document.getElementById('tooBigMessage');
    const calcButton = document.getElementById('calculateButton');

    resultIndicator.style.display = 'none';
    resultIndicator.className = '';
    tooBigMessage.style.display = 'none';
    calcButton.disabled = true;
    calcButton.textContent = 'Calculating…';

    const worker = new Worker('js/worker.js');
    _calcWorker = worker;

    _calcTimeout = setTimeout(() => {
        worker.terminate();
        _calcWorker = null;
        calcButton.disabled = false;
        calcButton.textContent = 'Calculate';
        tooBigMessage.style.display = 'block';
    }, 3000);

    worker.addEventListener('message', e => {
        clearTimeout(_calcTimeout);
        _calcWorker = null;
        calcButton.disabled = false;
        calcButton.textContent = 'Calculate';

        const { isWinning, winningMoves } = e.data;
        resultIndicator.style.display = 'block';
        if (isWinning) {
            resultIndicator.className = 'result-winning';
            resultIndicator.textContent = 'Current player has a winning strategy!';
            _hintMoves = winningMoves;
            requestAnimationFrame(() => displayPartitionYoungDiagram(CurrentPartition));
        } else {
            resultIndicator.className = 'result-losing';
            resultIndicator.textContent = 'Current player cannot guarantee a victory here.';
        }
    });

    worker.postMessage(CurrentPartition);
}

function resetCalculationDisplay() {
    if (_calcWorker) {
        _calcWorker.terminate();
        _calcWorker = null;
    }
    clearTimeout(_calcTimeout);
    _hintMoves = [];

    const calcButton = document.getElementById('calculateButton');
    calcButton.disabled = false;
    calcButton.textContent = 'Calculate';

    const resultIndicator = document.getElementById('resultIndicator');
    resultIndicator.style.display = 'none';
    resultIndicator.className = '';
    resultIndicator.textContent = '';

    document.getElementById('tooBigMessage').style.display = 'none';
}

function displayPartitionNumbers(partition) {
    const partitionNumbers = document.getElementById('partitionNumbers');
    partitionNumbers.innerHTML = partition.toString();
}

function displayNewPartition() {
    resetCalculationDisplay();
    displayPartitionListAndButtons(CurrentPartition);
    displayPartitionYoungDiagram(CurrentPartition);
    displayPartitionNumbers(CurrentPartition);
}

function createRectangularPartition() {
    const widthInput = document.getElementById('rectWidth');
    const heightInput = document.getElementById('rectHeight');

    const width = parseInt(widthInput.value, 10);
    const height = parseInt(heightInput.value, 10);

    // Validation
    if (isNaN(width) || isNaN(height) || width < 1 || height < 1) {
        alert('Please enter positive numbers for both width and height');
        return;
    }

    setPartition(Array(width).fill(height));
}

// ── Dark mode ────────────────────────────────────────────────
function toggleDarkMode() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    document.getElementById('darkModeButton').textContent = next === 'dark' ? '☀️' : '🌙';
    displayPartitionListAndButtons(CurrentPartition);
    displayPartitionYoungDiagram(CurrentPartition);
}

function applyTheme() {
    const saved = localStorage.getItem('theme');
    const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.body.setAttribute('data-theme', theme);
    const btn = document.getElementById('darkModeButton');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ── Share link ───────────────────────────────────────────────
function shareLink() {
    const hash = '#p=' + CurrentPartition.join(',');
    const url = window.location.href.split('#')[0] + hash;

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'share-toast';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 1500);
    }

    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => showToast('Link copied!'));
    } else {
        window.location.hash = hash;
        prompt('Copy this link:', url);
    }
}

function loadFromHash() {
    const hash = window.location.hash;
    if (!hash.startsWith('#p=')) return;
    const nums = hash.slice(3).split(',')
        .map(Number)
        .filter(n => Number.isInteger(n) && n > 0);
    if (nums.length > 0) {
        CurrentPartition = nums.slice().sort((a, b) => b - a);
    }
}

let CurrentPartition = [1];
window.addEventListener('load', () => {
    applyTheme();
    loadFromHash();
    displayNewPartition();
    tutInit();

    // Redraw when the display panel is resized
    const displayer = document.getElementById('partitionDisplayer');
    if (window.ResizeObserver) {
        new ResizeObserver(() => {
            displayPartitionYoungDiagram(CurrentPartition);
        }).observe(displayer);
    }

    // Swipe right on the display panel → undo
    const displayPanel = document.getElementById('displayPanel');
    let touchStartX = 0;
    let touchStartY = 0;
    displayPanel.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    displayPanel.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (dx > 60 && Math.abs(dy) < Math.abs(dx) * 0.6) {
            undoMove();
        }
    }, { passive: true });
});