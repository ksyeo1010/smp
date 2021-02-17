from tensorflow.keras import backend as K

def rmse(y_pred, y_true):
    return K.sqrt(K.mean(K.square(y_pred - y_true)))