#!/usr/bin/env python3
"""
Simple HTTP Server with SPA Routing Support
Serves static files and redirects unknown routes to index.html for client-side routing
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

PORT = 8000
CURRENT_DIR = Path(__file__).parent

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler that supports SPA (Single Page Application) routing"""
    
    def do_GET(self):
        # Get the file path
        file_path = CURRENT_DIR / self.path.lstrip('/')
        
        # Remove query parameters for file checking
        path_without_query = self.path.split('?')[0]
        file_path_check = CURRENT_DIR / path_without_query.lstrip('/')
        
        # Serve static files if they exist
        if file_path_check.is_file():
            return super().do_GET()
        
        # For routes that don't exist as files, serve index.html
        # This enables client-side routing
        if not file_path_check.is_file() and not file_path_check.is_dir():
            self.path = '/index.html'
        
        return super().do_GET()
    
    def end_headers(self):
        """Add CORS headers to allow cross-origin requests"""
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        """Custom logging message"""
        print(f"[{self.client_address[0]}] {format % args}")

if __name__ == '__main__':
    # Fix encoding for Windows consoles
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

    # Change to the script directory
    os.chdir(CURRENT_DIR)
    
    # Create the server
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"╔═══════════════════════════════════════════════════════════╗")
        print(f"║       🚀 Turing Machine Website Hosting Server            ║")
        print(f"╠═══════════════════════════════════════════════════════════╣")
        print(f"║ Server running at: http://localhost:{PORT}")
        print(f"║ Home Page:         http://localhost:{PORT}/")
        print(f"║ Simulator:         http://localhost:{PORT}/demonstration")
        print(f"║")
        print(f"║ Press Ctrl+C to stop the server")
        print(f"╚═══════════════════════════════════════════════════════════╝")
        print()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✓ Server stopped.")
            sys.exit(0)
