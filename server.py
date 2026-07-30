import http.server
import socketserver
import urllib.request
import xml.etree.ElementTree as ET
import json
import random
import time

PORT = 8000

class RSSHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/live-risks':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            try:
                # Fetch BBC World News RSS Feed
                url = "http://feeds.bbci.co.uk/news/world/rss.xml"
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                response = urllib.request.urlopen(req)
                xml_data = response.read()
                root = ET.fromstring(xml_data)
                
                events = []
                
                # NLP Keyword Simulation Configuration
                countries = {
                    "taiwan": "TW", 
                    "china": "CN", 
                    "beijing": "CN",
                    "netherlands": "NL", 
                    "europe": "NL",
                    "japan": "JP",
                    "mexico": "MX",
                    "us": "US",
                    "united states": "US"
                }
                
                risk_types = {
                    "strike": "Labor Strike",
                    "tension": "Geopolitical Tension",
                    "sanction": "Sanctions",
                    "ban": "Trade Barrier",
                    "export": "Export Control",
                    "military": "Military Action",
                    "war": "Conflict",
                    "protest": "Civil Unrest",
                    "fire": "Disaster",
                    "storm": "Weather Event"
                }
                
                # Parse RSS Items
                items = root.findall('.//item')
                for item in items[:25]: # check top 25 news items
                    title = item.find('title').text if item.find('title') is not None else ""
                    desc = item.find('description').text if item.find('description') is not None else ""
                    full_text = (title + " " + desc).lower()
                    
                    found_country = None
                    for kw, code in countries.items():
                        if kw in full_text:
                            found_country = code
                            break
                            
                    found_risk = None
                    for kw, risk in risk_types.items():
                        if kw in full_text:
                            found_risk = risk
                            break
                            
                    if found_country or found_risk:
                        # We found a match! Create an event.
                        # Default to generic values if only one part matched
                        c_code = found_country if found_country else random.choice(['TW', 'CN', 'NL', 'MX'])
                        r_type = found_risk if found_risk else "Geopolitical Shift"
                        
                        event = {
                            "id": f"RSS-EVT-{random.randint(1000, 9999)}",
                            "date": time.strftime('%Y-%m-%d'),
                            "source": "BBC World News (Live Feed)",
                            "type": r_type,
                            "country": c_code,
                            "summary": f"LIVE NEWS MATCH: {title}",
                            "credibility": round(random.uniform(0.75, 0.98), 2),
                            "confidence": round(random.uniform(0.70, 0.95), 2),
                            "trend": random.choice(["Rising", "Stable", "Volatile"])
                        }
                        events.append(event)
                
                # Fallback if no news matched our keywords today (ensure the demo works)
                if len(events) == 0:
                    fallback_event = {
                        "id": f"RSS-EVT-FALLBACK",
                        "date": time.strftime('%Y-%m-%d'),
                        "source": "Simulated Live Feed (Fallback)",
                        "type": "Geopolitical Tension",
                        "country": "TW",
                        "summary": "No direct keyword matches in the live RSS feed today. Generating synthetic fallback event for Taiwan to maintain dashboard testing capability.",
                        "credibility": 0.85,
                        "confidence": 0.80,
                        "trend": "Rising"
                    }
                    events.append(fallback_event)
                
                self.wfile.write(json.dumps(events).encode())
                
            except Exception as e:
                print(f"Error fetching RSS: {e}")
                error_resp = [{"id": "ERR-1", "source": "System Error", "summary": f"Failed to fetch RSS: {str(e)}", "country": "TW", "type": "Error", "credibility": 0.5, "confidence": 0.0, "trend": "Unknown"}]
                self.wfile.write(json.dumps(error_resp).encode())
        else:
            super().do_GET()

with socketserver.TCPServer(("", PORT), RSSHandler) as httpd:
    print(f"Serving at port {PORT} with Live RSS Backend Enabled.")
    httpd.serve_forever()
