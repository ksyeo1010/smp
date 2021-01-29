

from utils.dataset import Dataset

if __name__ == '__main__':
    ds = Dataset()

    # ds.save_dataset('AAPL')
    X,y,X_normaliser, y_normaliser, data = ds.load_dataset('AAPL')

    print(X.shape, y.shape)
