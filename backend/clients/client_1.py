from torchvision import datasets, transforms
from torch.utils.data import DataLoader, Subset

def get_client_data():

    dataset = datasets.MNIST(
        "./data",
        train=True,
        download=True,
        transform=transforms.ToTensor()
    )

    return DataLoader(
        Subset(dataset, range(0, 20000)),
        batch_size=64,
        shuffle=True
    )