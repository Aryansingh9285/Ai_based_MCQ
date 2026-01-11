export const getMockQuestions = (domain: string) => {
  const mockQuestions: { [key: string]: any[] } = {
    'JavaScript': [
      {
        question: 'What is the output of the following JavaScript code?\nlet a = [1, 2, 3];\na.length = 0;\nconsole.log(a);',
        options: ['[1, 2, 3]', '[0, 0, 0]', '[]', 'undefined'],
        answer: 'C',
        explanation: 'Setting length = 0 clears the array completely. The array becomes empty.'
      },
      {
        question: 'What does the spread operator (...) do when used with an array?',
        options: ['Creates a copy of the array', 'Spreads array elements as individual arguments', 'Both A and B', 'Removes duplicate elements'],
        answer: 'C',
        explanation: 'The spread operator unpacks array elements and can be used to create copies or pass elements as arguments.'
      },
      {
        question: 'What is the difference between var, let, and const in terms of scope?',
        options: ['var is function-scoped, let and const are block-scoped', 'All three have the same scope', 'const is global-scoped', 'let is function-scoped'],
        answer: 'A',
        explanation: 'var is function-scoped while let and const are block-scoped (within {}).'
      },
      {
        question: 'What will be the output of Promise.resolve(5).then(x => x * 2)?',
        options: ['10', 'Promise {<pending>}', 'undefined', 'NaN'],
        answer: 'B',
        explanation: 'then() returns a new Promise. The actual value 10 would be inside the resolved promise.'
      },
      {
        question: 'What is the time complexity of finding an element in an unordered array?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        answer: 'C',
        explanation: 'Without an index, you must check each element, making it linear time O(n).'
      },
      {
        question: 'How does the event loop work in JavaScript?',
        options: ['Executes synchronous code, then microtasks, then macrotasks', 'Executes all code in order', 'Executes microtasks first, then synchronous code', 'No such thing exists'],
        answer: 'A',
        explanation: 'The event loop prioritizes: call stack → microtasks (promises) → macrotasks (setTimeout).'
      },
      {
        question: 'What is the correct way to clone an object in JavaScript?',
        options: ['obj2 = obj1', 'obj2 = {...obj1}', 'obj2 = Object.assign({}, obj1)', 'Both B and C'],
        answer: 'D',
        explanation: 'Both spread operator and Object.assign() create shallow copies of objects.'
      },
      {
        question: 'What does Object.freeze() do?',
        options: ['Prevents object deletion', 'Prevents property modification', 'Prevents property addition and modification', 'Clones the object'],
        answer: 'C',
        explanation: 'Object.freeze() makes an object immutable - no properties can be added, removed, or modified.'
      },
      {
        question: 'What is the output of [1,2,3].map(x => x * 2).filter(x => x > 3)?',
        options: ['[2, 4, 6]', '[4, 6]', '[2, 4]', '[1, 2, 3]'],
        answer: 'B',
        explanation: 'map produces [2, 4, 6], then filter keeps only values > 3, resulting in [4, 6].'
      },
      {
        question: 'What is a closure in JavaScript?',
        options: ['A function that closes the program', 'A function with access to its outer function variables', 'A way to end a function', 'An error in the code'],
        answer: 'B',
        explanation: 'A closure is a function that has access to variables from its outer (enclosing) function.'
      },
      {
        question: 'What will typeof undefined return?',
        options: ['"undefined"', '"object"', 'null', 'NaN'],
        answer: 'A',
        explanation: 'typeof undefined returns the string "undefined".'
      },
      {
        question: 'What is the output of 0.1 + 0.2 === 0.3 in JavaScript?',
        options: ['true', 'false', 'undefined', 'NaN'],
        answer: 'B',
        explanation: 'Due to floating-point precision, 0.1 + 0.2 equals 0.30000000000000004, not 0.3.'
      },
      {
        question: 'How do you handle errors in async/await?',
        options: ['Try-catch block', 'then().catch()', '.error() method', 'Promise.reject()'],
        answer: 'A',
        explanation: 'async/await uses try-catch blocks for error handling, similar to synchronous code.'
      },
      {
        question: 'What is the difference between == and === in JavaScript?',
        options: ['No difference', '== does type coercion, === does not', '=== does type coercion, == does not', '== is for objects, === is for primitives'],
        answer: 'B',
        explanation: '== performs type coercion (e.g., "5" == 5 is true), while === checks both value and type.'
      },
      {
        question: 'What will Array.isArray([1,2,3]) return?',
        options: ['false', 'true', '[1,2,3]', 'undefined'],
        answer: 'B',
        explanation: 'Array.isArray() returns true if the argument is an array, false otherwise.'
      }
    ],
    'Python': [
      {
        question: 'What is the output of len([1, 2, 3, [4, 5]])?',
        options: ['3', '4', '5', 'Error'],
        answer: 'B',
        explanation: 'len() counts the top-level elements: 1, 2, 3, and the sublist [4,5]. Total = 4 elements.'
      },
      {
        question: 'What is the difference between a list and a tuple in Python?',
        options: ['Lists are immutable, tuples are mutable', 'Lists are mutable, tuples are immutable', 'No difference', 'Tuples are faster'],
        answer: 'B',
        explanation: 'Lists can be modified after creation, while tuples cannot be changed once created.'
      },
      {
        question: 'What will print(type(5)) output?',
        options: ["'int'", '<class \'int\'>', '5', 'number'],
        answer: 'B',
        explanation: 'type() returns the class of an object. For integer 5, it returns <class \'int\'>.'
      },
      {
        question: 'What is list comprehension in Python?',
        options: ['A way to read list documentation', 'A concise way to create lists', 'A debugging method', 'A type of list'],
        answer: 'B',
        explanation: 'List comprehension is a concise syntax to create lists, e.g., [x*2 for x in range(5)].'
      },
      {
        question: 'What will dictionary.get("key", "default") return if "key" doesn\'t exist?',
        options: ['None', 'Error', '"default"', 'False'],
        answer: 'C',
        explanation: 'get() returns the second argument as default if the key is not found.'
      },
      {
        question: 'What is the output of "hello".upper()?',
        options: ['"HELLO"', '"Hello"', 'Error', 'None'],
        answer: 'A',
        explanation: 'The upper() method returns a new string with all characters converted to uppercase.'
      },
      {
        question: 'How do you create a virtual environment in Python?',
        options: ['python venv', 'python -m venv', 'pip venv', 'python virtualenv'],
        answer: 'B',
        explanation: 'python -m venv <name> is the standard way to create a virtual environment.'
      },
      {
        question: 'What is the time complexity of searching in a set?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 'A',
        explanation: 'Sets use hashing, providing average O(1) lookup time.'
      },
      {
        question: 'What will range(5) produce?',
        options: ['[1, 2, 3, 4, 5]', '[0, 1, 2, 3, 4]', '[1, 2, 3, 4]', 'Error'],
        answer: 'B',
        explanation: 'range(5) produces a sequence from 0 to 4 (not including 5).'
      },
      {
        question: 'What is a lambda function in Python?',
        options: ['A class definition', 'An anonymous function', 'A built-in module', 'A loop statement'],
        answer: 'B',
        explanation: 'lambda creates small anonymous functions without using def.'
      },
      {
        question: 'What will "*args" capture in a function definition?',
        options: ['Keyword arguments as a dictionary', 'All positional arguments as a tuple', 'All arguments', 'Error'],
        answer: 'B',
        explanation: '*args captures variable-length positional arguments as a tuple.'
      },
      {
        question: 'What is the output of 5 // 2 in Python?',
        options: ['2', '2.5', '3', 'Error'],
        answer: 'A',
        explanation: '// is floor division, returning 2 (not the decimal 2.5).'
      },
      {
        question: 'How do you read a file in Python?',
        options: ['open("file.txt")', 'read("file.txt")', 'file = "file.txt"', 'import file'],
        answer: 'A',
        explanation: 'open() is used to open files. Then you can read(), write(), or iterate over it.'
      },
      {
        question: 'What is the difference between deep copy and shallow copy?',
        options: ['Deep copy modifies original, shallow does not', 'Shallow copies nested objects, deep does not', 'Deep copies nested objects, shallow does not', 'No difference'],
        answer: 'C',
        explanation: 'Deep copy duplicates nested objects, while shallow copy only copies references to them.'
      },
      {
        question: 'What will bool([]) return?',
        options: ['True', 'False', 'Error', 'None'],
        answer: 'B',
        explanation: 'Empty sequences (list, tuple, string) are falsy in Python, so bool([]) is False.'
      }
    ],
    'Data Structure Algorithm': [
      {
        question: 'What is the time complexity of binary search?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        answer: 'B',
        explanation: 'Binary search divides the search space in half each time, giving O(log n) complexity.'
      },
      {
        question: 'What is a hash table\'s average lookup time?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        answer: 'A',
        explanation: 'Hash tables provide average O(1) lookup, insert, and delete operations.'
      },
      {
        question: 'Which sorting algorithm has the worst-case time complexity of O(n²)?',
        options: ['Merge Sort', 'Quick Sort', 'Bubble Sort', 'Heap Sort'],
        answer: 'C',
        explanation: 'Bubble Sort has O(n²) worst-case complexity. Others have better worst-case bounds.'
      },
      {
        question: 'What is a balanced binary search tree?',
        options: ['A tree where all leaves are at the same level', 'A tree where height difference between left and right subtrees is ≤ 1', 'A tree with only two children', 'A sorted tree'],
        answer: 'B',
        explanation: 'Balanced BSTs maintain height balance to ensure O(log n) operations.'
      },
      {
        question: 'What is the space complexity of merge sort?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        answer: 'C',
        explanation: 'Merge sort requires O(n) extra space for the temporary arrays during merging.'
      },
      {
        question: 'What data structure is used for BFS (Breadth-First Search)?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Hash Map'],
        answer: 'B',
        explanation: 'BFS uses a queue to explore vertices level by level.'
      },
      {
        question: 'What is the output of a topological sort?',
        options: ['A sorted array', 'A linear ordering of vertices respecting dependencies', 'A tree', 'A cycle'],
        answer: 'B',
        explanation: 'Topological sort produces a linear ordering where each vertex comes before its dependents.'
      },
      {
        question: 'What is the worst-case time complexity of quicksort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
        answer: 'C',
        explanation: 'Quicksort has O(n²) worst-case when pivot selection is poor, but O(n log n) average.'
      },
      {
        question: 'What is the maximum number of edges in a simple graph with n vertices?',
        options: ['n', 'n(n-1)/2', 'n²', 'n!'],
        answer: 'B',
        explanation: 'A complete graph has n(n-1)/2 edges (each vertex connects to n-1 others).'
      },
      {
        question: 'What is Dijkstra\'s algorithm used for?',
        options: ['Sorting arrays', 'Finding shortest paths in weighted graphs', 'Finding connected components', 'Topological sorting'],
        answer: 'B',
        explanation: 'Dijkstra finds the shortest path from a source to all other vertices in a weighted graph.'
      },
      {
        question: 'What is the time complexity of heap sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
        answer: 'B',
        explanation: 'Heap sort has O(n log n) time complexity for all cases (best, average, worst).'
      },
      {
        question: 'What is a trie data structure used for?',
        options: ['Sorting numbers', 'Efficient string searching and prefix matching', 'Storing key-value pairs', 'Implementing stacks'],
        answer: 'B',
        explanation: 'Tries are optimal for prefix-based searches and autocomplete features.'
      },
      {
        question: 'What is the recurrence relation for merge sort?',
        options: ['T(n) = T(n-1) + n', 'T(n) = 2T(n/2) + n', 'T(n) = T(n/2) + 1', 'T(n) = nT(n/2)'],
        answer: 'B',
        explanation: 'Merge sort divides into 2 subproblems of size n/2, then merges in O(n) time.'
      },
      {
        question: 'What is the purpose of the Union-Find (Disjoint Set Union) data structure?',
        options: ['Sorting elements', 'Managing connected components', 'Implementing queues', 'Storing graphs'],
        answer: 'B',
        explanation: 'Union-Find efficiently handles connectivity queries and component management.'
      },
      {
        question: 'What is the minimum spanning tree?',
        options: ['A tree with minimum height', 'A tree connecting all vertices with minimum total edge weight', 'The first tree formed', 'A binary tree'],
        answer: 'B',
        explanation: 'MST connects all vertices with minimum total edge weight. Algorithms: Kruskal\'s, Prim\'s.'
      }
    ],
  };

  // Return questions for the domain or default to JavaScript
  return mockQuestions[domain] || mockQuestions['JavaScript'];
};
