import numpy as np
import pandas as pd
from datetime import datetime

from utils import get_date
from models.indicators import apply_indicators, deserialize_indicators

def get_next_pred(model, x):
    return model.predict(x)


def future_pred(model, start, num_days=30):
    num_days += 1
    _, d = start.shape

    X = np.array(start, copy=True)
    X = np.expand_dims(X, axis=0)
    preds = np.zeros(shape=(num_days, d))

    # start predictions
    for i in range(num_days):
        pred = get_next_pred(model, X)
        preds[i] = pred

        # remove first, append pred
        X = np.delete(X,1, axis=1)
        X = np.append(X, np.expand_dims(pred, axis=0), axis=1)

    return preds[1:]


def get_future_days(start_date, num_days=30):
    data_range = pd.date_range(start=start_date, periods=num_days, freq=pd.offsets.BDay()).strftime('%Y-%m-%d').to_numpy()
    return data_range.reshape(-1,1)


def forecast(model, indicators, trend, stock, start_date, num_days=30):
    _,d = stock.y.shape
    preds = np.zeros(shape=(num_days, d))

    dates = get_future_days(start_date)

    x_t = np.expand_dims(trend.X[-1], axis=0)
    x_s = np.expand_dims(stock.X[-1], axis=0)

    s_ind = apply_indicators(x_s, 1, indicators)

    for i in range(num_days):
        y_t, y_s = model.predict({
            "trend": x_t,
            "stock": x_s,
            **deserialize_indicators("stock", s_ind)
        })
        preds[i] = y_s

        x_t = y_t
        x_s = remove_and_append(x_s, y_s)

        s_ind = apply_indicators(x_s, 1, indicators)

    return dates, preds


def remove_and_append(x, y):
    # remove first, append pred
    x = np.delete(x, 1, axis=1)
    x = np.append(x, np.expand_dims(y, axis=0), axis=1)
    return x

