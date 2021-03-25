import numpy as np
import tensorflow as tf
import pandas as pd
from dataclasses import dataclass
from sklearn import preprocessing
from tensorflow import keras
from tensorflow.keras import layers

from utils.rmse import rmse

@dataclass
class GenerateDataset:
    X: object
    y: object
    normaliser: object
    dates: object

HISTORY_POINTS = 50
BATCH_SIZE = 10

def generate_dataset(fpath, history_points=HISTORY_POINTS, batch_size=BATCH_SIZE):
    # load file
    data = pd.read_csv(fpath)
    n,d = data.shape

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

    return GenerateDataset(X, y, normaliser, dates)


def generalize_input(*args):
    n, *_ = args[0].X.shape
    for a in args:
        t, *_ = a.X.shape
        if t < n:
            n = t

    for a in args:
        t, *_ = a.X.shape
        a.X = a.X[t-n:]
        a.y = a.y[t-n:]


def stock_model(history_points=HISTORY_POINTS):
    t_input = keras.Input(shape=(history_points,3), name="trend")
    s_input = keras.Input(shape=(history_points,5), name="stock")

    t_features = layers.LSTM(64, dropout=0.2)(t_input)
    s_features = layers.LSTM(64, dropout=0.2)(s_input)

    t_features = layers.Dense(128)(t_features)
    t_features = layers.Activation('sigmoid')(t_features)

    t_features = layers.Dense(64)(t_features)
    t_features = layers.Activation('linear')(t_features)

    x = layers.concatenate([t_features, s_features])
    
    x = layers.Dense(64)(x)
    x = layers.Activation('linear')(x)

    trend_pred = layers.Dense(3, name="trend_pred")(x)
    stock_pred = layers.Dense(5, name="stock_pred")(x)

    model = keras.Model(
        inputs = [t_input, s_input],
        outputs = [trend_pred, stock_pred]
    )

    model.compile(
        optimizer = "adam",
        loss = "mse",
        loss_weights= [0.5, 1.0]
    )

    model.summary()

    return model