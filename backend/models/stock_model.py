import numpy as np
import tensorflow as tf
import pandas as pd
from dataclasses import dataclass
from sklearn import preprocessing
from tensorflow import keras
from tensorflow.keras import layers

from utils.rmse import rmse

np.random.seed(4)
tf.random.set_seed(4)

@dataclass
class GenerateDataset:
    X: object
    y: object
    normaliser: object
    dates: object
    indicators: object

HISTORY_POINTS = 50

def generate_lstm_dataset(fpath, history_points=HISTORY_POINTS):
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

    return GenerateDataset(X, y, normaliser, dates, {})


def generate_dataset(fpath, history_points=HISTORY_POINTS):
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
    X = np.array([normalized[i-1].copy() for i in range(history_points, n)])
    y = np.array([normalized[i].copy() for i in range(history_points, n)])

    return GenerateDataset(X, y, normaliser, dates, {})


def stock_model(indicators, weights, history_points=HISTORY_POINTS):
    t_input = keras.Input(shape=(3), name='trend')
    s_input = keras.Input(shape=(history_points,5), name='stock')
    s_branch = []

    t_features = layers.Dense(32, activation='relu')(t_input)
    t_features = layers.Dropout(0.2)(t_features)

    # indicator layers
    for ind, w in zip(indicators, weights):
        s_ind_input = keras.Input(shape=(5), name=f'stock_{ind.__name__}')
        s_ind = layers.Dense(32, activation='relu')(s_ind_input)
        s_ind = layers.Dropout(w)(s_ind)
        s_branch.append(keras.Model(inputs=s_ind_input, outputs=s_ind))

    s_features = layers.LSTM(64, dropout=0.2)(s_input)
    s_features = layers.concatenate([s_features, *[layer.output for layer in s_branch]])

    x = layers.concatenate([t_features, s_features])
    x = layers.Dense(64, activation='sigmoid')(x)

    trend_pred = layers.Dense(3, name='trend_pred')(t_features)
    stock_pred = layers.Dense(5, name='stock_pred')(x)

    model = keras.Model(
        inputs = [t_input, s_input, *[layer.input for layer in s_branch]],
        outputs = [trend_pred, stock_pred]
    )

    model.compile(
        optimizer = "adam",
        loss = "mse",
        loss_weights= [1.0, 1.0]
    )

    model.summary()

    return model