"""
Geopolitical Supply Chain Risk Decision Agent - Local Web & API Server
Serves the interactive web dashboard on http://localhost:8000 and provides REST endpoints for Python risk engine.
Zero external dependencies required (uses built-in http.server and urllib).
"""

import http.server
import socketserver
import json
import os
import sys
from urllib.parse import urlparse, parse_qs
from geo_risk_engine import GeopoliticalRiskEngine

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
engine = GeopoliticalRiskEngine()


class GeoRiskHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # REST API: /api/ingest_hf
        if parsed_path.path == '/api/ingest_hf':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            results = engine.ingest_from_huggingface("alerterra/geopolitical_risk_events")
            self.wfile.write(json.dumps({
                "status": "success",
                "source": "HuggingFace Datasets Hub",
                "ingested_count": len(results),
                "data": results
            }).encode('utf-8'))
            return

        # REST API: /api/suppliers
        elif parsed_path.path == '/api/suppliers':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            suppliers_data = []
            for sup_id, exp in engine.exposures.items():
                node = engine.network_graph.get(sup_id)
                score = engine._compute_risk_score(
                    event=list(engine.events.values())[0] if engine.events else None,
                    exp=exp
                ) if hasattr(engine, '_compute_risk_score') else None
                suppliers_data.append({
                    "id": exp.supplier_id,
                    "name": node.name if node else exp.supplier_id,
                    "country": node.country if node else "Unknown",
                    "sku": exp.sku,
                    "dependency_pct": exp.dependency_pct,
                    "inv_cover_days": exp.inv_cover_days,
                    "sole_source": exp.sole_source,
                    "score": score.final_score if score else 0.0,
                    "risk_level": score.risk_level if score else "Low"
                })

            self.wfile.write(json.dumps({
                "status": "success",
                "suppliers": suppliers_data
            }).encode('utf-8'))
            return

        # Serve static HTML/CSS/JS files
        return super().do_GET()

    def do_POST(self):
        parsed_path = urlparse(self.path)

        # REST API: /api/process_signal
        if parsed_path.path == '/api/process_signal':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            try:
                signal_data = json.loads(body.decode('utf-8'))
                result = engine.process_signal(signal_data)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "success",
                    "result": result
                }).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return


if __name__ == '__main__':
    os.chdir(DIRECTORY)
    print(f"============================================================")
    print(f"Geopolitical Supply Chain Risk Decision Agent Server Started")
    print(f"Web Dashboard URL: http://localhost:{PORT}")
    print(f"Hugging Face REST Endpoint: http://localhost:{PORT}/api/ingest_hf")
    print(f"============================================================")
    
    with socketserver.TCPServer(("", PORT), GeoRiskHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)
