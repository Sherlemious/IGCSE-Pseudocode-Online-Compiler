/**
 * Standalone syntax pages. Each one explains the mechanism, shows the Python
 * equivalent, and adds the piece that sits outside the Cambridge syllabus.
 */

export type GuideBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string; kicker?: string }
  | { type: 'ul'; items: string[] }
  | { type: 'code'; code: string; output?: string }
  | { type: 'python'; code: string };

export type GuidePage = {
  slug: string;
  /** Blue-link title. Keep the searched phrase at the front. */
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  /** Matching section of the full Cambridge guide. */
  docsHref: string;
  blocks: GuideBlock[];
  related: string[];
};

export const GUIDE_PAGES: GuidePage[] = [
  {
    slug: 'byref-in-pseudocode',
    title: 'What BYREF Does in Pseudocode | 9618 Parameters',
    h1: 'What BYREF Does in Pseudocode',
    description:
      'BYREF in Cambridge 9618 pseudocode passes a variable so the procedure can change the caller. BYVAL passes a copy. BYREF stays in force for the following parameters until BYVAL.',
    keywords: [
      'what is byref in pseudocode',
      'BYREF pseudocode',
      'BYVAL pseudocode',
      '9618 parameters',
    ],
    docsHref: '/docs#alevel-byref',
    related: ['9618', 'declare-a-constant', 'not-equal-to'],
    blocks: [
      {
        type: 'p',
        text: 'A parameter is a name the procedure uses for a value the caller handed over. BYVAL means the procedure gets its own copy. BYREF means the procedure is handed the caller’s variable, so an assignment inside the procedure is an assignment out in the caller.',
      },
      { type: 'h2', kicker: 'How it works', text: 'The swap that does nothing' },
      {
        type: 'p',
        text: 'Leave the keyword off and both parameters are copies. SWAP exchanges X and Y, then throws those copies away. A and B are still 1 and 2.',
      },
      {
        type: 'code',
        code: `PROCEDURE SWAP(X : INTEGER, Y : INTEGER)
    DECLARE Temp : INTEGER
    Temp <- X
    X <- Y
    Y <- Temp
ENDPROCEDURE

DECLARE A : INTEGER
DECLARE B : INTEGER
A <- 1
B <- 2
CALL SWAP(A, B)
OUTPUT A
OUTPUT B`,
        output: '1\n2',
      },
      {
        type: 'p',
        text: 'Write BYREF once. It is sticky: it covers Y as well, until a later parameter says BYVAL. Now X and Y are A and B. The procedure writes through them, so the caller sees 2 and 1.',
      },
      {
        type: 'code',
        code: `PROCEDURE SWAP(BYREF X : INTEGER, Y : INTEGER)
    DECLARE Temp : INTEGER
    Temp <- X
    X <- Y
    Y <- Temp
ENDPROCEDURE

DECLARE A : INTEGER
DECLARE B : INTEGER
A <- 1
B <- 2
CALL SWAP(A, B)
OUTPUT A
OUTPUT B`,
        output: '2\n1',
      },
      {
        type: 'p',
        text: 'IGCSE procedures are always copies. BYREF and BYVAL are AS & A Level (9618). Both words are soft keywords, so a variable is allowed to be named BYREF.',
      },
      { type: 'h2', kicker: 'In Python', text: 'Integers do not have BYREF' },
      {
        type: 'p',
        text: 'Assigning to a Python parameter rebinds that local name. The caller’s integer is a different object, so the swap inside the function never touches a and b. You return the new pair, or you swap where a and b actually live.',
      },
      {
        type: 'python',
        code: `def swap(x, y):
    x, y = y, x

a, b = 1, 2
swap(a, b)
print(a, b)  # 1 2

a, b = b, a
print(a, b)  # 2 1`,
      },
      {
        type: 'p',
        text: 'A list is shared. The function and the caller hold the same list, so writing into it is the BYREF feeling. That is still not a reference parameter: the name nums was not passed by reference, the list object was shared.',
      },
      {
        type: 'python',
        code: `def stamp(box):
    box[0] = 9

nums = [1]
stamp(nums)
print(nums[0])  # 9`,
      },
      { type: 'h2', kicker: 'Beyond the exam', text: 'Two different ideas get called “by reference”' },
      {
        type: 'p',
        text: 'Cambridge BYREF means “this parameter is that variable.” Python, and Java, pass the value of a reference: the function receives a copy of a pointer that still aims at the same object. Rebinding the parameter changes the copy of the pointer. Mutating the object changes what everyone can see. C++ has an actual reference parameter, which is the Cambridge meaning. Converting a scalar BYREF to Python keeps the function, and warns that assignments inside it will not come back to the caller.',
      },
    ],
  },
  {
    slug: '9618',
    title: '9618 Pseudocode Guide | Cambridge AS & A Level',
    h1: '9618 Pseudocode Guide',
    description:
      'Cambridge 9618 pseudocode guide for AS & A Level Computer Science: records are copied, objects are shared, plus DATE, BYREF and CASE ranges.',
    keywords: [
      '9618 pseudocode guide',
      'pseudocode guide 9618',
      'a level pseudocode guide',
      'cie pseudocode guide',
      'cambridge pseudocode',
      '9618 pseudocode guide 2026',
    ],
    docsHref: '/docs#alevel',
    related: ['byref-in-pseudocode', 'div-in-pseudocode', 'declare-a-constant'],
    blocks: [
      {
        type: 'p',
        text: 'IGCSE pseudocode already has variables, loops, arrays and procedures. 9618 adds ways to group data and to share it. The sharp edge is which assignments copy and which ones alias.',
      },
      { type: 'h2', kicker: 'How it works', text: 'A record is copied. An object is shared.' },
      {
        type: 'p',
        text: 'B <- A on a record duplicates the fields. Changing B.Score leaves A.Score at 1. The two variables are not the same record.',
      },
      {
        type: 'code',
        code: `TYPE StudentRecord
    DECLARE Score : INTEGER
ENDTYPE

DECLARE A : StudentRecord
DECLARE B : StudentRecord
A.Score <- 1
B <- A
B.Score <- 9
OUTPUT A.Score`,
        output: '1',
      },
      {
        type: 'p',
        text: 'B <- A on a class object copies the reference, not the object. B.Set writes the object A still points at, so A.Get() is 9. Two variables, one counter.',
      },
      {
        type: 'code',
        code: `CLASS Counter
    PRIVATE Value : INTEGER
    PUBLIC PROCEDURE NEW(Start : INTEGER)
        Value <- Start
    ENDPROCEDURE
    PUBLIC PROCEDURE Set(N : INTEGER)
        Value <- N
    ENDPROCEDURE
    PUBLIC FUNCTION Get() RETURNS INTEGER
        RETURN Value
    ENDFUNCTION
ENDCLASS

DECLARE A : Counter
DECLARE B : Counter
A <- NEW Counter(1)
B <- A
CALL B.Set(9)
OUTPUT A.Get()`,
        output: '9',
      },
      {
        type: 'p',
        text: 'That split is the rest of the A Level guide in miniature. BYREF is the procedure version of the shared object: the parameter is the caller’s variable. DATE values compare as dates, not as text. A CASE range such as 80 TO 100 is one label covering every integer in it. The full syntax, including pointers, sets and random-access files, stays in the Cambridge pseudocode guide. Practise in order on the 9618 path.',
      },
      { type: 'h2', kicker: 'In Python', text: 'Assignment shares, unless you copy' },
      {
        type: 'p',
        text: 'Python objects behave like the class, not like the record. b = a makes a second name for the same dict. b = a.copy() is the record assignment.',
      },
      {
        type: 'python',
        code: `a = {"score": 1}
b = a
b["score"] = 9
print(a["score"])  # 9

a = {"score": 1}
b = a.copy()
b["score"] = 9
print(a["score"])  # 1`,
      },
      { type: 'h2', kicker: 'Beyond the exam', text: 'Value types and reference types' },
      {
        type: 'p',
        text: 'Languages pick a default and then give you an escape hatch. Cambridge copies records and shares objects. Python shares almost everything and makes you ask for a copy. C copies structs and makes you ask for a pointer. The exam wants you to know which Cambridge assignment is which. The useful habit is to ask, before you write B <- A, whether you wanted a snapshot or a second name.',
      },
    ],
  },
  {
    slug: 'div-in-pseudocode',
    title: 'What DIV Does in Pseudocode | MOD for IGCSE & 9618',
    h1: 'What DIV Does in Pseudocode',
    description:
      'DIV in Cambridge pseudocode is integer division toward zero. 10 DIV 3 is 3 and -7 DIV 3 is -2. MOD is the remainder. Python // floors instead.',
    keywords: [
      'what does div do in pseudocode',
      'div in pseudocode',
      'what is div in pseudocode',
      'div function in pseudocode',
      'mod and div in pseudocode',
      'how to use mod in pseudocode',
    ],
    docsHref: '/docs#arithmetic',
    related: ['round-in-pseudocode', 'not-equal-to', '9618'],
    blocks: [
      {
        type: 'p',
        text: 'DIV counts how many whole times the second number fits into the first, then drops the fraction. It does not round. 10 DIV 3 is 3, because 3 fits three times and the leftover 1 is not enough for a fourth.',
      },
      { type: 'h2', kicker: 'How it works', text: 'DIV and MOD rebuild the original number' },
      {
        type: 'p',
        text: 'MOD is that leftover. Together they are a pair: take the whole part, multiply back, add the remainder, and you return to the number you started with. Ordinary / keeps the fraction, so 10 / 4 is 2.5. Write DIV between the operands in an exam answer. DIV(10, 3) also runs here. The infix form is the one mark schemes use.',
      },
      {
        type: 'code',
        code: `OUTPUT 10 DIV 3
OUTPUT 10 MOD 3
OUTPUT (10 DIV 3) * 3 + (10 MOD 3)
OUTPUT -7 DIV 3`,
        output: '3\n1\n10\n-2',
      },
      {
        type: 'p',
        text: '-7 DIV 3 is -2, not -3. The fraction is cut off toward zero. -2.333 becomes -2. That is truncation, the same cut INT uses.',
      },
      { type: 'h2', kicker: 'In Python', text: '// floors. DIV does not.' },
      {
        type: 'p',
        text: 'For positive numbers, Python // matches DIV. For negatives it does not. // rounds toward negative infinity, so -7 // 3 is -3. This site’s Python converter emits a small DIV function for that reason, instead of trusting //.',
      },
      {
        type: 'python',
        code: `print(10 // 3)   # 3
print(-7 // 3)   # -3, not the Cambridge result
print(-7 / 3)    # -2.333...`,
      },
      { type: 'h2', kicker: 'Beyond the exam', text: 'Toward zero, or toward negative infinity' },
      {
        type: 'p',
        text: 'Integer division has two honest answers once a sign appears, and languages picked differently. Cambridge, C, Java and JavaScript cut toward zero. Python and the older maths convention of the floor function go down. The remainder has to follow the same choice, or the rebuild identity breaks. If a question stays with positive integers, both languages agree and you will not see the split.',
      },
    ],
  },
  {
    slug: 'round-in-pseudocode',
    title: 'How to Round in Pseudocode | ROUND and INT',
    h1: 'How to Round in Pseudocode',
    description:
      'ROUND(2.5, 0) is 3 on this compiler. INT cuts toward zero. Python 3 round(2.5) is 2, because a tie goes to the even integer.',
    keywords: [
      'how to round in pseudocode',
      'round in pseudocode',
      'round pseudocode',
      'ROUND function pseudocode',
    ],
    docsHref: '/docs#math-functions',
    related: ['div-in-pseudocode', 'random-in-pseudocode', 'declare-a-constant'],
    blocks: [
      {
        type: 'p',
        text: 'ROUND(n, places) looks at the following digit and decides whether the last kept digit moves. places is how many digits survive after the decimal point. ROUND(3.14159, 2) keeps two, sees that the next digit is 1, and stays at 3.14.',
      },
      { type: 'h2', kicker: 'How it works', text: 'A positive half steps up. INT never steps.' },
      {
        type: 'p',
        text: 'The interesting case is a tie. ROUND(2.5, 0) is 3: the .5 is enough to leave 2. INT does not make that decision. It deletes the fraction, toward zero, so INT(7.9) is 7 and INT(-2.3) is -2. Use ROUND when the question says “to 2 decimal places.” Use INT when it says “the whole number part.”',
      },
      {
        type: 'code',
        code: `OUTPUT ROUND(3.14159, 2)
OUTPUT ROUND(2.5, 0)
OUTPUT INT(7.9)
OUTPUT INT(-2.3)`,
        output: '3.14\n3\n7\n-2',
      },
      { type: 'h2', kicker: 'In Python', text: 'A half goes to the even integer' },
      {
        type: 'p',
        text: 'Python’s built-in round uses bankers’ rounding. A value ending in exactly 5 rounds to the nearest even digit, so round(2.5) is 2 and round(3.5) is 4. The 3.14 case matches Cambridge. The tie does not. The converter ships its own ROUND helper rather than calling Python’s round.',
      },
      {
        type: 'python',
        code: `print(round(3.14159, 2))  # 3.14
print(round(2.5))         # 2
print(round(3.5))         # 4
print(int(7.9))           # 7, same cut as INT`,
      },
      { type: 'h2', kicker: 'Beyond the exam', text: 'Why a half is a fight' },
      {
        type: 'p',
        text: 'If every positive .5 rounds up, a long column of measurements drifts high. Bankers’ rounding sends half of those ties up and half down, so the drift cancels. This compiler, like a school calculator on a positive number, takes the simpler rule: 2.5 becomes 3. Either rule is a choice about ties. They agree whenever the following digit is not exactly 5.',
      },
    ],
  },
  {
    slug: 'declare-a-constant',
    title: 'How to Declare a Constant in Pseudocode',
    h1: 'How to Declare a Constant in Pseudocode',
    description:
      'CONSTANT Name <- value binds a name that later assignments cannot change. Python has no constant: a capitalised name is only a convention.',
    keywords: [
      'how to declare a constant in pseudocode',
      'how to declare constant in pseudocode',
      'CONSTANT pseudocode',
      'declare constant IGCSE',
    ],
    docsHref: '/docs#constants',
    related: ['not-equal-to', 'div-in-pseudocode', '9618'],
    blocks: [
      {
        type: 'p',
        text: 'CONSTANT binds a name to a value for the rest of the program. CONSTANT Passing <- 50. Every later line may read Passing. No line may assign to it, including a line inside a procedure.',
      },
      { type: 'h2', kicker: 'How it works', text: 'The name is locked after the first binding' },
      {
        type: 'p',
        text: 'DECLARE creates a variable: a slot you can overwrite. CONSTANT creates a name for a value the task has promised will not change, a pass mark, a rate, a size. The lock is checked when the program runs. Passing <- 40 later is an error, not a quiet second value.',
      },
      {
        type: 'code',
        code: `CONSTANT Passing <- 50
DECLARE Mark : INTEGER
Mark <- 64
IF Mark >= Passing THEN
    OUTPUT "Pass"
ENDIF`,
        output: 'Pass',
      },
      { type: 'h2', kicker: 'In Python', text: 'Capitals are a promise, not a lock' },
      {
        type: 'p',
        text: 'Python will not stop you. PASSING = 50 and then PASSING = 40 is a legal program. The capital letters are a convention other programmers recognise, which is weaker than a language rule. A tuple or a frozen object can hold a value you do not mean to edit, but that is a different tool.',
      },
      {
        type: 'python',
        code: `PASSING = 50
mark = 64
if mark >= PASSING:
    print("Pass")

PASSING = 40  # allowed. Python has no CONSTANT.`,
      },
      { type: 'h2', kicker: 'Beyond the exam', text: 'What the lock is for' },
      {
        type: 'p',
        text: 'A constant gives the reader a name instead of a bare 50, and it gives the language permission to assume the value never moves. In a compiled language that assumption can become a literal baked into the instructions. In an exam it is simpler than that: if the pass mark changes, it changes on one line, and a mistaken assignment is a mistake the interpreter will say out loud.',
      },
    ],
  },
  {
    slug: 'not-equal-to',
    title: 'Not Equal To in Pseudocode | The <> Sign',
    h1: 'Not Equal To in Pseudocode',
    description:
      'The not equal sign in Cambridge IGCSE and 9618 pseudocode is <>. Python, C and Java use !=. There is no /=.',
    keywords: [
      'not equal to in pseudocode',
      'not equal sign in pseudocode',
      '<> pseudocode',
      'not equal IGCSE',
    ],
    docsHref: '/docs#comparison',
    related: ['declare-a-constant', 'div-in-pseudocode', 'round-in-pseudocode'],
    blocks: [
      {
        type: 'p',
        text: '<> is a question, not an assignment. It is true when the two sides are different. IF Count <> 0 THEN reads “if count is not zero.” The opposite question is =.',
      },
      { type: 'h2', kicker: 'How it works', text: 'One sign, and it is not the Python one' },
      {
        type: 'p',
        text: 'Cambridge has no != and no /=. Those are other languages, and this compiler rejects them. The editor can offer <> when it sees !=. The rest of the comparisons are <, >, <= and >=. Prefer <- for storing a value, so a lone = stays visibly a test.',
      },
      {
        type: 'code',
        code: `DECLARE Count : INTEGER
Count <- 3
IF Count <> 0 THEN
    OUTPUT "Still counting"
ENDIF`,
        output: 'Still counting',
      },
      { type: 'h2', kicker: 'In Python', text: 'The same test is !=' },
      {
        type: 'python',
        code: `count = 3
if count != 0:
    print("Still counting")`,
      },
      { type: 'h2', kicker: 'Beyond the exam', text: 'Where <> came from' },
      {
        type: 'p',
        text: '<> is the not-equal of BASIC, Pascal and SQL. C wrote !=, and Python, Java and JavaScript followed C. The two signs mean the same comparison. They are not interchangeable inside one language: a Cambridge script with != is a syntax error, and a Python script with <> has been a syntax error since Python 3. When you move a program across, this is one of the characters you translate on purpose.',
      },
    ],
  },
  {
    slug: 'random-in-pseudocode',
    title: 'Random in Pseudocode | IGCSE RANDOM()',
    h1: 'Random in Pseudocode',
    description:
      'RANDOM() returns a number from 0 up to but not including 1. Scale it and cut with INT, not ROUND, so each face of a die is equally likely. Python’s random.random() has the same shape.',
    keywords: [
      'random in pseudocode igcse',
      'RANDOM pseudocode',
      'random number pseudocode',
    ],
    docsHref: '/docs#math-functions',
    related: ['round-in-pseudocode', 'div-in-pseudocode', '9618'],
    blocks: [
      {
        type: 'p',
        text: 'RANDOM() takes no arguments and returns a real number from 0 inclusive up to 1 exclusive. You do not declare it. A die needs a whole number, so the usual move is to stretch that unit interval and then cut it.',
      },
      { type: 'h2', kicker: 'How it works', text: 'Stretch the interval, then cut. Do not round.' },
      {
        type: 'p',
        text: 'RANDOM() * 6 lands somewhere in 0 up to 6, never quite 6. INT deletes the fraction, so the result is 0, 1, 2, 3, 4 or 5, each from an equal sixth of the line. Add 1 and the die reads 1 to 6. ROUND would be the wrong cut: values just below 6 would become 6, and values just above 0 would become 0, so the two end faces would not get a fair share.',
      },
      {
        type: 'code',
        code: `DECLARE Roll : INTEGER
Roll <- INT(RANDOM() * 6) + 1
OUTPUT Roll`,
      },
      {
        type: 'p',
        text: 'A Level also has RAND(x), a real from 0 up to x, not including x. OPENFILE FOR RANDOM is unrelated. That RANDOM is the file mode where records have positions. It is in the 9618 guide, not a call to this function.',
      },
      { type: 'h2', kicker: 'In Python', text: 'random.random, or randint when you want the die' },
      {
        type: 'p',
        text: 'random.random() is RANDOM(): 0 up to 1. random.randint(1, 6) already includes both ends, so you do not add 1 and you do not call int yourself.',
      },
      {
        type: 'python',
        code: `import random

print(random.random())       # 0 up to 1, like RANDOM()
print(random.randint(1, 6))  # 1, 2, 3, 4, 5 or 6`,
      },
      { type: 'h2', kicker: 'Beyond the exam', text: 'It is a sequence, not a coin' },
      {
        type: 'p',
        text: 'The next value is calculated from hidden state inside the generator. Same algorithm, same starting state, same rolls. That is a pseudorandom sequence, which is what Python’s random module is too. It is unpredictable enough for a game and a simulation. It is not a measurement of a physical coin, and it is the wrong tool for a secret. Seeding the generator, so a test can replay the same rolls, is the ordinary next step once you leave the exam.',
      },
    ],
  },
];

const bySlug = new Map(GUIDE_PAGES.map((page) => [page.slug, page]));

export function getGuidePage(slug: string) {
  return bySlug.get(slug);
}

export function guideHref(slug: string) {
  return `/guide/${slug}`;
}
