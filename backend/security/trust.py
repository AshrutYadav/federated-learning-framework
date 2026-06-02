from backend.app.core.state import state


def get_score(
    client_id
    ):

    return(

    state["trust_scores"].get(client_id,100)

    )


def reduce_score(
    client_id
    ):

    current = get_score(client_id)

    current -= 20

    state["trust_scores"][client_id]=current

    return current