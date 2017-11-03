import matplotlib.pyplot as plt
import pandas as pd

df = pd.read_csv('thompson.csv')
print(df.describe())

my_plot = df.plot(kind='line')

# plt.plot([1,2,3])
# plt.ylabel('Numbers')
# plt.xlabel('index')

plt.show()