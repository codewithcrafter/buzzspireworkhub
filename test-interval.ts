import { normalizeIntervals, intersectIntervals, subtractIntervals, calculateTotalDurationSeconds, TimeInterval } from "./src/lib/interval";

function runTests() {
  let passed = 0;
  let failed = 0;

  function assertEqual(name: string, actual: any, expected: any) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
      console.error(`   Expected: ${JSON.stringify(expected)}`);
      console.error(`   Actual:   ${JSON.stringify(actual)}`);
      failed++;
    }
  }

  // Test 1: Normalize disjoint
  assertEqual(
    "Normalize Disjoint",
    normalizeIntervals([{ start: 10, end: 20 }, { start: 30, end: 40 }]),
    [{ start: 10, end: 20 }, { start: 30, end: 40 }]
  );

  // Test 2: Normalize overlapping
  assertEqual(
    "Normalize Overlapping",
    normalizeIntervals([{ start: 10, end: 30 }, { start: 20, end: 40 }]),
    [{ start: 10, end: 40 }]
  );

  // Test 3: Intersect
  assertEqual(
    "Intersect Overlapping",
    intersectIntervals([{ start: 10, end: 30 }], [{ start: 20, end: 40 }]),
    [{ start: 20, end: 30 }]
  );

  // Test 4: Subtract Middle
  assertEqual(
    "Subtract Middle",
    subtractIntervals([{ start: 10, end: 40 }], [{ start: 20, end: 30 }]),
    [{ start: 10, end: 20 }, { start: 30, end: 40 }]
  );

  // Test 5: Subtract Overlapping End
  assertEqual(
    "Subtract End",
    subtractIntervals([{ start: 10, end: 40 }], [{ start: 30, end: 50 }]),
    [{ start: 10, end: 30 }]
  );

  // Test 6: Subtract completely encompassing
  assertEqual(
    "Subtract Encompassing",
    subtractIntervals([{ start: 20, end: 30 }], [{ start: 10, end: 40 }]),
    []
  );

  // Test 7: Calculate duration
  assertEqual(
    "Calculate Duration (seconds)",
    calculateTotalDurationSeconds([{ start: 1000, end: 3000 }, { start: 4000, end: 7000 }]),
    5 // 2000ms + 3000ms = 5000ms -> 5s
  );

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runTests();
