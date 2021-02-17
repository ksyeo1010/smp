import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

from utils.rmse import rmse

def basic_model(history_points):
    # basic model
    model = keras.Sequential()
    model.add(layers.Input(shape=(history_points, 5)))
    model.add(layers.LSTM(50))
    model.add(layers.Dropout(0.2))
    model.add(layers.Dense(64))
    model.add(layers.Activation('sigmoid'))
    model.add(layers.Dense(5))
    model.add(layers.Activation('linear'))

    model.compile(optimizer='adam', loss='mse')

    model.summary()

    return model