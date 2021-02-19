from alpha_vantage.timeseries import TimeSeries
import os
import pandas as pd
from sklearn import preprocessing
import numpy as np

def save_dataset(symbol):
    api_key = os.getenv('AV_API_KEY')

    ts = TimeSeries(key=api_key, output_format='pandas')
    data, meta_data = ts.get_daily(symbol, outputsize='full')

    file_name = os.path.join('data',f'{symbol}.csv')

    data.to_csv(file_name)


def load_dataset(symbol, history_points):
    file_name = os.path.join('data', f'{symbol}.csv')

    # load file
    data = pd.read_csv(file_name)
    data = data.sort_values('date')
    data = data.drop('date', axis=1)
    data = data.drop(0, axis=0)
    data = data.values

    # transform dataset to use in model
    normaliser = preprocessing.MinMaxScaler()
    normalized = normaliser.fit_transform(data)

    n,d = normalized.shape
    X = np.array([normalized[i: i+history_points].copy() for i in range(n-history_points)])
    y = np.array([normalized[i].copy() for i in range(history_points, n)])

    # X = X.reshape(n-history_points, history_points*d)
    # y = y[:,0]

    return X, y, normaliser, data
