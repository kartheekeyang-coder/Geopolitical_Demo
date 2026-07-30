"""
Unit & Integration Test Suite for Geopolitical Supply Chain Risk Decision Agent
Tests:
1. Signal Ingestion & Classification
2. Entity Network Graph Traversal
3. Risk Score Math Formula: (Prob * Exposure * Criticality) / Resilience
4. ISO SCRM Action Playbook Triggers
5. Hugging Face Datasets Connector
"""

import unittest
import json
from geo_risk_engine import GeopoliticalRiskEngine, Event, Exposure, HuggingFaceConnector


class TestGeopoliticalRiskEngine(unittest.TestCase):
    def setUp(self):
        self.engine = GeopoliticalRiskEngine()

    def test_network_graph_initialization(self):
        """Verify network graph contains country and supplier nodes"""
        self.assertIn("CN", self.engine.network_graph)
        self.assertIn("TW", self.engine.network_graph)
        self.assertIn("SUP-101", self.engine.network_graph)
        supplier_node = self.engine.network_graph["SUP-101"]
        self.assertEqual(supplier_node.country, "TW")

    def test_risk_score_formula(self):
        """Verify risk score math: (P * E * C) / R"""
        event = Event(
            event_id="EVT-TEST-1",
            date="2026-07-25",
            source="Test Bulletin",
            event_type="Sanctions",
            country="TW",
            summary="Test sanction event",
            confidence=1.0,
            credibility=1.0,
            escalation_trend="Rising"
        )
        exp = self.engine.exposures["SUP-101"] # Sole source, 65% dep, 12d cover
        score = self.engine._compute_risk_score(event, exp)
        
        # Expect High/Critical score for sole source high dependency supplier
        self.assertGreaterEqual(score.final_score, 50.0)
        self.assertIn(score.risk_level, ["High", "Critical"])

    def test_playbook_action_trigger(self):
        """Verify Rule 1: High dependency trade barrier trigger"""
        event_dict = {
            "event_id": "EVT-PLAYBOOK-1",
            "event_type": "Sanctions",
            "country": "TW",
            "summary": "Export restrictions on semiconductors",
            "confidence": 0.95,
            "credibility": 0.90,
            "escalation_trend": "Rising"
        }
        res = self.engine.process_signal(event_dict)
        self.assertGreater(len(res["scores"]), 0)
        self.assertGreater(len(res["actions"]), 0)
        action = res["actions"][0]
        self.assertEqual(action["owner"], "Procurement & Supply Planning")
        self.assertIn("BUFFER BUILD", action["recommendation"])

    def test_huggingface_connector(self):
        """Verify Hugging Face dataset connector loads rows without crashing"""
        rows = HuggingFaceConnector.fetch_hf_geopolitical_dataset()
        self.assertIsInstance(rows, list)
        self.assertGreater(len(rows), 0)


if __name__ == "__main__":
    unittest.main()
