### Installation

Use [Node.js](https://nodejs.org/en/) to install.

### How to run

1. Go to project directory **cd <your_path>/mega-fs-assignments/algo**
2. Run **npm install** for install project dependencies

```
npm install
```

3. Run **npm run test** for see results.

```
npm run test
```

### How the algorithm works

Validate section

1. Validate argument **wordList** is not to be Array, it will return **None**.
2. Validate argument **wordList** if it length to be less than 2, it will return **None**.
3. Validate argument **target** is not to be String, it will return **None**.
4. Validate argument **target** if it length to be less than 2, it will return **None**.

Function section

1. Define 2 empty Array named **pair** for contain matched word with target argument and **pairDisplay** for display pair results.

```js
let pair = []
let pairDisplay = []
```

2. Define tempTarget for copy target argument.

```js
let tempTarget = target
```

3. Define countEmptyStr for count empty string of wordList element

```js
let countEmptyStr = 0
```

4. Loop wordList

   1. Validate **wordList** element if it have any element to be empty string or only have a one element to be word but another element to be empty string, it will return None.
   2. Check each **wordList** element contain in **target**.
   3. Push **wordList** element to **pair** and **pairDisplay**, if wordList element contain in target.
   4. Remove a word in **target** that matched with **wordList**.
   5. Check length of **pair** to equal 2, if length is equal 2, break loop.

5. Return

   1. Check length of **pair** to equal 2, if length is equal 2 go to next step, if length is not equal 2 return **None**.
   2. Check word sequence of **pair** that equal to **target** string by concat **pair** and check that includes a certain value among **tempTarget**

      1. if that similar return results from **pairDisplay**.
      2. if not similar, check **pair[0]** is in second position of **wordList**, if condition is true, swap word position of **pairDisplay[0]** and **pairDisplay[1]** then return results, if condition is false return **None**

### Space complexity analysis

The space complexity is O(n). Cause (**wordList[]**) is used to loop. So the space grows in a linear with array length.

### Time complexity analysis

![Code image](./solve.jpeg 'solve image')

1. Line 11-14: 4 operations
2. Line 16: loop of **wordList** size n
3. Line 17-32: 5 operations inside the for loop

So, this get 5(n) + 4

In the big O notation, it will be O(n)
