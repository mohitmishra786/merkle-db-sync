# Merkle Tree Database Replication Visualizer

An interactive web-based visualizer that demonstrates how Merkle trees (hash trees) are used in database replication to efficiently detect and sync changes between a source database and a replica, without transferring the entire dataset.

## Overview

This visualizer simulates the complete database replication process using Merkle trees:

1. **Building Merkle Trees**: Creates binary hash trees for both source and replica databases
2. **Efficient Comparison**: Compares root hashes to detect differences
3. **Drill-Down Analysis**: Traverses only mismatched branches to identify specific changes
4. **Selective Synchronization**: Syncs only the changed data blocks, demonstrating bandwidth efficiency

## Features

### Core Functionality
- **Interactive Data Management**: Add, edit, and remove data entries in both source and replica databases
- **Dynamic Tree Visualization**: Real-time rendering of Merkle trees using D3.js
- **Step-by-Step Comparison**: Visual comparison process with detailed logging
- **Efficient Sync**: Only transfers changed data blocks, not entire datasets
- **Performance Statistics**: Shows bandwidth savings and efficiency metrics

### User Interface
- **Side-by-Side Layout**: Source and replica trees displayed simultaneously
- **Zoom and Pan Controls**: Interactive navigation for large trees
- **Real-time Updates**: Immediate visual feedback for all operations
- **Comprehensive Logging**: Detailed operation log with timestamps
- **Error Handling**: Robust error handling with user-friendly messages

### Technical Features
- **Content-Based Hashing**: SHA-256 hashing of data values (not IDs)
- **Tree Balancing**: Handles unbalanced trees with padding nodes
- **Change Detection**: Identifies modifications, additions, and deletions
- **Visual Highlighting**: Highlights nodes during comparison and sync operations

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Setup
1. Clone or download the repository
2. Navigate to the project directory
3. Start a local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and go to `http://localhost:8000`

### Quick Start Guide

#### 1. Initial Setup
- The application starts with empty databases
- Click "Generate Sample Data" to create identical test data in both databases
- This creates 4 sample records with different values

#### 2. Creating Differences
- Click "Create Differences" to simulate changes in the source database
- This modifies one existing record and adds one new record
- The replica database remains unchanged

#### 3. Building Merkle Trees
- Click "Build Trees" to generate Merkle trees for both databases
- Trees are rendered side-by-side with zoom and pan controls
- Hash information is displayed in the operation log

#### 4. Comparing Trees
- Click "Compare Roots" to check if the databases are in sync
- If hashes differ, the system identifies that synchronization is needed
- Root nodes are highlighted to show the comparison

#### 5. Drilling Down
- Click "Drill Down" to traverse mismatched branches
- The system identifies specific nodes where differences occur
- Mismatched nodes are highlighted in both trees

#### 6. Identifying Changes
- Click "Identify Changes" to determine the specific data changes
- The system categorizes changes as:
  - **Modified**: Same ID, different value
  - **Added**: New record in source
  - **Deleted**: Record removed from source

#### 7. Synchronizing
- Click "Sync Changes" to apply only the identified changes
- Changes are applied one by one with visual feedback
- The replica database is updated to match the source
- Bandwidth efficiency statistics are displayed

## Detailed Usage Guide

### Data Management

#### Adding Data
- Use the "+" buttons in the database tables to add new rows
- Each new row gets a unique ID and editable value
- Changes are reflected immediately in the data tables

#### Editing Data
- Click on any value in the data tables to edit it
- Changes are saved automatically
- Modified data affects the Merkle tree hashes

#### Removing Data
- Use the "×" buttons to remove rows from either database
- Removed data is immediately reflected in the tables

#### Creating Custom Scenarios
1. Start with empty databases
2. Add different data to source and replica
3. Build trees and observe the differences
4. Experiment with various change patterns

### Tree Visualization

#### Navigation
- **Zoom In/Out**: Use the zoom buttons or mouse wheel
- **Pan**: Click and drag to move around the tree
- **Reset Zoom**: Click the reset button to return to the initial view

#### Understanding the Display
- **Green Circles**: Leaf nodes (actual data)
- **Blue Circles**: Internal nodes (hash combinations)
- **Red Circles**: Root nodes (tree roots)
- **Hash Labels**: First 8 characters of each node's hash
- **Tooltips**: Hover over nodes to see full hash and data details

