import numpy as np
from sklearn import preprocessing

def apply_indicators(X, axis, indicators):
    res = {}
    for ind in indicators:
        res[ind.__name__] = ind(X, axis)
    return res

def deserialize_indicators(name, indicators):
    res = {}
    for ind, value in indicators.items():
        res[f'{name}_{ind}'] = value
    return res

def sma(X, axis):
    return np.mean(X, axis=axis)

def macd(X, axis):
    return ema(X, axis, 12) - ema(X, axis, 26)

def ema(X, axis, period):
    mean = sma(X, axis)
    k = 2 / (1 + period)
    for i in range(X.shape[axis] - period, X.shape[axis]):
        mean = np.take(X, i, axis=axis) * k + mean * (1 - k)
    return mean
