from alpha_vantage.timeseries import TimeSeries
from dotenv import load_dotenv
import os
import pandas as pd
from sklearn import preprocessing
import numpy as np

class Dataset:
    def __init__(self):
        pass


    def save_dataset(self, symbol):
        load_dotenv()

        api_key = os.getenv('AV_API_KEY')

        ts = TimeSeries(key=api_key, output_format='pandas')
        data, meta_data = ts.get_daily(symbol, outputsize='full')

        file_name = os.path.join('data',f'{symbol}.csv')

        data.to_csv(file_name)


    def load_dataset(self, symbol, length=50):
        file_name = os.path.join('data', f'{symbol}.csv')

        # load file
        data = pd.read_csv(file_name)
        data = data.drop('date', axis=1)
        data = data.drop(0, axis=0)
        data = data.values

        # transform dataset to use in model
        X_normaliser = preprocessing.MinMaxScaler()
        X_normalized = X_normaliser.fit_transform(data)

        y_normaliser = preprocessing.MinMaxScaler()
        y_normalized = y_normaliser.fit_transform(data[:,0].reshape(-1, 1))

        n,d = X_normalized.shape
        X = np.array([X_normalized[i: i+length].copy() for i in range(n-length)])
        y = np.array([y_normalized[i+length].copy() for i in range(n-length)])

        X = X.reshape(n-length, length*d)
        y = y[:,0]

        return X, y, X_normaliser, y_normaliser, data
