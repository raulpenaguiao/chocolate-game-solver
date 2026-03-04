// Partition calculation worker — mirrors partitions.js logic

function StandardPartition(partition) {
    return partition.filter(n => n > 0).slice().sort((a, b) => b - a);
}

function RemoveBlock(partition, row, col) {
    if (row < 2) {
        if (col < 2) return StandardPartition([]);
        return StandardPartition(partition.map(x => Math.min(x, col - 1)));
    }
    if (row > partition.length) return StandardPartition(partition);
    let firstPart = partition.slice(0, row - 1);
    let secondPart = partition.slice(row - 1).map(x => Math.min(x, col - 1));
    return StandardPartition(firstPart.concat(secondPart));
}

function GenerateSmallerPartitions(partition) {
    let smallerPartitions = [[]];
    if (partition.length === 0) return smallerPartitions;
    for (let i = 1; i <= partition[0]; i++) {
        let trimmed = partition.slice(1).map(x => Math.min(x, i));
        GenerateSmallerPartitions(trimmed).forEach(p => {
            smallerPartitions.push([i].concat(p));
        });
    }
    return smallerPartitions;
}

function GenerateBlockRemovedPartitions(partition) {
    let result = [];
    for (let i = 1; i <= partition.length; i++) {
        for (let j = 1; j <= partition[i - 1]; j++) {
            result.push(RemoveBlock(partition, i, j));
        }
    }
    return result;
}

self.addEventListener('message', e => {
    const partition = e.data;
    const listPartitions = GenerateSmallerPartitions(partition);
    const winningPositions = {};

    listPartitions.forEach(p => {
        let flag = (p.length === 0);
        GenerateBlockRemovedPartitions(p).forEach(brp => {
            if (!winningPositions[brp]) flag = true;
        });
        winningPositions[p] = flag;
    });

    const isWinning = winningPositions[partition];

    // Find the winning move: the block whose removal leaves a losing position
    let winningMove = null;
    if (isWinning) {
        outer: for (let i = 0; i < partition.length; i++) {
            for (let j = 1; j <= partition[i]; j++) {
                if (!winningPositions[RemoveBlock(partition, i + 1, j)]) {
                    winningMove = { partitionIdx: i + 1, heightIdx: j };
                    break outer;
                }
            }
        }
    }

    self.postMessage({ isWinning, winningMove });
});
