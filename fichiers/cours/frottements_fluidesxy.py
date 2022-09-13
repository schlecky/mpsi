# Mouvement d'un point matériel dans le champs de pesenteur terrestre avec
# des frottements fluides proportionnels à v**2
import numpy as np
from scipy.integrate import odeint
import matplotlib.pyplot as plt

# Equation différentielle avec les frottements
def f(X,t):
    g=9.81
    m=10
    k=0.01
    x,xp,y,yp = X
    v = np.array([xp, yp])

    f = -k*v*np.linalg.norm(v)
    return [xp, f[0]/m, yp, -g + f[1]/m]

# Sans les frottements
def f2(X,t):
    g=9.81
    m=10
    k=0
    x,xp,y,yp = X
    v = np.array([xp, yp])

    f = -k*v*np.linalg.norm(v)
    return [xp, f[0]/m, yp, -g + f[1]/m]

# De 0 à 20s avec 100 points
t = np.linspace(0, 20, 100)
# X0 = [x0, vx0, y0, vy0]
X0 = [0, 100, 0, 100]
x,xp,y,yp = odeint(f,X0, t).transpose()
x2,xp2,y2,yp2 = odeint(f2,X0, t).transpose()

plt.plot(x,y)
plt.plot(x2,y2)
plt.show()