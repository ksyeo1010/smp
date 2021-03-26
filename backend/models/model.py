import os
import pickle
import uuid
import pathlib
import numpy as np
import tensorflow as tf
import shutil
import pandas as pd
import json
from enum import Enum
from datetime import datetime
from dataclasses import dataclass

from utils import Config, Data
from .stock_model import stock_model, generate_dataset, generate_lstm_dataset
from .preds import forecast
from .indicators import *


@dataclass
class PredList:
    uuid: str
    symbol: str
    predicted_at: str

@dataclass
class Prediction:
    symbol: str
    predicted_at: str
    predictions: [Data]
    forecast: [Data]


class Model:
    def __init__(self):
        self.__config = Config()
        pathlib.Path(self.__config.get_model_path()).mkdir(parents=True, exist_ok=True)
        pathlib.Path(self.__config.get_prediction_path()).mkdir(parents=True, exist_ok=True)


    def fit_predict(self, symbol):
        mid = str(uuid.uuid4())

        tpath = os.path.join(self.__config.get_trend_path(), f'{symbol}.csv')
        spath = os.path.join(self.__config.get_ds_path(), f'{symbol}.csv')

        history_points = 50
        trend = generate_dataset(tpath, history_points)
        stock = generate_lstm_dataset(spath, history_points)

        indicators = [sma]
        stock.indicators = apply_indicators(stock.X, 1, indicators)

        model = stock_model(indicators, [0.2, 0.2], history_points)
        model.fit(
            {
                "trend": trend.X,
                "stock": stock.X,
                **deserialize_indicators("stock", stock.indicators)
            },
            {"trend_pred": trend.y, "stock_pred": stock.y},
            epochs=5,
            batch_size=32,
            shuffle=True
        )

        y_t, y_s = model.predict({
                "trend": trend.X,
                "stock": stock.X,
                **deserialize_indicators("stock", stock.indicators)
            })
        y_s = stock.normaliser.inverse_transform(y_s)

        pred_dates, preds = forecast(model, indicators, trend, stock, stock.dates[-1])
        preds = stock.normaliser.inverse_transform(preds)

        y_s = np.concatenate((stock.dates.reshape(-1,1), y_s), axis=1)
        preds = np.concatenate((pred_dates, preds), axis=1)

        curr_date = datetime.now().strftime('%Y-%m-%d')

        self.save_model(mid, model)
        self.save_prediction(mid, symbol, curr_date, self.to_data_type(y_s), self.to_data_type(preds))

        return PredList(mid, symbol, curr_date)


    def to_data_type(self, data):
        df = pd.DataFrame(data, columns=['date', 'open', 'high', 'low', 'close', 'volume'])
        return json.loads(df.to_json(orient='records'))


    def save_model(self, mid, model):
        fpath = self.__get_model_file_path(mid)
        model.save(fpath)


    def load_model(self, mid):
        fpath = self.__get_model_file_path(mid)
        return tf.keras.models.load_model(fpath)


    def delete_model(self, mid):
        file_name = self.__get_model_file_path(mid)
        shutil.rmtree(file_name)


    def get_predictions(self):
        res = []
        for root, dirs, files in os.walk(self.__config.get_prediction_path()):
            for fname in files:
                with open(self.__get_prediction_file_path(fname), 'rb') as input:
                    pred = pickle.load(input)
                    res.append(PredList(fname, pred.symbol, pred.predicted_at))
                    input.close()
        return res


    def save_prediction(self, mid, symbol, date, predictions, forecast):
        pred = Prediction(symbol, date, predictions, forecast)
        fpath = self.__get_prediction_file_path(mid)
        with open(fpath, 'wb') as output:
            pickle.dump(pred, output, pickle.HIGHEST_PROTOCOL)
            output.close()


    def load_prediction(self, mid, dateRange=None):
        fpath = self.__get_prediction_file_path(mid)
        with open(fpath, 'rb') as input:
            pred =  pickle.load(input)
            input.close()
        if dateRange is not None:
            length = len(pred.predictions)
            pred.predictions = pred.predictions[length-int(dateRange):]
        return pred


    def delete_prediction(self, mid):
        file_name = self.__get_prediction_file_path(mid)
        os.remove(file_name)


    def __get_model_file_path(self, mid):
        return os.path.join(self.__config.get_model_path(), mid)


    def __get_prediction_file_path(self, mid):
        return os.path.join(self.__config.get_prediction_path(), mid)
