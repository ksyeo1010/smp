from alpha_vantage.timeseries import TimeSeries
import os
import pandas as pd
import pathlib
from datetime import datetime
from dataclasses import dataclass
import json
import shutil

from utils import Config, Trends

@dataclass
class File:
    symbol: str
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
        self.__trends = Trends()
        pathlib.Path(self.__config.get_ds_path()).mkdir(parents=True, exist_ok=True)


    def save_dataset(self, symbol):
        dt = self.__config.get_min_date()

        ts = TimeSeries(key=self.__config.get_api_key(), output_format='pandas')

        data, _ = ts.get_daily(symbol, outputsize='full')
        data = data.sort_values('date')
        data = data[dt:]
        data = self.transform_data(data)

        data_path = os.path.join(self.__config.get_ds_path(), f'{symbol}.csv')
        data.to_csv(data_path)

        return self.__get_file_stats(symbol, data_path)


    def load_dataset(self, symbol, dateRange=None):
        fpath = os.path.join(self.__config.get_ds_path(), f'{symbol}.csv')
        data = pd.read_csv(fpath)
        if dateRange is not None:
            length, _ = data.shape
            data = data[length-int(dateRange):]

        fstat = self.__get_file_stats(symbol, fpath)
        return DataFile(
            fstat.symbol,
            fstat.size,
            fstat.modified,
            json.loads(data.to_json(orient='records'))
        )

    def delete_dataset(self, symbol):
        shutil.rmtree(os.path.join(self.__config.get_ds_path(), symbol))


    def get_all_datasets(self):
        res = []
        for root, dirs, files in os.walk(self.__config.get_ds_path()):
            for fname in files:
                symbol = os.path.splitext(fname)[0]
                fpath = os.path.join(self.__config.get_ds_path(), f'{symbol}.csv')
                res.append(self.__get_file_stats(symbol, fpath))
        return res


    def transform_data(self, data):
        return data.rename(columns={
            '1. open': 'open',
            '2. high': 'high',
            '3. low': 'low',
            '4. close': 'close',
            '5. volume': 'volume'
            })


    def __get_file_stats(self, symbol, fpath):
        fs = pathlib.Path(fpath)
        mtime = datetime.fromtimestamp(fs.stat().st_mtime)

        return File(
            symbol,
            fs.stat().st_size,
            mtime.strftime('%Y-%m-%d')
        )