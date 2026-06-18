import http.server, socketserver, os, mimetypes

# Ensure proper MIME types for video formats
mimetypes.add_type('video/mp4',       '.mp4')
mimetypes.add_type('video/quicktime', '.mov')
mimetypes.add_type('video/webm',      '.webm')

port = int(os.environ.get('PORT', 3456))
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # Silent

with socketserver.TCPServer(('127.0.0.1', port), Handler) as httpd:
    print(f'Serving on {port}', flush=True)
    httpd.serve_forever()
