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
    canvas.width = 400;
    canvas.height = 200;
    partitionDisplayer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const squareSize = 30;
    const padding = 5;
    let xPos = 10;
    let yPos = 10;

    // Draw squares for each number in the partition
    partition.forEach((part, index) => {
        for (let i = 0; i < part; i++) {
            ctx.strokeStyle = '#000';
            const x = xPos;
            const y = yPos + (i * (squareSize + padding));
            ctx.strokeRect(x, y, squareSize, squareSize);
            let newPartition = RemoveBlock(partition, index + 1, i + 1);
            canvas.addEventListener('click', (event) => {
                const rect = canvas.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
                if(x < mouseX && mouseX < x + squareSize && y < mouseY && mouseY < y + squareSize) {
                    //console.log(`Clicked button at X = ${mouseX}, Y = ${mouseY}`);
                    CurrentPartition = newPartition;
                    setTimeout(displayNewPartition, 20);
                }
            });
        }
        xPos += squareSize + padding;
    });
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        console.log(`Clicked square at X = ${mouseX + 1}, Y = ${mouseY + 1}`);

        partition.forEach((part, rowIndex) => {
            for (let colIndex = 0; colIndex < part; colIndex++) {
                const squareX = xPos + (colIndex * (squareSize + padding));
                const squareY = yPos - ((partition.length - rowIndex) * (squareSize + padding));
                
                if (mouseX >= squareX && mouseX <= squareX + squareSize &&
                    mouseY >= squareY && mouseY <= squareY + squareSize) {
                    console.log(`Clicked square at row ${rowIndex + 1}, column ${colIndex + 1}`);
                }
            }
        });
    });
}

function displayPartitionListAndButtons(partition) {
    const partitionSelect = document.getElementById('partitionSelect');
    partitionSelect.innerHTML = ''; // Clear previous content

    const canvas = document.createElement('canvas');
    canvas.width = partition.length * 120;  // Width to accommodate 4 buttons per partition number
    canvas.height = 240;
    partitionSelect.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const buttonSize = 25;
    const spacing = 5;
    const padding = 10;

    partition.forEach((num, index) => {
        const x = padding + index * (buttonSize + spacing);

        if( partition.length > 1 ) drawSquare(ctx, x, padding + (0 * (buttonSize + spacing)), buttonSize, '🗑', canvas, RemovePart(partition, index))
        drawSquare(ctx, x, padding + (1 * (buttonSize + spacing)), buttonSize, '+', canvas, AddOne(partition, index))
        drawSquare(ctx, x, padding + (2 * (buttonSize + spacing)), buttonSize, num.toString(), canvas, partition)
        if( num > 1 ) drawSquare(ctx, x, padding + (3 * (buttonSize + spacing)), buttonSize, '-', canvas, RemoveOne(partition, index))

    });
    drawSquare(ctx, padding + partition.length * (buttonSize + spacing), padding + (2 * (buttonSize + spacing)), buttonSize, '+', canvas, AddOnePart(partition));

    partitionSelect.appendChild(canvas);
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

let CurrentPartition = [1];
window.addEventListener('load', () => {
    displayNewPartition();
});