#### Tree Structure
- **Leaves**: Contain actual database records
- **Parents**: Hash of concatenated child hashes
- **Root**: Top-level hash representing entire database state

### Comparison Process

#### Root Comparison
- Compares the top-level hashes of both trees
- If equal: databases are in sync
- If different: changes exist and need identification

#### Drill-Down Process
- Traverses tree levels to find mismatched branches
- Only examines branches where differences exist
- Highlights specific nodes causing the mismatch

#### Change Identification
- Collects all leaf nodes from both trees
- Compares data by ID (not position)
- Categorizes differences accurately

### Synchronization

#### Change Types
- **Modified**: Updates existing record value
- **Added**: Inserts new record
- **Deleted**: Removes existing record

#### Efficiency Benefits
- Only transfers changed data blocks
- Calculates bandwidth savings percentage
- Demonstrates real-world efficiency gains

#### Visual Feedback
- Step-by-step application of changes
- Real-time tree updates
- Progress logging with timestamps

## Technical Implementation

### Architecture
- **Frontend**: Vanilla JavaScript with ES6+ features
- **Visualization**: D3.js v7 for tree rendering
- **Hashing**: CryptoJS SHA-256 implementation
- **Styling**: CSS3 with responsive design

### File Structure
```
merkle-db-sync/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and layout
├── app.js             # JavaScript application logic
└── README.md          # This documentation
```

### Key Components

#### MerkleTreeVisualizer Class
- Main application class managing all functionality
- Handles data, tree building, comparison, and synchronization
- Provides error handling and logging

#### Tree Building Algorithm
- Creates leaf nodes from data records
- Builds tree bottom-up by pairing nodes
- Handles unbalanced trees with padding
- Generates unique hashes for each node

#### Comparison Logic
- Compares trees by content, not structure
- Identifies specific data changes
- Provides detailed change categorization
- Enables efficient synchronization

#### Error Handling
- Comprehensive validation of input data
- Graceful handling of edge cases
- User-friendly error messages
- Robust recovery mechanisms

## Educational Value

### Learning Objectives
- **Merkle Tree Structure**: Understanding binary hash trees
- **Database Replication**: Efficient change detection and synchronization
- **Cryptographic Hashing**: Content-based hash generation
- **Algorithm Efficiency**: Minimizing data transfer in distributed systems

### Real-World Applications
- **Distributed Databases**: Efficient synchronization between nodes
- **Blockchain Technology**: Merkle trees in blockchain structures
- **Version Control Systems**: Efficient diff and merge operations
- **Content Delivery Networks**: Change detection in distributed content

### Key Concepts Demonstrated
- **Hash Trees**: Hierarchical data structures for efficient comparison
- **Change Detection**: Identifying differences without full data transfer
- **Selective Synchronization**: Transferring only necessary changes
- **Bandwidth Efficiency**: Reducing network overhead in distributed systems

## Troubleshooting

### Common Issues

#### Trees Not Rendering
- Check browser console for JavaScript errors
- Ensure all files are loaded correctly
- Verify D3.js library is accessible

#### Sync Not Working
- Ensure trees are built before comparison
- Check that changes are properly identified
- Verify data structure integrity

#### Performance Issues
- Reduce data size for better performance
- Use zoom controls for large trees
- Clear browser cache if needed

### Error Messages
- **"Invalid data format"**: Check data structure and required fields
- **"Duplicate IDs found"**: Ensure unique IDs in each database
- **"Container not found"**: Verify HTML structure integrity
- **"Failed to build tree"**: Check data validity and structure

## Browser Compatibility
- **Chrome**: 60+ (Recommended)
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## Performance Considerations
- Optimal performance with up to 32 data records
- Larger datasets may require longer processing times
- Zoom and pan controls help navigate large trees
- Error handling prevents crashes with invalid data

## Contributing
This is an educational project demonstrating Merkle tree concepts. Feel free to:
- Experiment with different data scenarios
- Modify the visualization styles
- Add new features or improvements
- Report issues or suggest enhancements

## License
This project is under [MIT LICENSE](LICENSE)