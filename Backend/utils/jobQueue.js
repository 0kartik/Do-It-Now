const queue = []

export function addJob(job) {
  queue.push(job)
}

export function processJobs() {
  setInterval(() => {
    if (queue.length === 0) return

    const job = queue.shift()
    job()
  }, 2000)
}