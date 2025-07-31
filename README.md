# Merkle Tree Database Replication Visualizer

An interactive web-based visualizer that demonstrates how Merkle trees (hash trees) are used in database replication to efficiently detect and sync changes between a source database and a replica, without transferring the entire dataset.

## Features

### 🎯 Core Functionality
- **Merkle Tree Construction**: Builds binary hash trees from database records
- **Efficient Comparison**: Compares root hashes first, then drills down only mismatched branches
- **Change Detection**: Identifies modified, added, and deleted records
- **Selective Synchronization**: Only syncs changed data blocks, not entire datasets
- **Real-time Visualization**: Dynamic D3.js tree rendering with interactive features

### 🎨 Interactive UI
- **Editable Data Tables**: Modify source and replica data in real-time
- **Step-by-Step Process**: Guided workflow through comparison and sync
- **Visual Tree Representation**: Color-coded nodes (leaves, internal, root)
- **Interactive Tooltips**: Hover to see full hash values and data
- **Operation Log**: Real-time logging of all operations
- **Statistics Display**: Tree metrics and efficiency statistics

### 🔧 Technical Implementation
- **SHA-256 Hashing**: Uses CryptoJS for secure hash generation
- **D3.js Visualization**: Professional tree layouts and animations
- **Responsive Design**: Works on desktop and mobile devices
- **No Backend Required**: Pure client-side implementation

## How to Use

### 1. Getting Started
1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
2. The application will load with sample data pre-populated

### 2. Workflow Steps

#### Step 1: Generate Sample Data
- Click **"Generate Sample Data"** to create test data
- The source database contains 8 records
- The replica database has 3 modifications (2 changed values, 1 new record)

#### Step 2: Build Merkle Trees
- Click **"Build Merkle Trees"** to construct hash trees for both databases
- Trees are rendered side-by-side with color-coded nodes:
  - 🟢 Green: Leaf nodes (actual data)
  - 🔵 Blue: Internal nodes (hash combinations)
  - 🔴 Red: Root nodes (tree roots)

#### Step 3: Compare Roots
- Click **"Compare Roots"** to check if databases are in sync
- If root hashes match: No sync needed
- If root hashes differ: Proceed to drill down

#### Step 4: Drill Down
- Click **"Drill Down"** to traverse mismatched branches
- Mismatched nodes are highlighted in red
- Continue until reaching leaf-level differences

#### Step 5: Identify Changes
- Click **"Identify Changes"** to list specific modifications
- Shows modified, added, and deleted records
- Displays efficiency statistics

#### Step 6: Sync Changes
- Click **"Sync Changes"** to apply updates
- Only changed data is transferred
- Replica tree is rebuilt with new data
- Final comparison shows synchronized state

### 3. Interactive Features

#### Data Editing
- Click on any value in the data tables to edit
- Changes are applied in real-time
- Rebuild trees to see effects of modifications

#### Tree Exploration
- **Hover** over nodes to see full hash values and data
- **Click** nodes to expand/collapse (for large trees)
- **Visual feedback** shows comparison progress

#### Operation Log
- Real-time logging of all operations
- Color-coded messages (info, success, warning, error)
- Scrollable history of all actions

## Technical Details

### Merkle Tree Algorithm
1. **Leaf Creation**: Hash each database record
2. **Tree Construction**: Build bottom-up by pairing and hashing parent nodes
3. **Comparison**: Start at root, recursively compare only mismatched branches
4. **Synchronization**: Transfer only changed leaf data

### Hash Function
- Uses SHA-256 for secure, collision-resistant hashing
- Truncated to 16 characters for display purposes
- Full hash available in tooltips

### Efficiency Benefits
- **O(log n) comparison** instead of O(n) full scan
- **Minimal data transfer** - only changed blocks
- **Cryptographic integrity** - any change affects root hash
- **Scalable** - works with millions of records

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies
- **D3.js v7**: Tree visualization and layout
- **CryptoJS**: SHA-256 hashing implementation
- Both loaded via CDN (no local installation required)

## File Structure
```
merkle-db-sync/
├── index.html          # Complete application (HTML + CSS + JS)
└── README.md          # This documentation
```

## Educational Value

This visualizer demonstrates key concepts in:
- **Distributed Systems**: Efficient data synchronization
- **Cryptography**: Hash functions and Merkle trees
- **Database Design**: Replication strategies
- **Algorithm Design**: Divide-and-conquer comparison
- **Web Development**: Interactive data visualization

## Use Cases
- **Database Replication**: Sync between primary and replica databases
- **Version Control**: Efficient diff algorithms
- **Blockchain**: Merkle tree verification
- **Content Distribution**: CDN synchronization
- **Backup Systems**: Incremental backup verification

## Performance Notes
- Optimized for datasets up to 32 records for smooth visualization
- Larger datasets work but may impact rendering performance
- Hash computation is fast and efficient
- Tree comparison scales logarithmically with data size

---

**Note**: This is a demonstration tool for educational purposes. For production use, consider additional security measures, error handling, and scalability optimizations. 