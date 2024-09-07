//** Если промис не отработал за n мсек - он срывается */
export const promiseTimeLimit = (promise, timer) => {
  const promisesForRace = [
    promise,
    new Promise((res) => setTimeout(() => res(1), timer)),
  ]
  
  return Promise.race(promisesForRace)
}