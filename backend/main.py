from dotenv import load_dotenv
import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np

from models.basic_model import basic_model
from utils.rmse import rmse
import utils.dataset as ds
from utils.forecast import *

load_dotenv()

history_points = 50

if __name__ == '__main__':
    # ds.save_dataset('AAPL')
    X,y,normaliser, data = ds.load_dataset('AAPL', history_points)

    # current unscaled data
    n,d = data.shape
    y_true = data[history_points:n]

    # get prediction
    model = basic_model(history_points)
    model.fit(X,y,batch_size=64, epochs=10, shuffle=True, validation_split=0.1)
    y_pred = model.predict(X)

    # get new predictions
    x_new = X[-1]
    x_new = np.delete(x_new, 1, axis=0)
    x_new = np.append(x_new, y_pred[-1].reshape(1,-1), axis=0)
    preds = forecast(model, x_new)

    # transform back
    y_pred = normaliser.inverse_transform(y_pred)
    preds = normaliser.inverse_transform(preds)

    # RMSE
    loss = rmse(y_pred[:,0], y_true[:,0])
    print("RMSE Loss: %.3f" % loss.numpy())

    # plot
    plt.plot(y_true[:,0], label='Real')
    plt.plot(np.append(y_pred,preds, axis=0)[:,0], label='Predicted')

    plt.legend(['Real', 'Predicted'])
    plt.show()