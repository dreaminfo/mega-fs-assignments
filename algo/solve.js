function solve(wordList, target) {
  // Check wordList
  if (!Array.isArray(wordList)) return 'None'
  if (wordList.length < 2) return 'None'

  let countEmptyStr = 0
  wordList.map((word) => {
    if (word.length === 0) {
      countEmptyStr++
    }
  })
  if (
    countEmptyStr === wordList.length ||
    countEmptyStr === wordList.length - 1
  )
    return 'None'

  // Check target
  if (typeof target !== 'string') return 'None'
  if (target.length < 2) return 'None'

  // Core Function
  let pair = []
  let pairDisplay = []
  let tempTarget = target

  for (let i = 0; i < wordList.length; i++) {
    if (target.includes(wordList[i])) {
      pair.push(wordList[i])
      pairDisplay.push(`"${wordList[i]}"`)
      target = target.replace(wordList[i], '')
    }

    if (pair.length == 2) break
  }

  if (pair.length === 2) {
    if (tempTarget.includes(pair.join(''))) {
      return `(${pairDisplay.join(', ')})`
    } else if (tempTarget.split(pair[0])[1] === '') {
      let oldFirstElement = pairDisplay[0]
      pairDisplay[0] = pairDisplay[1]
      pairDisplay[1] = oldFirstElement

      return `(${pairDisplay.join(', ')})`
    } else {
      return 'None'
    }
  } else {
    return 'None'
  }
}

module.exports = solve
