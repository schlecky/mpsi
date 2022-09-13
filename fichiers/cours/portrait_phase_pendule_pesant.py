# coding: utf-8

import numpy as np
import matplotlib.pyplot as plt
import scipy.integrate


#Discrétisation du temps------------------------

nombre_pas = 20000
t_final = 300
t = np.linspace(0,t_final,num=nombre_pas)

#Système d'équations à résoudre-----------------

def sys(y,t):
    """
    La fonction sys renvoie une liste contenant
    la dérivée de x et celle de x'
    """
    x, xprime = y

    k=0.05 # Coefficient de frottements, mettre 0 pour un pendule non amorti
    return [xprime, -np.sin(x)-k*xprime]



#Liste de conditions initiales-------------------


# Cas 'normal'
y0 = [[-np.pi/4.0,0],[-np.pi/2,1.0],[-np.pi+0.001,0.0],[-np.pi,1.0]]

#Integration par le solveur odeint---------------------------------

#solution contient une liste de matrices, une pour chaque condition initiale y0
#chaque matrice contient (x,x'); le tableau t contient le temps

solution = []
for ci in y0:
    solution.append(scipy.integrate.odeint(sys,ci,t))

#Affichage---------------------------------------------
f, ax = plt.subplots(1,2) # ax[n] est la figure n

## Tracé de la solution en temps
for sol in solution:
    ax[0].plot(t[0000:2000],sol[0000:2000,0])
    ax[0].set_xlabel("Temps")
    ax[0].set_ylim(-4, 10)
    ax[0].grid()
    ax[0].set_ylabel("Position")
    ax[0].set_title('Evolution temporelle du systeme')

## Tracé du portrait de phase
for sol in solution: # tracé du portrait de phase
    ax[1].plot(sol[:,0],sol[:,1])
    ax[1].set_xlim(-4, 10)
    ax[1].set_ylim(-4, 10)
    ax[1].set_xlabel("Position")
    ax[1].set_ylabel("Vitesse")
    ax[1].grid()
    ax[1].set_title("Portrait de phase")

plt.show()
