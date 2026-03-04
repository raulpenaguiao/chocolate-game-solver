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

function isWinningPosition(partition) {
    let listPartitions = GenerateSmallerPartitions(partition);
    let winningPositions = {};
    listPartitions.forEach(p => {
        let flag = (p.length === 0);
        GenerateBlockRemovedPartitions(p).forEach(brp => {
            if (!winningPositions[brp]) flag = true;
        });
        winningPositions[p] = flag;
    });
    return winningPositions[partition];
}

self.addEventListener('message', e => {
    const result = isWinningPosition(e.data);
    self.postMessage(result);
});
