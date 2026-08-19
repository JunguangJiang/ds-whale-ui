// Whale phase derivation from live session facts. Facts are plain objects:
// { running, partial, runningCalls, lastError }.

const KIND = {
  hidden: 'hidden',
  enter: 'enter',
  thinking: 'thinking',
  working: 'working',
  finishSuccess: 'finishSuccess',
  finishError: 'finishError',
}

/**
 * Derive the next phase from the previous and current fact sets.
 * @param prev - facts from the previous turn of the state machine.
 * @param now - current facts.
 * @returns the phase key.
 */
function derivePhase(prev, now) {
  if (now.running) {
    if (!prev.running) return KIND.enter
    if (now.partial) return KIND.thinking
    if (now.runningCalls > 0) return KIND.working
    return KIND.thinking
  }
  if (prev.running) return now.lastError ? KIND.finishError : KIND.finishSuccess
  return KIND.hidden
}

mod.KIND = KIND
mod.derivePhase = derivePhase
