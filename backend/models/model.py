import os
import pickle
import uuid
import pathlib
import numpy as np
import tensorflow as tf
from enum import Enum
from datetime import datetime
from dataclasses import dataclass
from utils import Config, Data

# list models
from models import basic_model, future_pred, get_future_days

@dataclass
class PredList:
    uuid: str
    symbol: str
    predicted_at: str

@dataclass
class Prediction:
    symbol: str
    predicted_at: str
    predictions: Data
    forecast: Data

# enum type
class ModelType(Enum):
    BASIC = 1


class Model:
    def __init__(self):
        self.__config = Config()
        pathlib.Path(self.__config.get_model_path()).mkdir(parents=True, exist_ok=True)
        pathlib.Path(self.__config.get_prediction_path()).mkdir(parents=True, exist_ok=True)


    def fit_predict(self, symbol, mtype, ds):
        mid = str(uuid.uuid4())
        X,y,normaliser,data = ds.generate_dataset(symbol)
        model = self.get_model(mtype)
        model.fit(X,y)
        self.save_model(mid, model)

        y_pred = model.predict(X)
        y_pred = normaliser.inverse_transform(y_pred)

        preds = future_pred(model, X[-1])
        preds = normaliser.inverse_transform(preds)

        dates = data[self.__config.get_history_points()+1:,0].reshape(-1,1)
        y_pred = np.concatenate((dates, y_pred), axis=1)
        preds = np.concatenate((get_future_days(data[-1,0]), preds), axis=1)

        curr_date = datetime.now().strftime('%Y-%m-%d')
        self.save_prediction(mid, symbol, curr_date, ds.transform_data(y_pred), ds.transform_data(preds))

        return PredList(mid, symbol, curr_date)


    def get_model(self, mtype):
        if mtype == ModelType.BASIC:
            return basic_model(self.__config.get_history_points())


    def save_model(self, mid, model):
        fpath = self.__get_model_file_path(mid)
        model.save(fpath)


    def load_model(self, mid):
        fpath = self.__get_model_file_path(mid)
        return tf.keras.models.load_model(fpath)


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


    def load_prediction(self, mid):
        fpath = self.__get_prediction_file_path(mid)
        with open(fpath, 'rb') as input:
            pred =  pickle.load(input)
            input.close()
        return pred


    def __get_model_file_path(self, mid):
        return os.path.join(self.__config.get_model_path(), mid)


    def __get_prediction_file_path(self, mid):
        return os.path.join(self.__config.get_prediction_path(), mid)
