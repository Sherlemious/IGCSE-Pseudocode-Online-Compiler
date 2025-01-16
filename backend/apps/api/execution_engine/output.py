import random
import math
n=[[0 for i in range(1000)] for f in range(1000)]
x = [[5,1,2],[1,6,3]]
t = [0,0]
avg = [0,0]
for c1 in range(0, 2):
    for c2 in range(0, 3):
        t[c1]=t[c1] + x[c1][c2]
    avg[0] = t[1]/3
    print(avg[0])
    avg[0] = eval(input())
    print(avg[0])
print((n[1][2]))
if x != 3:
    print("NO")
x = "Hello World"
print(x)
input("Press enter to exit ")