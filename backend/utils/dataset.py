from alpha_vantage.timeseries import TimeSeries
import os
import pandas as pd
from sklearn import preprocessing
import numpy as np
import pathlib
from datetime import datetime
from dataclasses import dataclass
import json

from utils import Config

@dataclass
class File:
    name: str
    size: int
    modified: str


@dataclass
class Data:
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: float


@dataclass
class DataFile(File):
    values: [Data]


class Dataset:
    def __init__(self):
        self.__config = Config()
        pathlib.Path(self.__config.get_ds_path()).mkdir(parents=True, exist_ok=True)


    def save_dataset(self, symbol):
        ts = TimeSeries(key=self.__config.get_api_key(), output_format='pandas')
        data, meta_data = ts.get_daily(symbol, outputsize='full')

        fname = symbol + '.csv'
        full_path = os.path.join(self.__config.get_ds_path(),fname)

        data.to_csv(full_path)

        return self.__get_file_stats(fname)


    def load_dataset(self, symbol, dateRange=None):
        fname = symbol + '.csv'
        file_name = os.path.join(self.__config.get_ds_path(), fname)
        data = pd.read_csv(file_name)
        data = data.sort_values('date')
        if dateRange is not None:
            length, _ = data.shape
            data = data[length-int(dateRange):]
        data = self.transform_data(data)

        fstat = self.__get_file_stats(fname)
        return DataFile(
            fstat.name,
            fstat.size,
            fstat.modified,
            json.loads(data.to_json(orient='records'))
        )


    def generate_dataset(self, symbol):
        history_points = self.__config.get_history_points()
        file_name = os.path.join(self.__config.get_ds_path(), f'{symbol}.csv')

        # load file
        data = pd.read_csv(file_name)
        n,d = data.shape

        data = data.sort_values('date')
        dates = data['date'].values[history_points:]
        data = data.drop('date', axis=1)
        data = data.values

        # transform dataset to use in model
        normaliser = preprocessing.MinMaxScaler()
        normalized = normaliser.fit_transform(data)

        n,d = normalized.shape
        X = np.array([normalized[i: i+history_points].copy() for i in range(n-history_points)])
        y = np.array([normalized[i].copy() for i in range(history_points, n)])

        # X = X.reshape(n-history_points, history_points*d)
        # y = y[:,0]

        return X, y, normaliser, dates


    def get_all_datasets(self):
        res = []
        for root, dirs, files in os.walk(self.__config.get_ds_path()):
            for fname in files:
                res.append(self.__get_file_stats(fname))
        return res


    def to_data_type(self, data):
        df = pd.DataFrame(data, columns=['date', 'open', 'high', 'low', 'close', 'volume'])
        return json.loads(df.to_json(orient='records'))


    def transform_data(self, data):
        return data.rename(columns={
            '1. open': 'open',
            '2. high': 'high',
            '3. low': 'low',
            '4. close': 'close',
            '5. volume': 'volume'
            })


    def __get_file_stats(self, fname):
        full_path = os.path.join(self.__config.get_ds_path(), fname)
        fs = pathlib.Path(full_path)

        mtime = datetime.fromtimestamp(fs.stat().st_mtime)

        symbol, _ = os.path.splitext(fname)

        return File(
            symbol,
            fs.stat().st_size,
            mtime.strftime('%Y-%m-%d')
        )