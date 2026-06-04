import subprocess

clients = [
    "backend.clients.client_runner_1",
    "backend.clients.client_runner_2",
    "backend.clients.client_runner_3",
    "backend.clients.client_runner_4",
    "backend.clients.client_runner_5",
    "backend.clients.client_runner_6",
]

for client in clients:

    print(f"\nRunning {client}...\n")

    subprocess.run(
        ["python", "-m", client],
        check=True
    )

print("\nRound Completed Successfully!\n")