(function () {
    let currentSlide = 1;
    const TOTAL_SLIDES = 4;

    function tutDrawPartition(canvas, partition, opts) {
        opts = opts || {};
        const squareSize = 28;
        const gap = 4;
        const step = squareSize + gap;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!partition || partition.length === 0) {
            ctx.font = '13px sans-serif';
            ctx.fillStyle = '#888';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('(no chocolate left)', canvas.width / 2, canvas.height / 2);
            return;
        }

        const numCols = partition.length;
        const maxColHeight = Math.max(...partition);
        const diagWidth = numCols * step - gap;
        const diagHeight = maxColHeight * step - gap;
        const startX = Math.floor((canvas.width - diagWidth) / 2);
        const startY = Math.floor((canvas.height - diagHeight) / 2);

        for (let col = 0; col < partition.length; col++) {
            for (let row = 0; row < partition[col]; row++) {
                const x = startX + col * step;
                const y = startY + row * step;
                const c1 = col + 1;
                const r1 = row + 1;

                const isHighlighted = opts.highlightCol === c1 && opts.highlightRow === r1;
                const isFaded = opts.highlightCol !== undefined &&
                    c1 >= opts.highlightCol && r1 >= opts.highlightRow &&
                    !isHighlighted;

                if (isHighlighted) {
                    ctx.fillStyle = 'rgba(220, 53, 69, 0.85)';
                    ctx.fillRect(x, y, squareSize, squareSize);
                    ctx.strokeStyle = '#a00';
                } else if (isFaded) {
                    ctx.fillStyle = 'rgba(160, 120, 80, 0.2)';
                    ctx.fillRect(x, y, squareSize, squareSize);
                    ctx.strokeStyle = '#bbb';
                } else {
                    ctx.fillStyle = 'rgba(139, 90, 43, 0.82)';
                    ctx.fillRect(x, y, squareSize, squareSize);
                    ctx.strokeStyle = '#5a3010';
                }
                ctx.lineWidth = 1.5;
                ctx.strokeRect(x, y, squareSize, squareSize);
            }
        }
    }

    function tutShowSlide(n) {
        currentSlide = n;
        document.querySelectorAll('.tutorial-slide').forEach(function (el, i) {
            el.style.display = (i + 1 === n) ? 'flex' : 'none';
        });
        document.getElementById('tut-indicator').textContent = n + ' / ' + TOTAL_SLIDES;
        document.getElementById('tut-back').disabled = (n === 1);
        document.getElementById('tut-next').style.display = (n === TOTAL_SLIDES) ? 'none' : 'inline-block';
        document.getElementById('tut-finish').style.display = (n === TOTAL_SLIDES) ? 'inline-block' : 'none';
    }

    function tutNext() {
        if (currentSlide < TOTAL_SLIDES) tutShowSlide(currentSlide + 1);
    }

    function tutBack() {
        if (currentSlide > 1) tutShowSlide(currentSlide - 1);
    }

    function tutEnd() {
        document.getElementById('tutorialOverlay').style.display = 'none';
    }

    function tutInit() {
        tutDrawPartition(document.getElementById('tut-canvas-1'), [4, 4, 4]);
        tutDrawPartition(document.getElementById('tut-canvas-2'), [4, 4, 4], {
            highlightCol: 2,
            highlightRow: 2
        });
        tutDrawPartition(document.getElementById('tut-canvas-3'), []);
        tutShowSlide(1);
        document.getElementById('tutorialOverlay').style.display = 'flex';
    }

    window.tutNext = tutNext;
    window.tutBack = tutBack;
    window.tutEnd = tutEnd;
    window.tutInit = tutInit;
})();
