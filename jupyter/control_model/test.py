# 制御モデル
import control
from control.matlab import tf, tfdata
P = tf([0,1], [1,2,3])
print(P)
[[numP]], [[denP]] = tfdata(P)
print(numP, denP)
