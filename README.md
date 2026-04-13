# 🚀 Turing Machine Simulator - Complete Project

## Overview
This is a fully functional Turing Machine simulator with an educational home page and an interactive simulator. The website includes proper client-side routing, responsive design, and a beautiful rose/pink themed UI.

## Features

### 🏠 Home Page (`/`)
- **Educational Content**: Comprehensive explanation of Turing machines
- **Interactive Graphics**: SVG visualization of the Turing machine components
- **Responsive Layout**: Adapts to desktop, tablet, and mobile screens
- **Call-to-Action**: Easy navigation to the simulator

### 🔧 Simulator Page (`/demonstration`)
- **Setup View**: Configure tapes and transition rules
- **Run View**: Execute the machine step-by-step or automatically
- **Preset Machines**: 8 pre-configured examples:
  - Binary Increment
  - Binary Decrement
  - 1's Complement
  - 2's Complement
  - Palindrome Check
  - Unary Addition
  - Equal aⁿbⁿ checker
  - Divisibility by 3 checker
- **TAFL Expression Support**: Generate tape combinations with `(0)*4` syntax
- **State Diagram**: Visual representation of state transitions
- **Transition Table**: View all rules in a formatted table
- **Step History**: Track every step of execution
- **State Trace**: Follow the state path through the machine
- **Multiple Speed Levels**: Run at your preferred pace
- **Dark/Light Mode**: Toggle theme with persistent storage

## File Structure
```
c:\TaflProj/
├── index.html        # Main HTML with routing and content
├── styles.css        # All styling with responsive design
├── script.js         # JavaScript for routing, simulator, and UI
├── server.py         # Python HTTP server with SPA routing
└── README.md         # This file
```

## Running the Server

### Start the Server
```powershell
cd c:\TaflProj
python server.py
```

### Access the Website
- **Home Page**: http://localhost:8000/
- **Simulator**: http://localhost:8000/demonstration

### Stop the Server
Press `Ctrl+C` in the terminal

## Technical Implementation

### Routing System
- Client-side routing with history management
- Server-side SPA support (serves `index.html` for unknown routes)
- Navigation links highlight active pages
- Browser back/forward buttons work correctly

### Responsive Design
- **Desktop (1200px+)**: Full layout with side-by-side content
- **Tablet (768px)**: Optimized grid layout
- **Mobile (480px)**: Single column with adjusted spacing

### Color Scheme (Light Mode)
- Primary: Rose Pink (#d96d93)
- Secondary: Coral (#f4785a)
- Accent: Mauve (#b85c88)
- Background: Warm white (#faf6f3)

### Color Scheme (Dark Mode)
- Primary: Bright Rose (#f089b5)
- Secondary: Bright Coral (#ff9b7f)
- Accent: Bright Mauve (#e888b0)
- Background: Deep charcoal (#1a0f14)

## How to Use the Simulator

### 1. Load a Preset (Optional)
Click any preset button to load example rules and tape.

### 2. Configure the Machine
- **Initial Tape**: Enter binary string (e.g., `1011`) or TAFL expression
- **Transition Rules**: Define state transitions in format:
  ```
  state, read, write, move, next_state
  q0, 0, 0, R, q0
  q0, 1, 1, R, q1
  ```

### 3. Initialize
Click "Initialize Machine" to prepare the machine for execution.

### 4. Run the Simulation
- **Step**: Execute one transition
- **Run**: Auto-execute until halt
- **Back**: Rewind to previous step
- **Reset**: Return to initial state
- **Speed**: Adjust execution speed (1-10)

### 5. Analyze Results
- View the **Transition Table** showing all rules
- See the **State Diagram** with highlighted path
- Review **Step History** for each transition
- Follow **State Trace** showing state evolution

## Architecture Notes

### HTML Structure
- Main page (`.view` with `class="active"`) handling
- Inner views (`setup-view`, `run-view`) for simulator state
- Nested structure allows clean content organization

### JavaScript Organization
1. **Routing Module**: Client-side routing with history API
2. **Theme Module**: Light/dark mode toggle with localStorage
3. **Simulator Module**: Turing machine execution engine
4. **UI Module**: Mermaid diagram rendering and event handling

### CSS Organization
1. **Design Tokens**: CSS custom properties for theming
2. **Responsive Breakpoints**: 768px and 480px media queries
3. **View Switching**: Flex display with active class toggles
4. **Animations**: Smooth transitions and fade-in effects

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with ES6 support

## Future Enhancements
- Multi-tape Turing machines
- Non-deterministic Turing machines
- Custom input/output formatting
- Export simulation results
- Turing machine construction wizards
- Code generation from diagrams

## License
Built as an educational tool for understanding computational theory.

---

**Server**: http://localhost:8000 ✅  
**Ready to explore the Turing machine!** 🎯
