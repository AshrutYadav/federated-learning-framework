from backend.app.core.state import state

# Penalty applied when a malicious/anomalous update is detected
MALICIOUS_PENALTY = 20


def get_score(client_id):
    return state["trust_scores"].get(client_id, 100)


def set_score(client_id, score: int):
    """Directly set a client's trust score (admin / correction use)."""
    clamped = max(0, min(100, score))
    state["trust_scores"][client_id] = clamped
    return clamped


def reduce_score(client_id):
    """
    Apply the malicious-detection penalty.
    Progression:
      1st offence  : 100 → 40  (Suspicious)
      2nd offence  : 40  →  0  (Blocked / banned)
    """
    current = get_score(client_id)
    current = max(0, current - MALICIOUS_PENALTY)
    state["trust_scores"][client_id] = current
    return current