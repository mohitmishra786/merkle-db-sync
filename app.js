class MerkleTreeVisualizer {
    constructor() {
        this.sourceData = [];
        this.replicaData = [];
        this.sourceTree = null;
        this.replicaTree = null;
        this.comparisonState = {
            step: 0,
            mismatchedNodes: [],
            changes: []
        };
        this.currentLevel = 0;
        this.nextId = 1;
        
        this.initializeEventListeners();
        this.log('System initialized. Start by adding data or generating sample data.', 'info');
    }

    initializeEventListeners() {
        document.getElementById('generate-data').addEventListener('click', () => this.generateSampleData());
        document.getElementById('create-differences').addEventListener('click', () => this.createDifferences());
        document.getElementById('build-trees').addEventListener('click', () => this.buildTrees());
        document.getElementById('compare-roots').addEventListener('click', () => this.compareRoots());
        document.getElementById('drill-down').addEventListener('click', () => this.drillDown());
        document.getElementById('identify-changes').addEventListener('click', () => this.identifyChanges());
        document.getElementById('sync-changes').addEventListener('click', () => this.syncChanges());
        document.getElementById('reset').addEventListener('click', () => this.reset());
        
        // Tutorial toggle functionality
        const tutorialContent = document.getElementById('tutorial-content');
        const tutorialToggle = document.getElementById('tutorial-toggle');
        
        // Set initial state - tutorial content hidden by default
        tutorialContent.style.display = 'none';
        tutorialToggle.textContent = 'Show Tutorial';
        
        tutorialToggle.addEventListener('click', () => {
            if (tutorialContent.style.display === 'none') {
                tutorialContent.style.display = 'block';
                tutorialToggle.textContent = 'Hide Tutorial';
            } else {
                tutorialContent.style.display = 'none';
                tutorialToggle.textContent = 'Show Tutorial';
            }
        });
        
        // Add row buttons
        document.getElementById('add-source-row').addEventListener('click', () => this.addRow('source'));
        document.getElementById('add-replica-row').addEventListener('click', () => this.addRow('replica'));
        
        // Zoom controls
        document.getElementById('source-zoom-in').addEventListener('click', () => this.zoom('source', 1.2));
        document.getElementById('source-zoom-out').addEventListener('click', () => this.zoom('source', 0.8));
        document.getElementById('source-reset-zoom').addEventListener('click', () => this.resetZoom('source'));
        document.getElementById('replica-zoom-in').addEventListener('click', () => this.zoom('replica', 1.2));
        document.getElementById('replica-zoom-out').addEventListener('click', () => this.zoom('replica', 0.8));
        document.getElementById('replica-reset-zoom').addEventListener('click', () => this.resetZoom('replica'));
    }

    generateSampleData() {
        this.sourceData = [
            { id: 1, value: 'User data for Alice' },
            { id: 2, value: 'User data for Bob' },
            { id: 3, value: 'User data for Charlie' },
            { id: 4, value: 'User data for Diana' }
        ];

        // Create replica with identical data initially
        this.replicaData = JSON.parse(JSON.stringify(this.sourceData));
        this.nextId = 5;

        this.updateDataTables();
        this.log('Generated identical sample data for both databases (4 records each)', 'success');
        this.log('Click "Create Differences" to simulate changes in source', 'info');
        this.resetComparisonState();
    }

    createDifferences() {
        if (this.sourceData.length === 0) {
            this.log('Please generate sample data first', 'warning');
            return;
        }

        // Create differences in source (not replica)
        this.sourceData[2].value = 'Updated data for Charlie'; // Modified
        this.sourceData.push({ id: this.nextId++, value: 'New user data for Eve' }); // Added

        this.updateDataTables();
        this.log('Created 2 differences in source: 1 modification, 1 addition', 'success');
    }

    addRow(tableType) {
        try {
            if (tableType !== 'source' && tableType !== 'replica') {
                throw new Error('Invalid table type. Must be "source" or "replica"');
            }
            
            const data = tableType === 'source' ? this.sourceData : this.replicaData;
            if (!Array.isArray(data)) {
                throw new Error(`${tableType} data is not an array`);
            }
            
            const newItem = { id: this.nextId++, value: `New data ${this.nextId - 1}` };
            data.push(newItem);
            
            this.updateDataTables();
            this.log(`Added new row to ${tableType} database`, 'success');
            
        } catch (error) {
            this.log(`Error adding row to ${tableType} database: ${error.message}`, 'error');
        }
    }

    updateDataTables() {
        this.updateTable('source-tbody', this.sourceData);
        this.updateTable('replica-tbody', this.replicaData);
    }

    updateTable(tbodyId, data) {
        const tbody = document.getElementById(tbodyId);
        tbody.innerHTML = '';
        
        data.forEach((item, index) => {
            const row = tbody.insertRow();
            const idCell = row.insertCell();
            const valueCell = row.insertCell();
            const actionCell = row.insertCell();
            
            idCell.textContent = item.id;
            
            const input = document.createElement('input');
            input.value = item.value;
            input.addEventListener('change', (e) => {
                item.value = e.target.value;
            });
            valueCell.appendChild(input);
            
            // Add remove button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-row-btn';
            removeBtn.textContent = '×';
            removeBtn.title = 'Remove row';
            removeBtn.addEventListener('click', () => {
                const tableType = tbodyId === 'source-tbody' ? 'source' : 'replica';
                this.removeRow(tableType, index);
            });
            actionCell.appendChild(removeBtn);
        });
    }

    removeRow(tableType, index) {
        try {
            if (tableType !== 'source' && tableType !== 'replica') {
                throw new Error('Invalid table type. Must be "source" or "replica"');
            }
            
            const data = tableType === 'source' ? this.sourceData : this.replicaData;
            if (!Array.isArray(data)) {
                throw new Error(`${tableType} data is not an array`);
            }
            
            if (index < 0 || index >= data.length) {
                throw new Error(`Invalid index ${index}. Data length is ${data.length}`);
            }
            
            const removedItem = data.splice(index, 1)[0];
            
            this.updateDataTables();
            this.log(`Removed row with ID ${removedItem.id} from ${tableType} database`, 'success');
            
        } catch (error) {
            this.log(`Error removing row from ${tableType} database: ${error.message}`, 'error');
        }
    }

    hash(data) {
        try {
            if (!data) {
                throw new Error('Cannot hash null or undefined data');
            }
            
            // For database replication, we typically hash the value/content, not the ID
            // This makes more sense as the same content should have the same hash regardless of ID
            const contentToHash = data.value || JSON.stringify(data);
            
            if (!contentToHash) {
                throw new Error('No content to hash');
            }
            
            return CryptoJS.SHA256(contentToHash).toString().substring(0, 16);
        } catch (error) {
            this.log(`Error hashing data: ${error.message}`, 'error');
            throw error;
        }
    }

    buildMerkleTree(data) {
        try {
            if (!Array.isArray(data)) {
                throw new Error('Data must be an array');
            }
            
            if (data.length === 0) return null;

            // Create leaf nodes
            let leaves = data.map((item, index) => {
                try {
                    if (!item || typeof item.id === 'undefined' || typeof item.value === 'undefined') {
                        throw new Error(`Invalid item at index ${index}: missing id or value`);
                    }
                    
                    const hash = this.hash(item);
                    // Debug: log what's being hashed
                    console.log(`Hashing item ID ${item.id}: "${item.value}" -> ${hash}`);
                    return {
                        hash: hash,
                        data: item,
                        children: null,
                        isLeaf: true,
                        level: 0
                    };
                } catch (itemError) {
                    throw new Error(`Error processing item at index ${index}: ${itemError.message}`);
                }
            });

            // Build tree bottom-up
            let currentLevel = leaves;
            let level = 0;

            while (currentLevel.length > 1) {
                level++;
                const nextLevel = [];
                
                for (let i = 0; i < currentLevel.length; i += 2) {
                    try {
                        const left = currentLevel[i];
                        const right = currentLevel[i + 1] || { 
                            hash: '0000000000000000', 
                            data: null, 
                            children: null, 
                            isLeaf: false, 
                            level: level - 1 
                        };
                        
                        const parent = {
                            hash: this.hash(left.hash + right.hash),
                            data: null,
                            children: [left, right],
                            isLeaf: false,
                            level: level
                        };
                        
                        nextLevel.push(parent);
                    } catch (nodeError) {
                        throw new Error(`Error creating parent node at level ${level}: ${nodeError.message}`);
                    }
                }
                
                currentLevel = nextLevel;
            }

            return currentLevel[0];
            
        } catch (error) {
            this.log(`Error building Merkle tree: ${error.message}`, 'error');
            throw error;
        }
    }

    buildTrees() {
        try {
            // Validate data before building trees
            if (!Array.isArray(this.sourceData) || !Array.isArray(this.replicaData)) {
                throw new Error('Invalid data format: source and replica data must be arrays');
            }
            
            // Check for duplicate IDs in each dataset
            const sourceIds = this.sourceData.map(item => item.id);
            const replicaIds = this.replicaData.map(item => item.id);
            
            if (new Set(sourceIds).size !== sourceIds.length) {
                throw new Error('Duplicate IDs found in source data');
            }
            if (new Set(replicaIds).size !== replicaIds.length) {
                throw new Error('Duplicate IDs found in replica data');
            }
            
            // Validate data structure
            this.sourceData.forEach((item, index) => {
                if (!item || typeof item.id === 'undefined' || typeof item.value === 'undefined') {
                    throw new Error(`Invalid item at index ${index} in source data: missing id or value`);
                }
            });
            
            this.replicaData.forEach((item, index) => {
                if (!item || typeof item.id === 'undefined' || typeof item.value === 'undefined') {
                    throw new Error(`Invalid item at index ${index} in replica data: missing id or value`);
                }
            });
            
            // Build trees with error handling
            this.sourceTree = this.buildMerkleTree(this.sourceData);
            if (!this.sourceTree) {
                throw new Error('Failed to build source Merkle tree');
            }
            
            this.replicaTree = this.buildMerkleTree(this.replicaData);
            if (!this.replicaTree) {
                throw new Error('Failed to build replica Merkle tree');
            }
            
            // Render trees with error handling
            try {
                this.renderTree('source-tree', this.sourceTree, 'source');
            } catch (renderError) {
                this.log(`Error rendering source tree: ${renderError.message}`, 'error');
                throw new Error(`Failed to render source tree: ${renderError.message}`);
            }
            
            try {
                this.renderTree('replica-tree', this.replicaTree, 'replica');
            } catch (renderError) {
                this.log(`Error rendering replica tree: ${renderError.message}`, 'error');
                throw new Error(`Failed to render replica tree: ${renderError.message}`);
            }
            
            this.updateStats();
            this.log('Merkle trees built successfully', 'success');
            
            // Show hash information for debugging
            this.logHashInfo();
            
            document.getElementById('compare-roots').disabled = false;
            
        } catch (error) {
            this.log(`Error building trees: ${error.message}`, 'error');
            document.getElementById('compare-roots').disabled = true;
            
            // Clear tree containers on error
            document.getElementById('source-tree').innerHTML = '<div class="error-message">Failed to build source tree</div>';
            document.getElementById('replica-tree').innerHTML = '<div class="error-message">Failed to build replica tree</div>';
        }
    }

    logHashInfo() {
        this.log('Hash Information:', 'info');
        this.sourceData.forEach(item => {
            const hash = this.hash(item);
            this.log(`  Source ID ${item.id}: "${item.value}" -> ${hash}`, 'info');
        });
        this.replicaData.forEach(item => {
            const hash = this.hash(item);
            this.log(`  Replica ID ${item.id}: "${item.value}" -> ${hash}`, 'info');
        });
    }

    renderTree(containerId, root, treeType) {
        try {
            if (!root) {
                throw new Error('Cannot render tree: root node is null or undefined');
            }

            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`Container with ID '${containerId}' not found`);
            }
            
            container.innerHTML = '';
            
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            if (width <= 0 || height <= 0) {
                throw new Error(`Invalid container dimensions: ${width}x${height}`);
            }
            
            const margin = { top: 40, right: 40, bottom: 40, left: 40 };

            const svg = d3.select(container)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            // Add zoom behavior with pan
            const zoom = d3.zoom()
                .scaleExtent([0.1, 3])
                .on('zoom', (event) => {
                    g.attr('transform', event.transform);
                });

            svg.call(zoom);

            // Add arrow marker for sync visualization
            svg.append('defs').append('marker')
                .attr('id', `arrowhead-${treeType}`)
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 8)
                .attr('refY', 0)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', '#e74c3c');

            const g = svg.append('g');

            const treeLayout = d3.tree()
                .size([width - margin.left - margin.right, height - margin.top - margin.bottom]);

            const hierarchy = d3.hierarchy(root);
            const treeData = treeLayout(hierarchy);

            // Center the tree by translating the group
            const treeWidth = d3.max(treeData.descendants(), d => d.x) - d3.min(treeData.descendants(), d => d.x);
            const treeHeight = d3.max(treeData.descendants(), d => d.y) - d3.min(treeData.descendants(), d => d.y);
            
            const translateX = (width - treeWidth) / 2 - d3.min(treeData.descendants(), d => d.x);
            const translateY = (height - treeHeight) / 2 - d3.min(treeData.descendants(), d => d.y);
            
            // Apply initial transform to center the tree
            g.attr('transform', `translate(${translateX}, ${translateY})`);
            
            // Store the initial transform for reset functionality
            this[`${treeType}InitialTransform`] = { x: translateX, y: translateY };

        // Create links
        const links = g.selectAll('.link')
            .data(treeData.links())
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));

        // Create nodes
        const nodes = g.selectAll('.node')
            .data(treeData.descendants())
            .enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y},${d.x})`);

        // Add circles to nodes
        nodes.append('circle')
            .attr('r', 10)
            .attr('class', d => {
                if (d.data.isLeaf) return 'node-leaf';
                if (d.data.level === 0) return 'node-root';
                return 'node-internal';
            });

        // Add labels
        nodes.append('text')
            .attr('class', 'node-label')
            .attr('dy', '0.35em')
            .attr('x', d => d.children ? -15 : 15)
            .attr('text-anchor', d => d.children ? 'end' : 'start')
            .text(d => d.data.hash.substring(0, 8));

        // Add tooltips
        nodes.on('mouseover', (event, d) => {
            const tooltip = document.getElementById('tooltip');
            let content = `Hash: ${d.data.hash}`;
            if (d.data.data) {
                content += `<br>ID: ${d.data.data.id}`;
                content += `<br>Value: ${d.data.data.value}`;
            }
            tooltip.innerHTML = content;
            tooltip.style.display = 'block';
            tooltip.style.left = event.pageX + 10 + 'px';
            tooltip.style.top = event.pageY - 10 + 'px';
        })
        .on('mouseout', () => {
            document.getElementById('tooltip').style.display = 'none';
        });

        // Store references for highlighting and zoom
        this[`${treeType}Nodes`] = nodes;
        this[`${treeType}Links`] = links;
        this[`${treeType}Zoom`] = zoom;
        this[`${treeType}Svg`] = svg;
        this[`${treeType}G`] = g;
        
        } catch (error) {
            this.log(`Error rendering ${treeType} tree: ${error.message}`, 'error');
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `<div class="error-message">Failed to render ${treeType} tree: ${error.message}</div>`;
            }
            throw error;
        }
    }

    updateStats() {
        if (this.sourceTree) {
            document.getElementById('source-nodes').textContent = this.countNodes(this.sourceTree);
            document.getElementById('source-height').textContent = this.getTreeHeight(this.sourceTree);
            document.getElementById('source-root-hash').textContent = this.sourceTree.hash;
        }
        
        if (this.replicaTree) {
            document.getElementById('replica-nodes').textContent = this.countNodes(this.replicaTree);
            document.getElementById('replica-height').textContent = this.getTreeHeight(this.replicaTree);
            document.getElementById('replica-root-hash').textContent = this.replicaTree.hash;
        }
    }

    countNodes(node) {
        if (!node) return 0;
        return 1 + (node.children ? node.children.reduce((sum, child) => sum + this.countNodes(child), 0) : 0);
    }

    getTreeHeight(node) {
        if (!node) return 0;
        if (!node.children) return 0;
        return 1 + Math.max(...node.children.map(child => this.getTreeHeight(child)));
    }

    compareRoots() {
        try {
            if (!this.sourceTree || !this.replicaTree) {
                throw new Error('Please build trees first');
            }

            this.highlightRoots();
            
            if (this.sourceTree.hash === this.replicaTree.hash) {
                this.log('Root hashes match! No synchronization needed.', 'success');
            } else {
                this.log(`Root hashes differ: Source: ${this.sourceTree.hash} vs Replica: ${this.replicaTree.hash}`, 'warning');
                this.log('Click "Drill Down" to traverse mismatched branches', 'info');
                document.getElementById('drill-down').disabled = false;
            }
        } catch (error) {
            this.log(`Error comparing roots: ${error.message}`, 'error');
        }
    }

    highlightRoots() {
        // Highlight root nodes
        this.sourceNodes.select('circle').classed('node-highlighted', d => d.data.level === 0);
        this.replicaNodes.select('circle').classed('node-highlighted', d => d.data.level === 0);
    }

    drillDown() {
        this.currentLevel++;
        const mismatched = this.findMismatchedNodes(this.sourceTree, this.replicaTree, this.currentLevel);
        
        if (mismatched.length > 0) {
            this.highlightMismatchedNodes(mismatched);
            this.log(`Found ${mismatched.length} mismatched nodes at level ${this.currentLevel}`, 'warning');
            mismatched.forEach(({ source, replica, path }) => {
                this.log(`  - Mismatch at path ${path}: Source=${source.hash.substring(0,8)} vs Replica=${replica.hash.substring(0,8)}`, 'info');
            });
            document.getElementById('identify-changes').disabled = false;
        } else {
            this.log('No more mismatches found at this level', 'info');
        }
    }

    findMismatchedNodes(sourceNode, replicaNode, targetLevel, path = '') {
        if (!sourceNode || !replicaNode) return [];
        
        if (sourceNode.level === targetLevel) {
            return sourceNode.hash !== replicaNode.hash ? [{ source: sourceNode, replica: replicaNode, path }] : [];
        }
        
        if (!sourceNode.children || !replicaNode.children) return [];
        
        const mismatched = [];
        for (let i = 0; i < Math.max(sourceNode.children.length, replicaNode.children.length); i++) {
            const sourceChild = sourceNode.children[i];
            const replicaChild = replicaNode.children[i];
            const childPath = path + (i === 0 ? 'L' : 'R');
            
            mismatched.push(...this.findMismatchedNodes(sourceChild, replicaChild, targetLevel, childPath));
        }
        
        return mismatched;
    }

    highlightMismatchedNodes(mismatched) {
        // Clear previous highlights
        this.sourceNodes.select('circle').classed('node-different', false);
        this.replicaNodes.select('circle').classed('node-different', false);
        
        // Highlight mismatched nodes
        mismatched.forEach(({ source, replica }) => {
            this.sourceNodes.select('circle').filter(d => d.data === source).classed('node-different', true);
            this.replicaNodes.select('circle').filter(d => d.data === replica).classed('node-different', true);
        });
    }

    identifyChanges() {
        this.log('Starting detailed change identification with visual trace...', 'info');
        
        // Clear previous highlights
        this.clearAllHighlights();
        
        const changes = this.findLeafChanges(this.sourceTree, this.replicaTree);
        this.comparisonState.changes = changes;
        
        // Show visual trace for each change
        this.showChangeTrace(changes);
        
        this.log(`Identified ${changes.length} changed leaf nodes:`, 'info');
        changes.forEach(change => {
            this.log(`- ${change.type}: ${change.description}`, 'warning');
        });
        
        document.getElementById('sync-changes').disabled = false;
    }

    clearAllHighlights() {
        this.sourceNodes.select('circle').classed('node-trace', false);
        this.replicaNodes.select('circle').classed('node-trace', false);
        this.sourceNodes.select('circle').classed('node-different', false);
        this.replicaNodes.select('circle').classed('node-different', false);
        this.sourceLinks.select('path').classed('link-trace', false);
        this.replicaLinks.select('path').classed('link-trace', false);
    }

    showChangeTrace(changes) {
        if (changes.length === 0) {
            this.log('No changes found to trace', 'info');
            return;
        }

        this.log('Tracing paths from root to changed leaf nodes...', 'info');
        
        changes.forEach((change, index) => {
            setTimeout(() => {
                this.traceSingleChange(change, index + 1, changes.length);
            }, index * 2000); // 2 second delay between each change trace
        });
    }

    traceSingleChange(change, changeIndex, totalChanges) {
        this.log(`Tracing change ${changeIndex}/${totalChanges}: ${change.type} - ${change.description}`, 'info');
        
        // Find paths to the changed nodes based on change type
        let sourcePath = [];
        let replicaPath = [];
        
        switch (change.type) {
            case 'modified':
                sourcePath = this.findPathToNode(this.sourceTree, change.sourceData?.id);
                replicaPath = this.findPathToNode(this.replicaTree, change.replicaData?.id);
                break;
            case 'added':
                sourcePath = this.findPathToNode(this.sourceTree, change.sourceData?.id);
                // For added items, we don't trace in replica tree
                break;
            case 'deleted':
                replicaPath = this.findPathToNode(this.replicaTree, change.replicaData?.id);
                // For deleted items, we don't trace in source tree
                break;
        }
        
        // Highlight the paths step by step
        if (sourcePath.length > 0) {
            this.highlightPath(sourcePath, 'source', changeIndex, totalChanges);
        }
        if (replicaPath.length > 0) {
            this.highlightPath(replicaPath, 'replica', changeIndex, totalChanges);
        }
        
        // After tracing, highlight the final leaf node
        const maxPathLength = Math.max(sourcePath.length, replicaPath.length);
        setTimeout(() => {
            this.highlightChangedLeaf(change, changeIndex, totalChanges);
        }, maxPathLength * 300 + 500); // Wait for path highlighting to complete
    }

    findPathToNode(root, targetId) {
        const findPath = (node, targetId, currentPath = []) => {
            if (!node) return null;
            
            // Check if this is the target leaf node
            if (node.isLeaf && node.data && node.data.id === targetId) {
                return [...currentPath, node];
            }
            
            // Recursively search children
            if (node.children) {
                for (let i = 0; i < node.children.length; i++) {
                    const childPath = findPath(node.children[i], targetId, [...currentPath, node]);
                    if (childPath) return childPath;
                }
            }
            
            return null;
        };
        
        return findPath(root, targetId) || [];
    }

    highlightPath(path, treeType, changeIndex, totalChanges) {
        const nodes = this[`${treeType}Nodes`];
        const links = this[`${treeType}Links`];
        
        path.forEach((node, stepIndex) => {
            setTimeout(() => {
                // Highlight the node
                nodes.select('circle').filter(d => d.data === node).classed('node-trace', true);
                
                // Highlight the link to this node (if not root)
                if (stepIndex > 0) {
                    const parentNode = path[stepIndex - 1];
                    links.select('path').filter(d => {
                        return (d.source.data === parentNode && d.target.data === node) ||
                               (d.target.data === parentNode && d.source.data === node);
                    }).classed('link-trace', true);
                }
                
                // Log the step
                const nodeType = node.isLeaf ? 'leaf' : 'internal';
                const nodeInfo = node.isLeaf ? `(ID: ${node.data.id})` : '';
                this.log(`  ${treeType} tree: ${nodeType} node ${nodeInfo} - Hash: ${node.hash.substring(0,8)}`, 'info');
                
            }, stepIndex * 300); // 300ms delay between each step
        });
    }

    highlightChangedLeaf(change, changeIndex, totalChanges) {
        // Highlight the final changed leaf nodes
        if (change.sourceData) {
            this.sourceNodes.select('circle').filter(d => 
                d.data.isLeaf && d.data.data && d.data.data.id === change.sourceData.id
            ).classed('node-different', true);
        }
        
        if (change.replicaData) {
            this.replicaNodes.select('circle').filter(d => 
                d.data.isLeaf && d.data.data && d.data.data.id === change.replicaData.id
            ).classed('node-different', true);
        }
        
        this.log(`✓ Completed tracing for change ${changeIndex}/${totalChanges}`, 'success');
    }

    findLeafChanges(sourceNode, replicaNode, path = '') {
        // Instead of comparing tree positions, we need to compare actual data by ID
        // This function should collect all leaf nodes and then compare them properly
        
        const changes = [];
        
        // Helper function to collect all leaf nodes from a tree
        const collectLeaves = (node, leaves = []) => {
            if (!node) return leaves;
            if (node.isLeaf) {
                leaves.push(node);
            } else if (node.children) {
                node.children.forEach(child => collectLeaves(child, leaves));
            }
            return leaves;
        };
        
        // Collect all leaf nodes from both trees
        const sourceLeaves = collectLeaves(sourceNode);
        const replicaLeaves = collectLeaves(replicaNode);
        
        // Create maps for easy lookup
        const sourceMap = new Map(sourceLeaves.map(leaf => [leaf.data.id, leaf]));
        const replicaMap = new Map(replicaLeaves.map(leaf => [leaf.data.id, leaf]));
        
        // Find modified items (same ID, different hash)
        for (const [id, sourceLeaf] of sourceMap) {
            const replicaLeaf = replicaMap.get(id);
            if (replicaLeaf && sourceLeaf.hash !== replicaLeaf.hash) {
                changes.push({
                    type: 'modified',
                    sourceData: sourceLeaf.data,
                    replicaData: replicaLeaf.data,
                    description: `ID ${id}: "${replicaLeaf.data.value}" → "${sourceLeaf.data.value}"`,
                    path: path + 'M'
                });
            }
        }
        
        // Find added items (in source but not in replica)
        for (const [id, sourceLeaf] of sourceMap) {
            if (!replicaMap.has(id)) {
                changes.push({
                    type: 'added',
                    sourceData: sourceLeaf.data,
                    description: `Added: ID ${id} (${sourceLeaf.data.value})`,
                    path: path + 'A'
                });
            }
        }
        
        // Find deleted items (in replica but not in source)
        for (const [id, replicaLeaf] of replicaMap) {
            if (!sourceMap.has(id)) {
                changes.push({
                    type: 'deleted',
                    replicaData: replicaLeaf.data,
                    description: `Deleted: ID ${id} (${replicaLeaf.data.value})`,
                    path: path + 'D'
                });
            }
        }
        
        return changes;
    }

    syncChanges() {
        if (!this.comparisonState.changes.length) {
            this.log('No changes to sync', 'info');
            return;
        }

        this.log('Starting synchronization from source to replica...', 'info');
        
        let syncedCount = 0;
        const totalChanges = this.comparisonState.changes.length;
        
        // Apply only the identified changes
        this.comparisonState.changes.forEach((change, index) => {
            try {
                switch (change.type) {
                    case 'modified':
                        // Find and update the existing item in replica
                        const existingIndex = this.replicaData.findIndex(item => item.id === change.sourceData.id);
                        if (existingIndex !== -1) {
                            this.replicaData[existingIndex].value = change.sourceData.value;
                            this.log(`Syncing change ${index + 1}: Modified ID ${change.sourceData.id} to "${change.sourceData.value}"`, 'info');
                        } else {
                            this.log(`Warning: Could not find item with ID ${change.sourceData.id} in replica for modification`, 'warning');
                        }
                        break;
                        
                    case 'added':
                        // Add new item to replica
                        this.replicaData.push({ ...change.sourceData });
                        this.log(`Syncing change ${index + 1}: Added ID ${change.sourceData.id} (${change.sourceData.value})`, 'info');
                        break;
                        
                    case 'deleted':
                        // Remove item from replica
                        const deleteIndex = this.replicaData.findIndex(item => item.id === change.replicaData.id);
                        if (deleteIndex !== -1) {
                            this.replicaData.splice(deleteIndex, 1);
                            this.log(`Syncing change ${index + 1}: Deleted ID ${change.replicaData.id} (${change.replicaData.value})`, 'info');
                        } else {
                            this.log(`Warning: Could not find item with ID ${change.replicaData.id} in replica for deletion`, 'warning');
                        }
                        break;
                        
                    default:
                        this.log(`Warning: Unknown change type: ${change.type}`, 'warning');
                }
                syncedCount++;
                
                // Add a small delay for visual effect and highlight the change
                setTimeout(() => {
                    this.updateDataTables();
                    this.replicaTree = this.buildMerkleTree(this.replicaData);
                    this.renderTree('replica-tree', this.replicaTree, 'replica');
                    this.updateStats();
                    
                    // Highlight the synced change
                    this.log(`✓ ${change.description}`, 'success');
                }, (index + 1) * 1000);
                
            } catch (error) {
                this.log(`Error syncing change ${index + 1}: ${error.message}`, 'error');
            }
        });
        
        // Final update after all changes
        setTimeout(() => {
            this.updateDataTables();
            
            // Handle case where replica becomes empty
            if (this.replicaData.length === 0) {
                this.replicaTree = null;
                document.getElementById('replica-tree').innerHTML = '<div class="info-message">Replica database is empty</div>';
            } else {
                this.replicaTree = this.buildMerkleTree(this.replicaData);
                this.renderTree('replica-tree', this.replicaTree, 'replica');
            }
            
            this.updateStats();
            
            const efficiency = totalChanges > 0 ? Math.round(((this.sourceData.length - totalChanges) / this.sourceData.length) * 100) : 0;
            this.log(`Synchronization complete! Synced ${syncedCount}/${totalChanges} changes, saving ${efficiency}% bandwidth.`, 'success');
        }, (totalChanges + 1) * 1000);
    }

    zoom(treeType, factor) {
        const svg = this[`${treeType}Svg`];
        const currentTransform = d3.zoomTransform(svg.node());
        const initialTransform = this[`${treeType}InitialTransform`];
        const newScale = currentTransform.k * factor;
        
        if (initialTransform) {
            svg.transition()
                .duration(300)
                .call(this[`${treeType}Zoom`].transform, d3.zoomIdentity.translate(initialTransform.x, initialTransform.y).scale(newScale));
        } else {
            svg.transition()
                .duration(300)
                .call(this[`${treeType}Zoom`].transform, d3.zoomIdentity.scale(newScale));
        }
    }

    resetZoom(treeType) {
        const svg = this[`${treeType}Svg`];
        const initialTransform = this[`${treeType}InitialTransform`];
        
        if (initialTransform) {
            svg.transition()
                .duration(300)
                .call(this[`${treeType}Zoom`].transform, d3.zoomIdentity.translate(initialTransform.x, initialTransform.y));
        } else {
            svg.transition()
                .duration(300)
                .call(this[`${treeType}Zoom`].transform, d3.zoomIdentity);
        }
    }

    reset() {
        this.sourceData = [];
        this.replicaData = [];
        this.sourceTree = null;
        this.replicaTree = null;
        this.nextId = 1;
        this.resetComparisonState();
        
        document.getElementById('source-tree').innerHTML = '';
        document.getElementById('replica-tree').innerHTML = '';
        this.updateStats();
        this.clearLog();
        
        this.log('System reset. Start by adding data or generating sample data.', 'info');
    }

    resetComparisonState() {
        this.comparisonState = {
            step: 0,
            mismatchedNodes: [],
            changes: []
        };
        this.currentLevel = 0;
        
        // Reset button states
        document.getElementById('compare-roots').disabled = true;
        document.getElementById('drill-down').disabled = true;
        document.getElementById('identify-changes').disabled = true;
        document.getElementById('sync-changes').disabled = true;
    }

    log(message, type = 'info') {
        const logContainer = document.getElementById('log-container');
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    clearLog() {
        document.getElementById('log-container').innerHTML = '';
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MerkleTreeVisualizer();
}); 