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

    // Create canvas element
    const canvas = document.createElement('canvas');
    partitionDisplayer.appendChild(canvas);

    const squareSize = 30;
    const padding = 5;
    const marginX = 10;
    const marginY = 10;

    // Calculate logical canvas size based on partition dimensions
    const maxRowLength = Math.max(...partition);
    const numRows = partition.length;
    const logicalWidth = maxRowLength * (squareSize + padding) + marginX * 2;
    const logicalHeight = numRows * (squareSize + padding) + marginY * 2;

    // Get available space in display panel
    const availableWidth = partitionDisplayer.clientWidth;
    const availableHeight = partitionDisplayer.clientHeight;

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
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            const x = xPos;
            const y = marginY + (colIndex * (squareSize + padding));
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
                CurrentPartition = square.newPartition;
                setTimeout(displayNewPartition, 20);
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
    ctx.strokeRect(x, y, buttonSize, buttonSize);
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + buttonSize/2, y + buttonSize/2);

    //Add callback function
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        if((x < mouseX) && (mouseX < x + buttonSize) && (y < mouseY) && (mouseY < y + buttonSize)) {
            //console.log(`Clicked button at X = ${mouseX}, Y = ${mouseY}, displaying new partition: ${newPartition} from partition: ${CurrentPartition} and symbol: ${text}`);
            CurrentPartition = newPartition;
            setTimeout(displayNewPartition, 20);
        }
    });
}

function calculate() {
    // This function will be called when the "Calculate" button is clicked.
    let result = isWinningPosition(CurrentPartition);
    // For now, it just logs the current partition.
    console.log('Calculating for partition:', CurrentPartition);
    // The goal is that this function will perform some calculations based on the current partition and decides if the partition is a winning position.
    // Here you can add logic to calculate and display results based on the partition.
    if (result) {
        const resultIndicator = document.getElementById('resultIndicator');
        resultIndicator.style.display = 'block';
        resultIndicator.style.backgroundColor = 'green'; // Indicate success
        resultIndicator.textContent = '✓'; // Checkmark for success
    } else {
        console.log('Partition is not a winning position.');
        const resultIndicator = document.getElementById('resultIndicator');
        resultIndicator.style.display = 'block';
        resultIndicator.style.backgroundColor = 'red'; // Indicate failure
        resultIndicator.textContent = '✗'; // Crossmark for failure
    }
}

function resetCalculationDisplay() {
    const resultIndicator = document.getElementById('resultIndicator');
    resultIndicator.style.display = 'none'; // Hide the result indicator
    resultIndicator.style.backgroundColor = ''; // Reset background color
    resultIndicator.textContent = ''; // Clear text content
}

function displayPartitionNumbers(partition) {
    const partitionNumbers = document.getElementById('partitionNumbers');
    partitionNumbers.innerHTML = partition.toString();
}

function displayNewPartition() {
    displayPartitionListAndButtons(CurrentPartition);
    displayPartitionYoungDiagram(CurrentPartition);
    displayPartitionNumbers(CurrentPartition);
    resetCalculationDisplay();
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

    // Create rectangular partition: [width, width, width, ..., width] (height times)
    CurrentPartition = Array(height).fill(width);

    // Clear input fields
    widthInput.value = '';
    heightInput.value = '';

    // Display the new partition
    displayNewPartition();
}

let CurrentPartition = [1];
window.addEventListener('load', () => {
    displayNewPartition();
});