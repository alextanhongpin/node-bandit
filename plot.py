import matplotlib.pyplot as plt
import pandas as pd

df = pd.read_csv('plots/probability-best-arm.csv')
df2 = pd.read_csv('plots/average-reward.csv')
df3 = pd.read_csv('plots/cumulative-reward.csv')

fig, axs = plt.subplots(2,2)

fig.suptitle('Multi-Armed Bandit Algorithm')


rows1 = df.head(n=400)
ax = rows1.plot(kind='line', ax=axs[0][0])
ax.set_ylabel('Probability of best arm')
ax.set_xlabel('Trials')


rows2 = df2.head(n=400)
ax2 = rows2.plot(kind='line', ax=axs[0][1])
ax2.set_ylabel('Average Reward')
ax2.set_xlabel('Trials')


rows3 = df3.head(n=400)
ax3 = rows3.plot(kind='line', ax=axs[1][0])
ax3.set_ylabel('Cumulative Reward')
ax3.set_xlabel('Trials')

plt.show()