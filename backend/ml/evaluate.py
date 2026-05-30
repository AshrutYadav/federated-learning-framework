import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

from backend.ml.model import DigitClassifier


def evaluate_model(model_path):

    device = torch.device("cpu")

    model = DigitClassifier()

    model.load_state_dict(
        torch.load(model_path, map_location=device)
    )

    model.eval()

    test_dataset = datasets.MNIST(
        "./data",
        train=False,
        download=True,
        transform=transforms.ToTensor()
    )

    test_loader = DataLoader(
        test_dataset,
        batch_size=64,
        shuffle=False
    )

    correct = 0
    total = 0

    with torch.no_grad():

        for images, labels in test_loader:

            outputs = model(images)

            _, predicted = torch.max(outputs, 1)

            total += labels.size(0)

            correct += (predicted == labels).sum().item()

    accuracy = 100 * correct / total

    print(f"Accuracy: {accuracy:.2f}%")

    return accuracy