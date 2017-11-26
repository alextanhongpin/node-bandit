from numpy import *
from scipy.stats import beta

import random


class BetaBandit(object):
  def __init__(self, num_options=2, prior=(1.0, 1.0)):
    self.trials = zeros(shape=(num_options,), dtype=int)
    self.successes = zeros(shape=(num_options,), dtype=int)
    self.num_options = num_options
    self.prior = prior
  
  def update(self, trial_id, success):
    self.trials[trial_id] = self.trials[trial_id] + 1
    if success:
      self.successes[trial_id] = self.successes[trial_id] + 1
    
  def pull_arm(self):
    sampled_theta = []
    for i in range(self.num_options):
      # Construct beta distribution for posterior
      dist = beta(self.prior[0] + self.successes[i],
                  self.prior[1] + self.trials[i] - self.successes[i])
      # Draw sample from beta distribution
      sampled_theta += [dist.rvs()]
    # Return the index of the sample with the largest value
    return argmax(sampled_theta) # sampled_theta.index(max(sampled_theta))


theta = (0.25, 0.35)

def is_conversion(title):
    if random.random() < theta[title]:
        return True
    else:
        return False

conversions = [0,0]
trials = [0,0]

N = 1000
trials = zeros(shape=(N,2))
successes = zeros(shape=(N,2))

bb = BetaBandit()
for i in range(N):
    choice = bb.pull_arm()
    trials[choice] = trials[choice]+1
    conv = is_conversion(choice)
    bb.update(choice, conv)

    trials[i] = bb.trials
    successes[i] = bb.successes

from pylab import *
subplot(211)
n = arange(N)+1
loglog(n, trials[:,0], label="title 0")
loglog(n, trials[:,1], label="title 1")
legend()
xlabel("Number of trials")
ylabel("Number of trials/title")

subplot(212)
semilogx(n, (successes[:,0]+successes[:,1])/n, label="CTR")
semilogx(n, zeros(shape=(N,))+0.35, label="Best CTR")
semilogx(n, zeros(shape=(N,))+0.30, label="Random chance CTR")
semilogx(n, zeros(shape=(N,))+0.25, label="Worst CTR")
axis([0,N,0.15,0.45])
xlabel("Number of trials")
ylabel("CTR")


legend()
show()