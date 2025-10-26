INSERT INTO contests (id, name, description) VALUES
(1, 'Sample Programming Contest', 'A beginner-friendly programming contest with basic algorithmic problems');

INSERT INTO problems (id, title, description, sample_input, expected_output, points, contest_id) VALUES
(1, 'Add Two Numbers', 'Write a program that reads two integers and outputs their sum.

Input Format:
Two space-separated integers a and b

Output Format:
A single integer representing a + b

Constraints:
-1000 ≤ a, b ≤ 1000', '2 3', '5', 100, 1),

(2, 'Square a Number', 'Write a program that reads an integer and outputs its square.

Input Format:
A single integer n

Output Format:
A single integer representing n²

Constraints:
-100 ≤ n ≤ 100', '4', '16', 100, 1),

(3, 'Find Factorial', 'Write a program that calculates the factorial of a given number.

Input Format:
A single integer n

Output Format:
A single integer representing n!

Constraints:
0 ≤ n ≤ 12

Note: 0! = 1', '5', '120', 150, 1);
