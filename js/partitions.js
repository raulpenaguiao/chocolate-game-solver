function StandardPartition(partition) {
    // Ensure the partition is in standard form (non-increasing order and no zeroes)
    return partition.filter(n => n > 0).slice().sort((a, b) => b - a);
}

function RemovePart(partition, index) {
    return StandardPartition(partition.slice(0, index).concat(partition.slice(index + 1)));
}

function AddOne(partition, index) {
    return StandardPartition(partition.slice(0, index).concat([partition[index] + 1]).concat(partition.slice(index + 1)));
}

function AddOnePart(partition) {
    return StandardPartition(partition.concat([1]));
}

function RemoveOne(partition, index) {
    return StandardPartition(partition.slice(0, index).concat([partition[index] - 1]).concat(partition.slice(index + 1)));
}

function RemoveBlock(partition, row, col, verbose = false) {
    // This function removes a block from the partition at the specified row and column.
    if (verbose) console.log(`Removing block at row ${row}, column ${col} from partition ${partition}`);
    if (row < 2) {
        if(col < 2) {
            if (verbose) console.log(StandardPartition([]));
            return StandardPartition([]);
        }
        let secondPart = partition.map(x => Math.min(x, col - 1));
        if (verbose) console.log(StandardPartition(secondPart));
        return StandardPartition(secondPart);
    }
    if( row > partition.length ) {
        if (verbose) console.log(StandardPartition(partition));
        return StandardPartition(partition);
    }
    let firstPart = partition.slice(0, row-1);
    let secondPart = partition.slice(row-1, partition.length).map(x => Math.min(x, col - 1));
    if (verbose) console.log(firstPart);
    if (verbose) console.log(secondPart);
    if (verbose) console.log(StandardPartition(firstPart.concat(secondPart)));
    return StandardPartition(firstPart.concat(secondPart));
}
    
function GenerateSmallerPartitions(partition) {
    // This function generates all smaller partitions by removing one part at a time.
    // This ensures that the partitions are in standard form.
    // It also ensures that they are in non-decreasing order.
    let smallerPartitions = [[]];
    if (partition.length === 0) return smallerPartitions;
    for (let i = 1; i <= partition[0]; i++) {
        let trimmedPartition = partition.slice(1).map(x => Math.min(x, i));
        GenerateSmallerPartitions(trimmedPartition).forEach(partition => {
            smallerPartitions.push([i].concat(partition));
        });
    }
    return smallerPartitions;
}


function GenerateBlockRemovedPartitions(partition, verbose = false) {
    // This function generates all partitions by removing one block at a time.
    // It ensures that the partitions are in standard form.
    let blockRemovedPartitions = [];
    if (verbose) console.log(`Generating block removed partitions for ${partition}`);
    if (verbose) console.log(`Generating block removed partitions for ${partition.length} indices`);
    for (let i = 1; i <= partition.length; i++) {
        if (verbose) console.log(`Generating block removed partitions at index ${i}`);
        for (let j = 1; j <= partition[i-1]; j++) {
            if (verbose) console.log(`Generating block removed partitions at index ${i} height ${j}`);
            let newPartition = RemoveBlock(partition, i, j, verbose);
            if (verbose) console.log(newPartition);
            blockRemovedPartitions.push(newPartition);
        }
    }
    if (verbose) console.log(`Generated block removed partitions for ${partition} gave ${blockRemovedPartitions.length} partitions: ${blockRemovedPartitions}`);
    return blockRemovedPartitions;
}



function isWinningPosition(partition, verbose = false) {
    // This function checks if the given partition is a winning position.
    let listPartitions = GenerateSmallerPartitions(partition);
    let winningPositions = {};
    listPartitions.forEach(partition => {
        let flag = (partition.length == 0);
        let generates = GenerateBlockRemovedPartitions(partition, verbose);
        if (verbose) console.log(partition);
        if (verbose) console.log(generates);
        //console.log(`Checking partition: ${partition}, initial generates: ${generates}`);
        generates.forEach(blockRemovedPartition => {
            if (!winningPositions[blockRemovedPartition]) {
                flag = true;
            }
        });
        if (verbose) console.log(`Winning position for ${partition}: ${flag}`);
        winningPositions[partition] = flag;
    });
    return winningPositions[partition];
}
