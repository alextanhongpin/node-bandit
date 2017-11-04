import matplotlib.pyplot as plt
import pandas as pd

df = pd.read_csv('plots/probability-best-arm.csv')
df2 = pd.read_csv('plots/average-reward.csv')

fig, axs = plt.subplots(1,2)
first_400_rows = df.head(n=400)
ax = first_400_rows.plot(kind='line', title='Bandit Algorithm', ax=axs[0])
ax.set_ylabel('Probability of best arm')
ax.set_xlabel('Trials')


rows = df2.head(n=400)
ax2 = rows.plot(kind='line', title='Bandit Algorithm', ax=axs[1])
ax2.set_ylabel('Average Reward')
ax2.set_xlabel('Trials')

plt.show()