import numpy as np

def get_next_pred(model, x):
    return model.predict(x)


def forecast(model, start, num_days=30):
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

    return preds