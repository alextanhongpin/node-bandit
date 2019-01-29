# Bayesian Multi-arm bandit


References: https://hk.saowen.com/a/f3c9978e9734d8d9763a42ee1af8f5528819a08d426e95b6a4c4593cd0355388
```python
import scipy.stats as stats
import numpy as np
np.random.seed(42)

# True probability of winning for each bandit.
p_bandits = [0.45, 0.55, 0.6]

def pull(i):
    """Pull arm of bandit if the probability is less than prob and return 1
    else return 0"""
    if np.random.rand() < p_bandits[i]:
        return 1
    return 0


# The number of trials and wins will represent the prior for each bandit with
# the help of the Beta distribution.
trials = [0, 0, 0] # Number of times we tried each bandit
wins = [0, 0, 0] # Number of wins for each bandit
n = 1000


for step in range(1, n +1):
    bandit_priors = [
            stats.beta(a=1+w, b=1+t-w) for t, w in zip(trials, wins)]
    theta_samples = [d.rvs(1) for d in bandit_priors]
    chosen_bandit = np.argmax(theta_samples)
    x = pull(chosen_bandit)
    trials[chosen_bandit] += 1
    wins[chosen_bandit] += x

print(trials)
print(wins)
```
