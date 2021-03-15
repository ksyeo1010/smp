import numpy as np
import pandas as pd
from datetime import datetime

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

